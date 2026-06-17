import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.core.ai_bridge import AIBridge

router = APIRouter()
bridge = AIBridge()


class ChatRequest(BaseModel):
    provider: str = "zen"
    model: str = "mimo-v2.5-free"
    messages: list[dict]
    stream: bool = False
    system_prompt: str = ""


@router.post("/chat")
async def chat(req: ChatRequest):
    try:
        messages = req.messages
        if req.system_prompt and not any(m.get("role") == "system" for m in messages):
            messages = [{"role": "system", "content": req.system_prompt}] + messages

        result = await bridge.chat(
            provider=req.provider,
            model=req.model,
            messages=messages,
            stream=req.stream,
        )

        if req.stream:
            async def generate():
                async for chunk in result:
                    yield f"data: {json.dumps(chunk)}\n\n"
                yield "data: [DONE]\n\n"

            return StreamingResponse(generate(), media_type="text/event-stream")

        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/models")
async def models(provider: str = "zen"):
    return {"models": bridge.models(provider)}


@router.get("/health")
async def health():
    return await bridge.health()
