import os
import base64
import httpx
from pathlib import Path
from app.config import GO_API_KEY  # reuse httpx pattern

WORKSPACE = Path(__file__).parent.parent.parent / "workspace"
GITHUB_API = "https://api.github.com"


class GitHubClient:
    def __init__(self, token: str = ""):
        self.token = token or os.getenv("GITHUB_TOKEN", "")
        self._client = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            headers = {
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            }
            if self.token:
                headers["Authorization"] = f"Bearer {self.token}"
            self._client = httpx.AsyncClient(headers=headers, timeout=30.0)
        return self._client

    async def close(self):
        if self._client:
            await self._client.aclose()
            self._client = None

    async def verify_token(self) -> dict:
        if not self.token:
            return {"valid": False, "error": "No token configured"}
        try:
            client = await self._get_client()
            r = await client.get(f"{GITHUB_API}/user")
            if r.status_code == 200:
                user = r.json()
                return {"valid": True, "user": user.get("login"), "avatar": user.get("avatar_url")}
            return {"valid": False, "error": f"HTTP {r.status_code}: {r.text[:200]}"}
        except Exception as e:
            return {"valid": False, "error": str(e)}

    async def create_repo(self, name: str, description: str = "", private: bool = False) -> dict:
        if not self.token:
            return {"error": "GitHub token not configured"}
        try:
            client = await self._get_client()
            payload = {"name": name, "description": description, "private": private, "auto_init": False}
            r = await client.post(f"{GITHUB_API}/user/repos", json=payload)
            if r.status_code in (201, 200):
                data = r.json()
                return {"success": True, "url": data.get("html_url"), "clone_url": data.get("clone_url"), "name": data.get("name")}
            return {"error": f"HTTP {r.status_code}: {r.text[:300]}"}
        except Exception as e:
            return {"error": str(e)}

    async def list_repos(self) -> dict:
        if not self.token:
            return {"error": "GitHub token not configured"}
        try:
            client = await self._get_client()
            r = await client.get(f"{GITHUB_API}/user/repos?sort=updated&per_page=20")
            if r.status_code == 200:
                repos = r.json()
                return {"repos": [{"name": repo["name"], "url": repo["html_url"], "private": repo["private"], "updated": repo["updated_at"]} for repo in repos]}
            return {"error": f"HTTP {r.status_code}"}
        except Exception as e:
            return {"error": str(e)}

    async def push_files(self, repo: str, files: list[dict], message: str = "Update from MAE", branch: str = "main") -> dict:
        if not self.token:
            return {"error": "GitHub token not configured"}
        try:
            client = await self._get_client()
            user_data = await client.get(f"{GITHUB_API}/user")
            if user_data.status_code != 200:
                return {"error": "Invalid token"}
            owner = user_data.json()["login"]

            sha_map = {}
            try:
                ref_r = await client.get(f"{GITHUB_API}/repos/{owner}/{repo}/git/refs/heads/{branch}")
                if ref_r.status_code == 200:
                    base_sha = ref_r.json()["object"]["sha"]
                    tree_r = await client.get(f"{GITHUB_API}/repos/{owner}/{repo}/git/trees/{base_sha}?recursive=1")
                    if tree_r.status_code == 200:
                        for item in tree_r.json().get("tree", []):
                            sha_map[item["path"]] = item["sha"]
            except Exception:
                pass

            tree_items = []
            for f in files:
                tree_items.append({
                    "path": f["path"],
                    "mode": "100644",
                    "type": "blob",
                    "content": f["content"],
                })

            tree_r = await client.post(f"{GITHUB_API}/repos/{owner}/{repo}/git/trees", json={"tree": tree_items})
            if tree_r.status_code != 201:
                return {"error": f"Tree creation failed: {tree_r.text[:200]}"}
            tree_sha = tree_r.json()["sha"]

            commit_payload = {
                "message": message,
                "tree": tree_sha,
            }
            if base_sha := sha_map.get(".gitignore") or sha_map.get("README.md"):
                try:
                    parent_r = await client.get(f"{GITHUB_API}/repos/{owner}/{repo}/git/commits?per_page=1")
                    if parent_r.status_code == 200 and parent_r.json():
                        commit_payload["parents"] = [parent_r.json()[0]["sha"]]
                except Exception:
                    pass

            commit_r = await client.post(f"{GITHUB_API}/repos/{owner}/{repo}/git/commits", json=commit_payload)
            if commit_r.status_code != 201:
                return {"error": f"Commit failed: {commit_r.text[:200]}"}
            commit_sha = commit_r.json()["sha"]

            ref_r2 = await client.patch(
                f"{GITHUB_API}/repos/{owner}/{repo}/git/refs/heads/{branch}",
                json={"sha": commit_sha, "force": True},
            )

            return {"success": True, "repo": f"{owner}/{repo}", "branch": branch, "files": len(files)}
        except Exception as e:
            return {"error": str(e)}

    async def get_readme(self, repo: str) -> dict:
        try:
            client = await self._get_client()
            user_r = await client.get(f"{GITHUB_API}/user")
            if user_r.status_code != 200:
                return {"error": "Invalid token"}
            owner = user_r.json()["login"]
            r = await client.get(f"{GITHUB_API}/repos/{owner}/{repo}/readme")
            if r.status_code == 200:
                data = r.json()
                content = base64.b64decode(data["content"]).decode("utf-8")
                return {"content": content, "path": data["path"]}
            return {"error": f"HTTP {r.status_code}"}
        except Exception as e:
            return {"error": str(e)}
