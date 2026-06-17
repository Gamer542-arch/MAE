from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.core.github_client import GitHubClient
import os

router = APIRouter()


class PushRequest(BaseModel):
    repo: str
    files: list[dict]
    message: str = "Update from MAE"
    branch: str = "main"


class CreateRepoRequest(BaseModel):
    name: str
    description: str = ""
    private: bool = False


def _get_client(x_github_token: str = ""):
    token = x_github_token or os.getenv("GITHUB_TOKEN", "")
    return GitHubClient(token)


@router.get("/verify")
async def verify_token(x_github_token: str = Header("", alias="X-GitHub-Token")):
    client = _get_client(x_github_token)
    result = await client.verify_token()
    await client.close()
    return result


@router.get("/repos")
async def list_repos(x_github_token: str = Header("", alias="X-GitHub-Token")):
    client = _get_client(x_github_token)
    result = await client.list_repos()
    await client.close()
    return result


@router.post("/create-repo")
async def create_repo(req: CreateRepoRequest, x_github_token: str = Header("", alias="X-GitHub-Token")):
    client = _get_client(x_github_token)
    result = await client.create_repo(req.name, req.description, req.private)
    await client.close()
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.post("/push")
async def push_files(req: PushRequest, x_github_token: str = Header("", alias="X-GitHub-Token")):
    client = _get_client(x_github_token)
    result = await client.push_files(req.repo, req.files, req.message, req.branch)
    await client.close()
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.get("/readme")
async def get_readme(repo: str, x_github_token: str = Header("", alias="X-GitHub-Token")):
    client = _get_client(x_github_token)
    result = await client.get_readme(repo)
    await client.close()
    return result
