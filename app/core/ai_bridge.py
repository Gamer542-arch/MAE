from __future__ import annotations
import json
import httpx
from typing import AsyncIterator
from urllib.parse import urljoin
from app.config import (
    ZEN_URL, ZEN_HEADERS, ZEN_MODELS,
    GO_URL, GO_API_KEY, GO_MODELS,
    OLLAMA_URL,
)


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
        if provider == "zen":
            return await self._zen_chat(model, messages, stream)
        elif provider == "go":
            return await self._go_chat(model, messages, stream)
        elif provider == "ollama":
            return await self._ollama_chat(model, messages, stream)
        else:
            raise ValueError(f"Unknown provider: {provider}")

    def models(self, provider: str) -> list[str]:
        if provider == "zen":
            return ZEN_MODELS
        elif provider == "go":
            return GO_MODELS
        elif provider == "ollama":
            return ["llama3.2", "codellama", "qwen2.5-coder", "deepseek-r1"]
        return []

    async def health(self) -> dict:
        status = {"zen": False, "go": False, "ollama": False}
        try:
            client = await self._get_client()
            r = await client.get(ZEN_URL.replace("/chat/completions", "/models"), headers=ZEN_HEADERS, timeout=5)
            status["zen"] = r.status_code < 500
        except Exception:
            pass
        try:
            if GO_API_KEY and not GO_API_KEY.startswith("sk-go-xxx"):
                client = await self._get_client()
                r = await client.get(GO_URL.replace("/chat/completions", "/models"), headers={"Authorization": f"Bearer {GO_API_KEY}"}, timeout=5)
                status["go"] = r.status_code < 500
        except Exception:
            pass
        try:
            client = await self._get_client()
            r = await client.get(urljoin(OLLAMA_URL, "/api/tags"), timeout=3)
            status["ollama"] = r.status_code < 500
        except Exception:
            pass
        return status

    async def _zen_chat(self, model: str, messages: list[dict], stream: bool) -> dict | AsyncIterator[dict]:
        client = await self._get_client()
        payload = {
            "model": model,
            "messages": messages,
            "stream": stream,
        }
        if stream:
            return self._stream_response(client, ZEN_URL, payload, ZEN_HEADERS)
        r = await client.post(ZEN_URL, json=payload, headers=ZEN_HEADERS)
        r.raise_for_status()
        return r.json()

    async def _go_chat(self, model: str, messages: list[dict], stream: bool) -> dict | AsyncIterator[dict]:
        if not GO_API_KEY or GO_API_KEY.startswith("sk-go-xxx"):
            raise ValueError("GO_API_KEY not configured. Set it in .env")
        client = await self._get_client()
        headers = {"Authorization": f"Bearer {GO_API_KEY}"}
        payload = {
            "model": model,
            "messages": messages,
            "stream": stream,
        }
        if stream:
            return self._stream_response(client, GO_URL, payload, headers)
        r = await client.post(GO_URL, json=payload, headers=headers)
        r.raise_for_status()
        return r.json()

    async def _ollama_chat(self, model: str, messages: list[dict], stream: bool) -> dict | AsyncIterator[dict]:
        client = await self._get_client()
        url = urljoin(OLLAMA_URL, "/v1/chat/completions")
        payload = {
            "model": model,
            "messages": messages,
            "stream": stream,
        }
        if stream:
            return self._stream_response(client, url, payload)
        r = await client.post(url, json=payload)
        r.raise_for_status()
        return r.json()

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
