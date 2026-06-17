import os
from dotenv import load_dotenv

load_dotenv()

HOST = os.getenv("HOST", "localhost")
PORT = int(os.getenv("PORT", "8000"))
GO_API_KEY = os.getenv("GO_API_KEY", "")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

ZEN_URL = "https://opencode.ai/zen/v1/chat/completions"
ZEN_HEADERS = {
    "Authorization": "Bearer public",
    "x-opencode-client": "cli",
    "x-opencode-project": "global",
    "x-opencode-request": "chat",
    "x-opencode-session": "mae-session",
}

GO_URL = "https://opencode.ai/zen/go/v1/chat/completions"

ZEN_MODELS = [
    "deepseek-v4-flash-free",
    "mimo-v2.5-free",
    "big-pickle",
    "nemotron-3-ultra-free",
    "north-mini-code-free",
]

GO_MODELS = [
    "deepseek-v4-pro",
    "deepseek-v4-flash",
    "glm-5.1",
    "kimi-k2.6",
    "qwen3.7-plus",
    "minimax-m2.7",
]
