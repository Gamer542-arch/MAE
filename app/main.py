from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from app.api import ai, files, execute, github, extensions, skills
from app.config import HOST, PORT
import uvicorn
from pathlib import Path

app = FastAPI(title="MAE - Make Anything Editor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
app.include_router(files.router, prefix="/api/files", tags=["Files"])
app.include_router(execute.router, prefix="/api/execute", tags=["Execute"])
app.include_router(github.router, prefix="/api/github", tags=["GitHub"])
app.include_router(extensions.router, prefix="/api/extensions", tags=["Extensions"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skills"])

app.mount("/css", StaticFiles(directory="frontend/css"), name="css")
app.mount("/js", StaticFiles(directory="frontend/js"), name="js")
app.mount("/extensions", StaticFiles(directory="extensions"), name="extensions")
app.mount("/workspace", StaticFiles(directory="workspace", html=True), name="workspace")


@app.get("/")
async def root():
    return FileResponse("frontend/index.html")


@app.get("/docs")
async def docs():
    return FileResponse("frontend/docs.html")


@app.get("/preview/{file_path:path}")
async def preview_html(file_path: str):
    workspace = Path("workspace")
    target = workspace / file_path
    if not target.exists():
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="File not found")
    return HTMLResponse(target.read_text(encoding="utf-8"))


if __name__ == "__main__":
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)
