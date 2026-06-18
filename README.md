# ⚡ MAE — Make Anything Editor

> 🚀 A powerful browser-based code editor with AI integration, inspired by VS Code layout with OpenCode's dark aesthetic.

---

## 🎯 Quick Start

```bash
# 📦 Install dependencies
pip install -r requirements.txt

# 🚀 Start server (opens browser automatically)
start.bat

# 🛠️ Or start manually
python -m uvicorn app.main:app --host localhost --port 8000 --reload
```

### 🌐 Open in browser: **http://localhost:8000**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📝 **Editor** | Textarea-based with line numbers, auto-save (Ctrl+S), 11 fonts |
| 🤖 **AI Chat** | 3 modes: 💬 Normal, 🔨 Build (tools+auto-loop), 📋 Plan |
| 💻 **Terminal** | Real execute API, Python + shell, command history (↑↓) |
| 📁 **Explorer** | File tree, search, inline create file/folder |
| 🧩 **Extensions** | Marketplace with 12+ extensions, one-click install |
| 🎓 **Skills** | AI prompt templates: Python Expert, Code Reviewer, etc. |
| 🐙 **GitHub** | Verify token, create repo, push files |
| ⚙️ **Settings** | Font, theme, providers (Zen/Go/Ollama), GitHub token |
| 🏠 **Welcome Page** | VS Code-style landing with quick actions, shortcuts |

---

## 🤖 AI Providers

| Provider | Cost | Models | Status |
|----------|------|--------|--------|
| 🟢 **Zen** | 💰 Free | `deepseek-v4-flash-free`, `mimo-v2.5-free`, `big-pickle` | ✅ Active |
| 🟡 **Go** | 💵 $10/m | Paid models, requires API key | 🔑 Configure |
| 🔵 **Ollama** | 💰 Free | Local models, requires Ollama running | 🏠 Local |

> 💡 Set API key in **Settings → Providers**

---

## 🔨 AI Build Mode

Build mode gives AI **23 tools** for autonomous file editing:

```
📖 read_file      ✍️ write_file     ✏️ edit_file
📋 edit_multiple  🗑️ delete_file   📁 create_folder
🔍 search_files   ▶️ run_code       ⚡ run_command
✅ validate_file  📊 get_file_info  🔄 replace_in_file
📝 count_lines    🔀 diff_file      ↩️ undo_last
...
```

🔄 **Auto-loop**: Max 8 iterations — AI reads → edits → verifies → repeats

---

## 📁 Project Structure

```
MAE/
├── 🐍 app/                    # FastAPI backend
│   ├── main.py               # 🚀 Server + routes
│   ├── config.py             # ⚙️ .env loader, model lists
│   ├── core/
│   │   ├── ai_bridge.py      # 🤖 Zen/Go/Ollama clients
│   │   ├── file_manager.py   # 📁 File CRUD, tree, search
│   │   ├── extension_manager.py  # 🧩 Extensions
│   │   ├── skill_manager.py  # 🎓 Skills
│   │   └── github_client.py  # 🐙 GitHub API
│   └── api/
│       ├── ai.py             # 💬 Chat endpoint
│       ├── files.py          # 📂 File operations
│       ├── execute.py        # ▶️ Code execution
│       ├── extensions.py     # 🧩 Extension install
│       ├── skills.py         # 🎓 Skill install
│       └── github.py         # 🐙 GitHub API
├── 🌐 frontend/              # Static frontend
│   ├── index.html            # 🏠 Main app
│   ├── css/style.css         # 🎨 OC-2 Dark theme
│   └── js/app.js             # 📜 All modules (~2300 lines)
├── 🧩 extensions/            # 📦 Installed extensions
├── 🎓 skills/                # 🧠 Installed AI skills
├── 📂 workspace/             # 💾 User workspace files
├── 🚀 start.bat              # ⚡ One-click launcher
├── 📋 requirements.txt       # 📦 Python dependencies
└── 🔧 .env.example           # 📝 Config template
```

---

## 🛤️ Path System

| Path | Description |
|------|-------------|
| `%~/` | 🏠 Workspace root |
| `.` prefix | 👁️ Hidden files |
| Regular | 📄 Relative to workspace |

---

## ⌨️ Keyboard Shortcuts

| Key | Action | Description |
|-----|--------|-------------|
| `Ctrl+S` | 💾 Save | Save current file |
| `Ctrl+N` | 📝 New File | Create new file |
| `Ctrl+K` | 🤖 AI Chat | Focus AI chat |
| `Ctrl+Enter` | ▶️ Run | Execute code |

---

## 🧩 Extensions

### 📦 Built-in Extensions

| Extension | Description | Status |
|-----------|-------------|--------|
| 🐍 **Python Support** | Syntax, linting, execution | ✅ Active |
| 🟨 **JavaScript & Web** | JS/TS, HTML, CSS | ✅ Active |
| 🎨 **OpenCode OC-2 Dark** | Dark theme | ✅ Active |
| ✨ **Code Formatter** | Auto-format on save | ⚙️ Configure |
| 🎨 **Icon Pack** | Custom file type icons | ✅ Active |
| 🐳 **Docker Support** | Dockerfile syntax | 📦 Available |
| 🔍 **GitLens** | Git blame, history | 📦 Available |
| 🐛 **Debugger** | Breakpoints, step-through | 📦 Available |

> 💡 Install custom extensions via **JSON manifest**

---

## 🔌 API Endpoints

### 📂 Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/files/tree` | 🌳 File tree |
| `GET` | `/api/files/read?path=` | 📖 Read file |
| `POST` | `/api/files/write` | ✍️ Write file |

### 🤖 AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/chat` | 💬 Chat |

### ▶️ Execute

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/execute/run` | ▶️ Execute code |

### 🧩 Extensions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/extensions/list` | 📦 List extensions |
| `POST` | `/api/extensions/install` | 📥 Install extension |

### 🎓 Skills

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/skills/list` | 🧠 List skills |
| `POST` | `/api/skills/install` | 📥 Install skill |

### 🐙 GitHub

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/github/verify` | ✅ Verify token |
| `POST` | `/api/github/push` | 🚀 Push to GitHub |

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| 🐍 **Backend** | Python 3.10+, FastAPI, uvicorn, httpx |
| 🌐 **Frontend** | HTML, CSS, vanilla JS (no build tools) |
| 🎨 **Theme** | OpenCode OC-2 Dark (`#0d0d0d` bg, `#fab283` accent) |
| 🎨 **Icons** | Font Awesome 6.5.1 + VS Code Codicons |

---

## 📄 License

MIT License

---

<div align="center">

**Made with ❤️ by MAE Team**

⭐ Star this repo if you find it helpful!

</div>
