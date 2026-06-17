# MAE - Make Anything Editor

## Status: AKTYWNY ROZWÓJ
**Ostatnia aktualizacja:** 2026-06-16

---

## Cel
Edytor kodu z AI w przeglądarce (1:1 merge VS Code + OpenCode), z integracją OpenCode Zen (darmowe modele), OpenCode Go (płatne modele) i Ollama (lokalne).

---

## Obecny Stan

### ✅ Zrobione
- [x] Struktura katalogów projektu
- [x] PLAN.md z pełną dokumentacją
- [x] preview.html - podgląd GUI (VS Code + OpenCode merge) + **BAZA implementacji**
- [x] Backend FastAPI + uvicorn (Zen/Go/Ollama AI Bridge)
- [x] API: `/api/ai/chat`, `/api/ai/models`, `/api/ai/health`
- [x] API: `/api/files/tree`, `/api/files/list`, `/api/files/read`, `/api/files/write`, `/api/files/delete`, `/api/files/mkdir`, `/api/files/search`
- [x] API: `/api/execute/run` (Python + shell)
- [x] Frontend Vite (HMR, proxy API do backendu:8000)
- [x] Color scheme: OpenCode OC-2 dark (`#0d0d0d`, `#fab283`)
- [x] Font selector z Comic Sans MS jako domyślna (11 fontów)
- [x] Layout: Activity bar | Sidebar | Editor + Diff | AI Chat | Terminal
- [x] Ikony Font Awesome 6.5.1 (ikony plików + UI) z color mappingiem
- [x] Explorer: realne pliki z workspace/ (tree, otwieranie, tworzenie, kasowanie)
- [x] Editor: podgląd plików z line numbers, Ctrl+S save
- [x] Chat OpenCode-style: task tracker, thinking indicator, diff code blocks, markdown
- [x] Default system prompt (zapisywany w localStorage, widoczny badge SYSTEM)
- [x] Activity Bar w pełni funkcjonalny (Explorer, Search, Source Control, Debug, Extensions, Accounts)
- [x] Sidebar z dynamicznym contentem dla każdego view
- [x] Settings panel (modal) z 3 zakładkami: General, Providers, Editor
- [x] Terminal/Output z wykonaniem kodu Python (Ctrl+Enter Run)
- [x] `start.bat` - uruchomienie backend + frontend jednocześnie
- [x] Subagenty: Explorer, Chat, Settings, UI, Editor, Tabs, Execute, Output, Git, Extensions (10 modułów)

### ❌ Do zrobienia
- [ ] Monaco Editor (prawdziwy editor z syntax highlighting)
- [ ] Streaming SSE w chat (obecnie plain response)
- [ ] File Manager - rename, move, kopiowanie drzewa
- [ ] Multi-workspace
- [ ] Themes engine (dark/light/custom)
- [ ] PWA / offline support

---

## Tech Stack

### Backend
- Python 3.10+
- FastAPI + uvicorn
- httpx (async HTTP)
- python-dotenv
- pydantic

### Frontend
- HTML5
- Tailwind CSS (CDN)
- Alpine.js (CDN)
- Monaco Editor (CDN)
- Marked.js (Markdown)
- Codicons (ikony UI VS Code)
- Font Awesome 6.5.1 (ikony plików - brandy + solid)

---

## Integracja AI

### Zen API (Darmowe)
```
URL: https://opencode.ai/zen/v1/chat/completions
Auth: Bearer public
Headers: x-opencode-client, x-opencode-project, x-opencode-request, x-opencode-session
Modele: deepseek-v4-flash-free, mimo-v2.5-free, big-pickle, nemotron-3-ultra-free, north-mini-code-free
```

### Go API (Płatne $10/mies)
```
URL: https://opencode.ai/zen/go/v1/chat/completions
Auth: Bearer <GO_API_KEY>
Modele: deepseek-v4-pro, deepseek-v4-flash, glm-5.1, kimi-k2.6, qwen3.7-plus, minimax-m2.7
```

### Ollama (Lokalne)
```
URL: http://localhost:11434/v1/chat/completions
Bez aut
```

---

## Struktura Projektu

