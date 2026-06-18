from __future__ import annotations
import json
import httpx
from typing import AsyncIterator
from urllib.parse import urljoin
from app.config import (
    ZEN_URL, ZEN_HEADERS, ZEN_MODELS,
    GO_URL, GO_API_KEY, GO_MODELS,
    OLLAMA_URL,
    OPENAI_KEY, OPENAI_URL, OPENAI_MODELS,
    ANTHROPIC_KEY, ANTHROPIC_URL, ANTHROPIC_MODELS,
    GROQ_KEY, GROQ_URL, GROQ_MODELS,
    DEEPSEEK_KEY, DEEPSEEK_URL, DEEPSEEK_MODELS,
    MISTRAL_KEY, MISTRAL_URL, MISTRAL_MODELS,
    OPENROUTER_KEY, OPENROUTER_URL, OPENROUTER_MODELS,
    LMSTUDIO_URL, LMSTUDIO_MODELS,
)

PROVIDER_MAP = {
    "zen": {"url": ZEN_URL, "headers": ZEN_HEADERS, "models": ZEN_MODELS, "key": None, "format": "openai"},
    "go": {"url": GO_URL, "headers": None, "models": GO_MODELS, "key": GO_API_KEY, "format": "openai"},
    "ollama": {"url": urljoin(OLLAMA_URL, "/v1/chat/completions"), "headers": None, "models": ["llama3.2", "codellama", "qwen2.5-coder", "deepseek-r1"], "key": None, "format": "openai"},
    "openai": {"url": OPENAI_URL, "headers": None, "models": OPENAI_MODELS, "key": OPENAI_KEY, "format": "openai"},
    "anthropic": {"url": ANTHROPIC_URL, "headers": None, "models": ANTHROPIC_MODELS, "key": ANTHROPIC_KEY, "format": "anthropic"},
    "groq": {"url": GROQ_URL, "headers": None, "models": GROQ_MODELS, "key": GROQ_KEY, "format": "openai"},
    "deepseek": {"url": DEEPSEEK_URL, "headers": None, "models": DEEPSEEK_MODELS, "key": DEEPSEEK_KEY, "format": "openai"},
    "mistral": {"url": MISTRAL_URL, "headers": None, "models": MISTRAL_MODELS, "key": MISTRAL_KEY, "format": "openai"},
    "openrouter": {"url": OPENROUTER_URL, "headers": None, "models": OPENROUTER_MODELS, "key": OPENROUTER_KEY, "format": "openai"},
    "lmstudio": {"url": LMSTUDIO_URL, "headers": None, "models": LMSTUDIO_MODELS, "key": None, "format": "openai"},
}


class AIBridge:
    def __init__(self):
        self._client = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(timeout=120.0)
        return self._client

    async def close(self):
        if self._client:
            await self._client.aclose()
            self._client = None

    async def chat(
        self,
        provider: str,
        model: str,
        messages: list[dict],
        stream: bool = False,
    ) -> dict | AsyncIterator[dict]:
        if provider not in PROVIDER_MAP:
            raise ValueError(f"Unknown provider: {provider}")

        cfg = PROVIDER_MAP[provider]

        if cfg["format"] == "openai":
            return await self._openai_compat(provider, cfg, model, messages, stream)
        elif cfg["format"] == "anthropic":
            return await self._anthropic_chat(cfg, model, messages, stream)
        else:
            raise ValueError(f"Unknown format: {cfg['format']}")

    def models(self, provider: str) -> list[str]:
        if provider in PROVIDER_MAP:
            return PROVIDER_MAP[provider]["models"]
        return []

    async def health(self) -> dict:
        status = {}
        for name, cfg in PROVIDER_MAP.items():
            try:
                if cfg["key"] and cfg["key"].startswith("sk-xxx"):
                    status[name] = False
                    continue
                client = await self._get_client()
                headers = self._headers(cfg)
                check_url = cfg["url"].replace("/chat/completions", "/models")
                r = await client.get(check_url, headers=headers, timeout=5)
                status[name] = r.status_code < 500
            except Exception:
                status[name] = False
        return status

    def _headers(self, cfg: dict) -> dict:
        h = {}
        if cfg["headers"]:
            h.update(cfg["headers"])
        if cfg["key"]:
            h["Authorization"] = f"Bearer {cfg['key']}"
        return h

    async def _openai_compat(self, provider: str, cfg: dict, model: str, messages: list[dict], stream: bool) -> dict | AsyncIterator[dict]:
        client = await self._get_client()
        headers = self._headers(cfg)
        payload = {"model": model, "messages": messages, "stream": stream}
        if stream:
            return self._stream_response(client, cfg["url"], payload, headers)
        r = await client.post(cfg["url"], json=payload, headers=headers)
        r.raise_for_status()
        return r.json()

    async def _anthropic_chat(self, cfg: dict, model: str, messages: list[dict], stream: bool) -> dict:
        if not cfg["key"] or cfg["key"].startswith("sk-xxx"):
            raise ValueError("ANTHROPIC_API_KEY not configured")

        client = await self._get_client()
        headers = {
            "x-api-key": cfg["key"],
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        }

        # Extract system prompt, convert messages to Anthropic format
        system_prompt = ""
        anthropic_messages = []
        for msg in messages:
            if msg["role"] == "system":
                system_prompt = msg["content"]
            else:
                anthropic_messages.append({"role": msg["role"], "content": msg["content"]})

        payload = {
            "model": model,
            "messages": anthropic_messages,
            "max_tokens": 4096,
        }
        if system_prompt:
            payload["system"] = system_prompt

        r = await client.post(cfg["url"], json=payload, headers=headers)
        r.raise_for_status()
        data = r.json()

        # Convert Anthropic response to OpenAI format
        return {
            "choices": [{
                "message": {
                    "content": data["content"][0]["text"],
                    "role": "assistant",
                }
            }]
        }

    async def _stream_response(self, client: httpx.AsyncClient, url: str, payload: dict, headers: dict = None) -> AsyncIterator[dict]:
        headers = headers or {}
        async with client.stream("POST", url, json=payload, headers=headers) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data = line[6:]
                    if data == "[DONE]":
                        break
                    try:
                        yield json.loads(data)
                    except json.JSONDecodeError:
                        continue
