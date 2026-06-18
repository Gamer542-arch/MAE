from __future__ import annotations
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from pathlib import Path
import shutil

router = APIRouter()
WORKSPACE = Path(__file__).parent.parent.parent / "workspace"
TEMPLATES_DIR = Path(__file__).parent.parent.parent / "templates"


class CreateProjectRequest(BaseModel):
    project: str
    language: str = "python"
    template: str = "empty"
    ext: str = "py"


@router.get("/list")
async def list_projects():
    try:
        if not WORKSPACE.exists():
            return []
        projects = []
        for folder in sorted(WORKSPACE.iterdir()):
            if folder.is_dir() and not folder.name.startswith('.'):
                projects.append({"name": folder.name, "path": str(folder)})
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/templates")
async def list_templates(language: str = Query("python")):
    """List available templates for a language"""
    lang_dir = TEMPLATES_DIR / language
    if not lang_dir.exists():
        return []
    templates = []
    for folder in sorted(lang_dir.iterdir()):
        if folder.is_dir():
            templates.append({
                "id": folder.name,
                "name": folder.name.replace("-", " ").title(),
                "files": [str(f.relative_to(folder)) for f in folder.rglob("*") if f.is_file()],
            })
    return templates


@router.post("/create")
async def create_project(req: CreateProjectRequest):
    try:
        project_dir = WORKSPACE / req.project
        project_dir.mkdir(parents=True, exist_ok=True)

        # Copy template files from templates/{lang}/{template}/
        template_dir = TEMPLATES_DIR / req.language / req.template
        if template_dir.exists():
            _copy_templates(template_dir, project_dir, req.project)
        else:
            # Fallback to empty
            fallback = TEMPLATES_DIR / req.language / "empty"
            if fallback.exists():
                _copy_templates(fallback, project_dir, req.project)
            else:
                (project_dir / "README.md").write_text(f"# {req.project}\n", encoding="utf-8")

        # Always create README.md if not in template
        readme = project_dir / "README.md"
        if not readme.exists():
            readme.write_text(f"# {req.project}\n\nLanguage: {req.language}\nTemplate: {req.template}\n", encoding="utf-8")

        # .env.example
        env = project_dir / ".env.example"
        if not env.exists():
            env.write_text(f"# {req.project}\n\n", encoding="utf-8")

        return {"ok": True, "project": req.project, "path": str(project_dir)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _copy_templates(src: Path, dst: Path, project_name: str):
    """Copy template files, replacing {name} placeholders"""
    for item in src.rglob("*"):
        if item.is_file():
            rel = item.relative_to(src)
            target = dst / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            content = item.read_text(encoding="utf-8")
            content = content.replace("{name}", project_name)
            target.write_text(content, encoding="utf-8")