```
MAE/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI entry + CORS + static
│   ├── config.py            # .env loader, provider config
│   ├── core/
│   │   ├── __init__.py
│   │   └── ai_bridge.py     # Multi-provider (Zen/Go/Ollama)
│   └── api/
│       ├── __init__.py
│       └── ai.py            # /api/ai/* endpoints
├── frontend/
│   ├── index.html           # Main app (Vite HMR)
│   ├── package.json         # Vite + deps
│   ├── vite.config.js       # Proxy /api → :8000
│   ├── css/
│   │   └── style.css        # OpenCode OC-2 Dark theme
│   └── js/
│       └── app.js           # Chat API, file tree, icons, fonts
├── workspace/               # Pliki użytkownika
├── requirements.txt
├── .env.example
├── .gitignore
├── start.bat                # Uruchom backend + frontend
├── PLAN.md
└── preview.html             # Baza GUI (referencja)
```

---

## API Endpoints

| Method | Path | Opis |
|--------|------|------|
| GET | `/api/files/list?path=` | Lista plików |
| GET | `/api/files/read?path=` | Odczyt pliku |
| POST | `/api/files/write` | Zapis pliku |
| DELETE | `/api/files/delete` | Usuwanie pliku |
| POST | `/api/files/mkdir` | Nowy katalog |
| POST | `/api/files/rename` | Zmiana nazwy |
| GET | `/api/files/search?q=` | Wyszukiwanie |
| POST | `/api/ai/chat` | Chat z AI (streaming SSE) |
| GET | `/api/ai/models?provider=` | Dostępne modele |
| GET | `/api/ai/health` | Status providerów |
| POST | `/api/execute/python` | Uruchom Python |
| POST | `/api/execute/html` | Serwuj HTML |
| GET | `/api/execute/validate` | Waliduj kod |

---

## Checklisty Rozwoju

### FAZA 1: Fundament Backend ✅ ZROBIONE
- [x] `requirements.txt` z zależnościami
- [x] `.env.example` z szablonem konfiguracji
- [x] `app/__init__.py`
- [x] `app/main.py` - FastAPI app z CORS, routing
- [x] `app/config.py` - ładowanie .env, config providerów
- [x] `app/core/__init__.py`
- [x] `app/api/__init__.py`
- [x] `app/api/ai.py` - endpointy AI API
- [x] Test: uvicorn działa, `/api/ai/health` → 200

### FAZA 2: AI Bridge ✅ ZROBIONE
- [x] `app/core/ai_bridge.py` - klasa AIBridge
  - [x] Zen provider (darmowe modele) ✅
  - [x] Go provider (płatne modele) ✅ (wymaga klucza)
  - [x] Ollama provider (lokalne) ✅
  - [x] Obsługa streaming SSE
  - [x] Obsługa błędów i rate limits
- [x] Test: curl POST /api/ai/chat → odpowiedź z DeepSeek/MiMo

### FAZA 3: Frontend Core ✅ ZROBIONE
- [x] `frontend/index.html` - główny dashboard
- [x] `frontend/css/style.css` - style OC-2 Dark
- [x] `frontend/js/app.js` - Chat API, file tree, icons, fonts
- [x] Vite dev server (HMR, proxy /api → :8000)
- [x] Chat podłączony do realnego API Zen/Go/Ollama
- [x] `start.bat` - uruchomienie wszystkiego

### FAZA 4: Code Executor ⬜
- [ ] `app/core/executor.py`
  - [ ] Python executor (subprocess z timeout)
  - [ ] HTML preview server
  - [ ] Walidacja kodu (AST parse)
  - [ ] Sandboxing (ograniczenia)
- [ ] `app/api/execute.py` - endpointy Execute API
- [ ] Output console w UI (terminal na dole)
- [ ] Debug console
- [ ] Test: uruchom kod Python przez API

### FAZA 5: Polish i UX ⬜
- [ ] Theme engine (dark/light/custom)
- [ ] Settings panel
  - [ ] Wybór providera AI
  - [ ] Wybór modelu
  - [ ] API keys configuration
  - [ ] Font selector
  - [ ] Theme selector
- [ ] Error handling + loading states
- [ ] Auto-save plików
- [ ] Keyboard shortcuts (Ctrl+S, Ctrl+Z, F5 Run)
- [ ] Mobile responsive
- [ ] PWA support

### FAZA 6: Zaawansowane ⬜
- [ ] Git integration (diff, commit, push)
- [ ] LSP support (go to definition, hover)
- [ ] Extensions system
- [ ] Multi-workspace support
- [ ] Collaboration (share session)
- [ ] Voice input
- [ ] Image generation (DALL-E via AI)

