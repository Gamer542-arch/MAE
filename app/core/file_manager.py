from __future__ import annotations
import shutil
from pathlib import Path

WORKSPACE = Path(__file__).parent.parent.parent / "workspace"


class FileManager:
    def __init__(self):
        WORKSPACE.mkdir(exist_ok=True)

    def _resolve(self, path: str) -> Path:
        path = path.replace("%~/", "").replace("%~", "")
        p = (WORKSPACE / path).resolve()
        if not str(p).startswith(str(WORKSPACE.resolve())):
            raise PermissionError("Path outside workspace")
        return p

    def _safe_path(self, rel: str) -> Path:
        return self._resolve(rel)

    def list(self, path: str = "") -> list[dict]:
        base = self._resolve(path) if path else WORKSPACE
        if not base.exists():
            return []
        items = []
        for entry in sorted(base.iterdir(), key=lambda e: (not e.is_dir(), e.name.lower())):
            if entry.name.startswith('.'):
                continue
            try:
                stat = entry.stat()
                items.append({
                    "name": entry.name,
                    "path": str(entry.relative_to(WORKSPACE)).replace("\\", "/"),
                    "type": "folder" if entry.is_dir() else "file",
                    "size": stat.st_size if entry.is_file() else 0,
                    "modified": stat.st_mtime,
                })
            except OSError:
                continue
        return items

    def read(self, path: str) -> str:
        p = self._resolve(path)
        if not p.is_file():
            raise FileNotFoundError(f"Not a file: {path}")
        return p.read_text(encoding="utf-8")

    def write(self, path: str, content: str) -> dict:
        p = self._resolve(path)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content, encoding="utf-8")
        return {"path": str(p.relative_to(WORKSPACE)).replace("\\", "/"), "size": len(content)}

    def delete(self, path: str) -> dict:
        p = self._resolve(path)
        if not p.exists():
            raise FileNotFoundError(f"Not found: {path}")
        if p.is_dir():
            shutil.rmtree(p)
        else:
            p.unlink()
        return {"deleted": path}

    def mkdir(self, path: str) -> dict:
        p = self._resolve(path)
        p.mkdir(parents=True, exist_ok=True)
        return {"created": path}

    def rename(self, old_path: str, new_name: str) -> dict:
        p = self._resolve(old_path)
        if not p.exists():
            raise FileNotFoundError(f"Not found: {old_path}")
        new_path = p.parent / new_name
        p.rename(new_path)
        return {"path": str(new_path.relative_to(WORKSPACE)).replace("\\", "/")}

    def search(self, query: str, path: str = "") -> list[dict]:
        results = []
        base = self._resolve(path) if path else WORKSPACE
        q = query.lower()
        for entry in base.rglob("*"):
            if entry.name.startswith('.'):
                continue
            try:
                rel = str(entry.relative_to(WORKSPACE)).replace("\\", "/")
                if q in entry.name.lower() or q in rel.lower():
                    stat = entry.stat()
                    results.append({
                        "name": entry.name,
                        "path": rel,
                        "type": "folder" if entry.is_dir() else "file",
                        "size": stat.st_size if entry.is_file() else 0,
                    })
            except (OSError, ValueError):
                continue
        return results

    def tree(self, path: str = "", depth: int = 5) -> list[dict]:
        def _walk(p: Path, d: int) -> list[dict]:
            if d <= 0:
                return []
            items = []
            for entry in sorted(p.iterdir(), key=lambda e: (not e.is_dir(), e.name.lower())):
                try:
                    if entry.name.startswith('.'):
                        continue
                    rel = str(entry.relative_to(WORKSPACE)).replace("\\", "/")
                    node = {
                        "name": entry.name,
                        "path": rel,
                        "type": "folder" if entry.is_dir() else "file",
                    }
                    if entry.is_dir():
                        node["children"] = _walk(entry, d - 1)
                    items.append(node)
                except OSError:
                    continue
            return items

        base = self._resolve(path) if path else WORKSPACE
        if not base.exists():
            return []
        return _walk(base, depth)
