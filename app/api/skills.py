from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.skill_manager import SkillManager
from typing import Optional

router = APIRouter()
sm = SkillManager()


class SkillManifest(BaseModel):
    name: str
    displayName: str
    version: str
    description: str = ""
    author: str = ""
    icon: str = ""
    color: str = ""
    entryPoint: str = ""
    repository: str = ""
    startCommand: str = ""
    folder: str = ""
    executeCommand: str = ""
    capabilities: list[str] = []
    prompt: str = ""
    systemPrompt: str = ""
    tools: list[dict] = []


@router.get("/list")
async def list_skills():
    return sm.list_all()


@router.get("/get")
async def get_skill(name: str):
    skill = sm.get(name)
    if not skill:
        raise HTTPException(status_code=404, detail=f"Skill '{name}' not found")
    return skill


@router.post("/install")
async def install_skill(manifest: SkillManifest):
    validation = sm.validate_manifest(manifest.model_dump())
    if not validation["valid"]:
        raise HTTPException(status_code=400, detail=validation["errors"])
    result = sm.install(manifest.model_dump())
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.delete("/uninstall")
async def uninstall_skill(name: str):
    result = sm.uninstall(name)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/validate")
async def validate_manifest(manifest: SkillManifest):
    return sm.validate_manifest(manifest.model_dump())