---

## GUI Layout (Stan Obecny)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [M] File Edit View Go Run Terminal Help    [Szukaj MAE Ctrl+K]       [_][□][X] │
├────┬──────────┬──────────────────────────────────────┬───────────────────────────┤
│ ☰  │ Explorer │  main.py | ai_bridge.py | index.html │  Edycja preview.html     │
│ 🔍 │ 🔍       │ ──────────────────────────────────── │  +2 -2                   │
│ 🔧 │ ──────── │                                      │ ┌─────────────────────┐  │
│ ⚙  │ 📂 src/  │  1│ import os                        │ │ 326: bg: var(--acc) │  │
│ 🧩 │  🐍main.py│ 2│ from pathlib import Path         │ │ 326: bg: var(--oc-p) │  │
│ ⚙  │  🐍utils.py│ 3│ from fastapi import FastAPI     │ │ 328: hover: #0098ff  │  │
│    │  🐍models │ 4│ from pydantic import BaseModel   │ │ 328: hover: #fcd53a  │  │
│    │ 📂 static │ 5│ from app.core.ai_bridge import * │ └─────────────────────┘  │
│    │ 🌐 index  │ 6│                                  │                          │
│    │ 🎨 style  │ 7│ # OpenCode Zen - Free models     │ Ukończono 0 z 1 zadań   │
│    │ ⚙  .env   │ 8│ ZEN_URL = "https://opencode..."  │ ☐ Zamień scheme         │
│    │ 📄 requir │ 9│ ZEN_HEADERS = {                  │                          │
│    │ 📝 README │10│   "Authorization": "Bearer pub"  │ [Zapytaj o cokolwiek]   │
│    │          │   │ }                                │ [MiMo V2.5 Free ▾]     │
├────┴──────────┴──────────────────────────────────────┴───────────────────────────┤
│ TERMINAL │ OUTPUT │ PROBLEMS │ DEBUG                                             │
│ PS H:\proj\MAE> python -m app.main                                              │
│ INFO: Uvicorn running on http://127.0.0.1:8000                                  │
│ INFO: Application startup complete.                                              │
├──────────────────────────────────────────────────────────────────────────────────┤
│ main | 0 | 0 err 0 warn        Ln 5, Col 1 | UTF-8 | Python | [Comic Sans MS] │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## Kolory (OpenCode OC-2 Dark)

| Element | Kolor | Hex |
|---------|-------|-----|
| Background | Czarny | `#0d0d0d` |
| Surface | Ciemny | `#141414` |
| Raised | Szary | `#1a1a1a` |
| Hover | Jasniejszy | `#1f1f1f` |
| Border | Szary | `#1f1f1f` |
| Text | Jasny | `#e0dcd7` |
| Text Dim | Szary | `#707070` |
| Accent | Pomarańczowy | `#fab283` |
| Success | Zielony | `#12c905` |
| Error | Czerwony | `#fc533a` |
| Info | Fioletowy | `#edb2f1` |
| Warning | Żółty | `#fcd53a` |

---

## Syntax Highlighting

| Token | Kolor |
|-------|-------|
| keyword | `#edb2f1` (fioletowy) |
| function | `#fab283` (pomarańczowy) |
| string | `#00ceb9` (teal) |
| type | `#fcd53a` (żółty) |
| constant | `#93e9f6` (cyan) |
| parameter | `#8cb0ff` (niebieski) |
| variable | `#fc533a` (czerwony) |
| comment | `#707070` (szary) |

---

## Ikony Plików (Font Awesome 6.5.1)

