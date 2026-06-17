from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.extension_manager import ExtensionManager
from typing import Optional

router = APIRouter()
em = ExtensionManager()


class ExtensionManifest(BaseModel):
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


@router.get("/list")
async def list_extensions():
    return em.list_all()


@router.get("/get")
async def get_extension(name: str):
    ext = em.get(name)
    if not ext:
        raise HTTPException(status_code=404, detail=f"Extension '{name}' not found")
    return ext


@router.post("/install")
async def install_extension(manifest: ExtensionManifest):
    validation = em.validate_manifest(manifest.model_dump())
    if not validation["valid"]:
        raise HTTPException(status_code=400, detail=validation["errors"])
    result = em.install(manifest.model_dump())
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.delete("/uninstall")
async def uninstall_extension(name: str):
    result = em.uninstall(name)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/validate")
async def validate_manifest(manifest: ExtensionManifest):
    return em.validate_manifest(manifest.model_dump())
