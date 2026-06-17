import asyncio
import platform
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pathlib import Path

router = APIRouter()
WORKSPACE = Path(__file__).parent.parent.parent / "workspace"
IS_WINDOWS = platform.system() == "Windows"


class ExecuteRequest(BaseModel):
    code: str
    language: str = "python"
    timeout: int = 30


@router.post("/run")
async def run_code(req: ExecuteRequest):
    try:
        if req.language == "python":
            proc = await asyncio.create_subprocess_exec(
                "python", "-c", req.code,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=str(WORKSPACE),
            )
        elif req.language in ("bash", "shell"):
            shell_cmd = "cmd /c" if IS_WINDOWS else "bash -c"
            proc = await asyncio.create_subprocess_shell(
                f"{shell_cmd} \"{req.code}\"",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=str(WORKSPACE),
            )
        else:
            return {
                "stdout": "",
                "stderr": f"Unknown language: {req.language}. Use 'python' or 'shell'.",
                "returncode": -1,
            }

        stdout, stderr = await asyncio.wait_for(
            proc.communicate(), timeout=req.timeout
        )
        return {
            "stdout": stdout.decode("utf-8", errors="replace") if stdout else "",
            "stderr": stderr.decode("utf-8", errors="replace") if stderr else "",
            "returncode": proc.returncode or 0,
        }
    except asyncio.TimeoutError:
        raise HTTPException(status_code=408, detail="Execution timed out")
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=f"Command not found: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
