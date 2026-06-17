from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from app.core.file_manager import FileManager

router = APIRouter()
fm = FileManager()


class WriteRequest(BaseModel):
    path: str
    content: str


class RenameRequest(BaseModel):
    old_path: str
    new_name: str


@router.get("/list")
async def list_files(path: str = ""):
    return fm.list(path)


@router.get("/tree")
async def tree(path: str = "", depth: int = 5):
    return fm.tree(path, depth)


@router.get("/read")
async def read_file(path: str = Query(...)):
    try:
        return {"content": fm.read(path), "path": path}
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/write")
async def write_file(req: WriteRequest):
    try:
        return fm.write(req.path, req.content)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.delete("/delete")
async def delete_file(path: str = Query(...)):
    try:
        return fm.delete(path)
    except (FileNotFoundError, PermissionError) as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/mkdir")
async def create_folder(path: str = Query(...)):
    try:
        return fm.mkdir(path)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.post("/rename")
async def rename_file(req: RenameRequest):
    try:
        return fm.rename(req.old_path, req.new_name)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/search")
async def search_files(q: str = Query(...), path: str = ""):
    return fm.search(q, path)