| Typ | Ikona | Kolor |
|-----|-------|-------|
| Python | `fa-brands fa-python` | `#3572A5` (niebieski) |
| Java | `fa-brands fa-java` | `#F89820` (pomarańczowy) |
| HTML | `fa-brands fa-html5` | `#E34F26` (pomarańczowy) |
| CSS | `fa-brands fa-css3-alt` | `#264DE4` (niebieski) |
| JavaScript | `fa-brands fa-js` | `#F7DF1E` (żółty) |
| TypeScript | `fa-brands fa-js` | `#3178C6` (niebieski) |
| PHP | `fa-brands fa-php` | `#777BB4` (fioletowy) |
| React | `fa-brands fa-react` | `#61DAFB` (błękitny) |
| Vue.js | `fa-brands fa-vuejs` | `#4FC08D` (zielony) |
| Angular | `fa-brands fa-angular` | `#DD0031` (czerwony) |
| Node.js | `fa-brands fa-node-js` | `#339933` (zielony) |
| Go | `fa-brands fa-golang` | `#00ADD8` (cyan) |
| Rust | `fa-brands fa-rust` | `#000000` (czarny) |
| Swift | `fa-brands fa-swift` | `#F05138` (czerwony) |
| Kotlin | `fa-solid fa-file-code` | `#7F52FF` (fioletowy) |
| C | `fa-solid fa-file-code` | `#555555` (szary) |
| C++ | `fa-solid fa-file-code` | `#00599C` (niebieski) |
| C# | `fa-solid fa-file-code` | `#239120` (zielony) |
| Ruby | `fa-solid fa-gem` | `#CC342D` (czerwony) |
| Perl | `fa-solid fa-file-code` | `#39457E` (niebieski) |
| Lua | `fa-solid fa-file-code` | `#000080` (granatowy) |
| R | `fa-solid fa-file-code` | `#276DC3` (niebieski) |
| Dart | `fa-solid fa-file-code` | `#0175C2` (niebieski) |
| Scala | `fa-solid fa-file-code` | `#DC322F` (czerwony) |
| Haskell | `fa-solid fa-file-code` | `#5e5086` (fioletowy) |
| Elixir | `fa-solid fa-file-code` | `#6E4A7E` (fioletowy) |
| Shell/Bash | `fa-solid fa-terminal` | `#4EAA25` (zielony) |
| SQL | `fa-solid fa-database` | `#4479A1` (niebieski) |
| JSON | `fa-solid fa-code` | `#CBCB41` (żółty) |
| YAML | `fa-solid fa-file-code` | `#CB3232` (czerwony) |
| Markdown | `fa-brands fa-markdown` | `#519ABA` (błękitny) |
| Docker | `fa-brands fa-docker` | `#2496ED` (docker blue) |
| Git | `fa-brands fa-git` | `#F05032` (czerwony) |
| Folder | `fa-solid fa-folder` | `#8cb0ff` (niebieski) |
| .env / Config | `fa-solid fa-gear` | `#6d8086` (szary) |
| Text | `fa-solid fa-file-lines` | `#89a0c4` (szary) |
| XML | `fa-solid fa-file-code` | `#F16529` (pomarańczowy) |
| INI/TOML | `fa-solid fa-gear` | `#6d8086` (szary) |
| Nieznane | `fa-solid fa-file-circle-xmark` | `#ef4444` (czerwony) |

---

## Szybki Start

```bash
# Windows: uruchom start.bat (oba serwery jednocześnie)

# Lub ręcznie:

# Backend
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Frontend (osobny terminal)
cd frontend
npm install
npx vite --host
```

**Serwery:**
- Backend: `http://127.0.0.1:8000` (API + docs: `/docs`)
- Frontend: `http://127.0.0.1:5173` (Vite, HMR, proxy `/api` → backend)

## PRIORYTET: Integracja Zen/Go

**To jest NAJWAŻNIEJSZA funkcja.** Wszystko inne jest drugorzędne.

1. Backend: AI Bridge z providerami Zen (free) + Go (paid)
2. Frontend: Chat panel z streamingiem SSE
3. Potem: reszta (file manager, executor, etc.)

---

## Uwagi Techniczne

- **preview.html = BAZA** - cały GUI z preview.html ma być przeniesiony do `frontend/` jako implementacja. CSS, layout, kolory, ikony - wszystko z preview.html jest źródłem prawdy
- **Zen API auth** - wymagane `x-opencode-*` headers (odkryte przez reverse engineering)
- **Streaming** - Zen/Go obsługują SSE streaming
- **Rate limits** - darmowe modele mają limity, Go ma wyższe
- **Bezpieczeństwo** - executor musi mieć sandboxing (subprocess z timeout)
- **Workspace** - pliki w `workspace/` relative do projektu
- **Font selector** - zapisuje do `localStorage`
- **Codicons** - oficjalne ikony VS Code z CDN `unpkg.com/@vscode/codicons`
- **Font Awesome** - ikony plików z CDN `cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1`
