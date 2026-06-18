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

# ── Additional Providers ──
OPENAI_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_URL = "https://api.openai.com/v1/chat/completions"
OPENAI_MODELS = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "o3-mini"]

ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_MODELS = ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307", "claude-3-opus-20240229"]

GROQ_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODELS = ["llama-3.3-70b", "mixtral-8x7b", "gemma2-9b", "deepseek-r1-distill-llama-70b"]

DEEPSEEK_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"
DEEPSEEK_MODELS = ["deepseek-chat", "deepseek-reasoner"]

MISTRAL_KEY = os.getenv("MISTRAL_API_KEY", "")
MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions"
MISTRAL_MODELS = ["mistral-large-latest", "mistral-medium", "codestral-latest"]

OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODELS = ["openai/gpt-4o", "anthropic/claude-3.5-sonnet", "google/gemini-2.5-flash", "meta-llama/llama-4-maverick"]

LMSTUDIO_URL = os.getenv("LMSTUDIO_URL", "http://localhost:1234/v1/chat/completions")
LMSTUDIO_MODELS = ["local-model"]
