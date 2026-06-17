// =============================================
//  MAE - Make Anything Editor
//  Subagent modules: Explorer, Chat, Settings,
//  UI, Executor, Output
// =============================================

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const escapeHTML = (t) => t ? t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>') : '';
const time = () => new Date().toLocaleTimeString('pl',{hour:'2-digit',minute:'2-digit'});

// =============================================
//  GLOBAL MODAL
// =============================================
const Modal = {
    _remove() { const m = $('#globalModal'); if (m) m.remove(); },

    alert(msg, title) {
        this._remove();
        const o = document.createElement('div');
        o.id = 'globalModal'; o.className = 'modal-overlay show'; o.style.zIndex = '2000';
        o.innerHTML = `<div class="modal-box" style="width:380px;">
            <div class="modal-head"><span>${escapeHTML(title || 'Info')}</span><button class="chat-header-btn" onclick="Modal._remove()"><span class="codicon codicon-close"></span></button></div>
            <div style="padding:16px;"><div style="font-size:12px;color:var(--text);">${escapeHTML(msg)}</div></div>
            <div style="display:flex;justify-content:flex-end;padding:0 16px 16px;">
                <button onclick="Modal._remove()" style="background:var(--accent);color:#0d0d0d;border:none;padding:6px 20px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;">OK</button>
            </div></div>`;
        o.onclick = (e) => { if (e.target === o) this._remove(); };
        document.body.appendChild(o);
    },

    confirm(msg, onYes, title, confirmText) {
        this._remove();
        const o = document.createElement('div');
        o.id = 'globalModal'; o.className = 'modal-overlay show'; o.style.zIndex = '2000';
        o.innerHTML = `<div class="modal-box" style="width:380px;">
            <div class="modal-head"><span>${escapeHTML(title || 'Confirm')}</span><button class="chat-header-btn" onclick="Modal._remove()"><span class="codicon codicon-close"></span></button></div>
            <div style="padding:16px;"><div style="font-size:12px;color:var(--text);">${escapeHTML(msg)}</div></div>
            <div style="display:flex;justify-content:flex-end;gap:8px;padding:0 16px 16px;">
                <button onclick="Modal._remove()" style="background:var(--bg-raised);border:1px solid var(--border);color:var(--text);padding:6px 16px;border-radius:4px;cursor:pointer;font-size:12px;">Cancel</button>
                <button id="modalConfirmBtn" style="background:var(--accent);color:#0d0d0d;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;">${confirmText || 'OK'}</button>
            </div></div>`;
        o.onclick = (e) => { if (e.target === o) this._remove(); };
        document.body.appendChild(o);
        $('#modalConfirmBtn').onclick = () => { this._remove(); if (onYes) onYes(); };
    },

    prompt(msg, defaultVal, onOk, title, confirmText) {
        this._remove();
        const o = document.createElement('div');
        o.id = 'globalModal'; o.className = 'modal-overlay show'; o.style.zIndex = '2000';
        o.innerHTML = `<div class="modal-box" style="width:400px;">
            <div class="modal-head"><span>${escapeHTML(title || 'Input')}</span><button class="chat-header-btn" onclick="Modal._remove()"><span class="codicon codicon-close"></span></button></div>
            <div style="padding:16px;">
                <div style="font-size:12px;color:var(--text-dim);margin-bottom:6px;">${escapeHTML(msg)}</div>
                <input id="modalPromptInput" class="settings-input" value="${escapeHTML(defaultVal || '')}" />
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;padding:0 16px 16px;">
                <button onclick="Modal._remove()" style="background:var(--bg-raised);border:1px solid var(--border);color:var(--text);padding:6px 16px;border-radius:4px;cursor:pointer;font-size:12px;">Cancel</button>
                <button id="modalConfirmBtn" style="background:var(--accent);color:#0d0d0d;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;">${confirmText || 'OK'}</button>
            </div></div>`;
        o.onclick = (e) => { if (e.target === o) this._remove(); };
        document.body.appendChild(o);
        const inp = $('#modalPromptInput');
        setTimeout(() => { if (inp) { inp.focus(); inp.select(); inp.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); $('#modalConfirmBtn').click(); } }; } }, 50);
        $('#modalConfirmBtn').onclick = () => { const v = inp?.value?.trim(); this._remove(); if (v && onOk) onOk(v); };
    },

    multiPrompt(title, fields, onOk, confirmText) {
        this._remove();
        const o = document.createElement('div');
        o.id = 'globalModal'; o.className = 'modal-overlay show'; o.style.zIndex = '2000';
        const fieldsHTML = fields.map((f, i) =>
            `<div style="margin-bottom:10px;">
                <div style="margin-bottom:4px;font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">${escapeHTML(f.label)}</div>
                <input id="modalField${i}" class="settings-input" value="${escapeHTML(f.value || '')}" placeholder="${escapeHTML(f.placeholder || '')}" />
            </div>`
        ).join('');
        o.innerHTML = `<div class="modal-box" style="width:420px;">
            <div class="modal-head"><span>${escapeHTML(title)}</span><button class="chat-header-btn" onclick="Modal._remove()"><span class="codicon codicon-close"></span></button></div>
            <div style="padding:16px;">${fieldsHTML}</div>
            <div style="display:flex;justify-content:flex-end;gap:8px;padding:0 16px 16px;">
                <button onclick="Modal._remove()" style="background:var(--bg-raised);border:1px solid var(--border);color:var(--text);padding:6px 16px;border-radius:4px;cursor:pointer;font-size:12px;">Cancel</button>
                <button id="modalConfirmBtn" style="background:var(--accent);color:#0d0d0d;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;">${confirmText || 'OK'}</button>
            </div></div>`;
        o.onclick = (e) => { if (e.target === o) this._remove(); };
        document.body.appendChild(o);
        setTimeout(() => { const inp = $('#modalField0'); if (inp) { inp.focus(); inp.select(); } }, 50);
        $('#modalConfirmBtn').onclick = () => {
            const vals = fields.map((f, i) => $('#modalField' + i)?.value?.trim() || '');
            if (vals.every(v => v)) { this._remove(); if (onOk) onOk(vals); }
        };
    },
};

// =============================================
//  ICONS
// =============================================
const ICONS = {
    py:'fa-brands fa-python', java:'fa-brands fa-java', js:'fa-brands fa-js',
    ts:'fa-brands fa-js', html:'fa-brands fa-html5', css:'fa-brands fa-css3-alt',
    php:'fa-brands fa-php', go:'fa-brands fa-golang', rs:'fa-brands fa-rust',
    swift:'fa-brands fa-swift', jsx:'fa-brands fa-react', tsx:'fa-brands fa-react',
    vue:'fa-brands fa-vuejs', rb:'fa-solid fa-gem', c:'fa-solid fa-file-code',
    cpp:'fa-solid fa-file-code', cs:'fa-solid fa-file-code', kt:'fa-solid fa-file-code',
    scala:'fa-solid fa-file-code', hs:'fa-solid fa-file-code', lua:'fa-solid fa-file-code',
    r:'fa-solid fa-file-code', dart:'fa-solid fa-file-code', sh:'fa-solid fa-terminal',
    bash:'fa-solid fa-terminal', sql:'fa-solid fa-database',
    json:'fa-solid fa-code', yaml:'fa-solid fa-file-code', yml:'fa-solid fa-file-code',
    md:'fa-brands fa-markdown', txt:'fa-solid fa-file-lines',
    xml:'fa-solid fa-file-code', ini:'fa-solid fa-gear', toml:'fa-solid fa-gear',
    env:'fa-solid fa-gear', gitignore:'fa-brands fa-git',
    dockerfile:'fa-brands fa-docker', lock:'fa-solid fa-lock', cfg:'fa-solid fa-gear',
    png:'fa-solid fa-file', jpg:'fa-solid fa-file', svg:'fa-solid fa-file',
    pdf:'fa-solid fa-file',
};
const iconFor = (name) => {
    const ext = (name||'').split('.').pop()?.toLowerCase();
    return ICONS[ext] || 'fa-solid fa-file-circle-xmark';
};

// =============================================
//  API
// =============================================
const API = {
    async fetch(url, opts) {
        try { const r = await fetch(url, opts); return await r.json(); }
        catch(e) { return {error:e.message}; }
    },
    files(path) { return this.fetch(`/api/files/list?path=${encodeURIComponent(path||'')}`); },
    tree() { return this.fetch('/api/files/tree'); },
    read(path) { return this.fetch(`/api/files/read?path=${encodeURIComponent(path)}`); },
    write(path, content) { return this.fetch('/api/files/write',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path,content})}); },
    delete(path) { return this.fetch(`/api/files/delete?path=${encodeURIComponent(path)}`,{method:'DELETE'}); },
    mkdir(path) { return this.fetch(`/api/files/mkdir?path=${encodeURIComponent(path)}`,{method:'POST'}); },
    search(q) { return this.fetch(`/api/files/search?q=${encodeURIComponent(q)}`); },
    chat(provider, model, messages, systemPrompt) {
        return this.fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider, model, messages, stream: false, system_prompt: systemPrompt || '' }),
        });
    },
    models(provider) { return this.fetch(`/api/ai/models?provider=${provider}`); },
    health() { return this.fetch('/api/ai/health'); },
    execute(code, lang) { return this.fetch('/api/execute/run',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,language:lang||'python'})}); },
};

// =============================================
//  STATE
// =============================================
const STATE = {
    provider: localStorage.getItem('mae-provider') || 'zen',
    model: localStorage.getItem('mae-model') || 'deepseek-v4-flash-free',
    openFile: null,
    openFilePath: '',
    sidebarView: 'explorer',
};

const DEFAULT_SYSTEM_PROMPT = [
    'Jesteś MAE AI — asystentem w edytorze kodu Make Anything Editor.',
    '',
    'Zasady:',
    '- Odpowiadaj zwięźle i konkretnie',
    '- Kod formatuj w blokach ```język ... ```',
    '- Mów po polsku, chyba że użytkownik pisze po angielsku',
    '- Używaj emoji oszczędnie',
].join('\n');

const BUILD_SYSTEM_PROMPT = `# MAE BUILD MODE — SYSTEM PROMPT

## Identity

You are MAE AI, the autonomous coding agent inside Make Anything Editor. You operate in BUILD MODE with direct file system access and code execution capabilities. Your purpose is to help the user write, edit, debug, and execute code autonomously. You think step-by-step, use tools precisely, and always verify before modifying files.

## Core Principles

<core_principles>
1. READ BEFORE WRITE. Always read a file's current contents before attempting to edit it. NEVER assume you know what's in a file.
2. MATCH EXACTLY. When using edit_file, the oldString parameter MUST be character-for-character identical to the line you're replacing, including whitespace, indentation, quotes, and escape characters.
3. ONE ACTION PER TOOL. Each tool call does exactly one thing. Do not try to combine multiple operations into a single tool call. Pass ALL edits to edit_multiple at once if editing multiple lines.
4. VERIFY AFTER WRITE. After writing a file, verify it was written correctly by reading it back if the next step depends on its exact contents.
5. HANDLE ERRORS GRACEFULLY. If a tool returns an error, read the error carefully — it tells you exactly what went wrong (e.g., line mismatch shows expected vs actual). Fix and retry.
6. STOP WHEN DONE. After completing all tool operations, give a concise summary. Do NOT continue calling tools unnecessarily.
7. BE CONCISE. Give brief answers. The user wants results, not essays.
</core_principles>

## Tool Format

<tool_format>
You call tools by outputting a JSON block surrounded by \`\`\`json markers. Each line inside the block is one tool call as a JSON object. Multiple tool calls execute in order from top to bottom.

EXAMPLE:
\`\`\`json
{"tool":"read_file","path":"main.py"}
{"tool":"edit_file","path":"main.py","line":3,"oldString":"print(x)","newString":"print(x, flush=True)"}
\`\`\`

The result of each tool call is returned to you as a JSON object with \`tool\`, \`success\`, and \`result\` fields. On success: \`{"tool":"edit_file","success":true,"result":"3 lines edited"}\`. On failure: \`{"tool":"edit_file","success":false,"result":"Line 3: MISMATCH\\n  Expected: \\"print(x)\\"\\n  Actual:   \\"print(x )\\""}\`.

CRITICAL: You MUST include the \`\`\`json block markers. Without them, tools will NOT be recognized.
DO NOT include any text before the \`\`\`json block. Output ONLY the block.
DO NOT include text after the \`\`\`json closing marker in the same message — the next message is where you respond normally.
</tool_format>

## Tool Reference

<tools>

### File Reading
<tool name="read_file">
Reads the complete contents of a file from the workspace. Use this BEFORE any edit operation.
Parameters:
  - path (string, required): Path to the file relative to workspace root.
Returns: The full file contents as a string.

{"tool":"read_file","path":"src/main.py"}
</tool>

<tool name="read_multiple">
Reads multiple files in one call. More efficient than individual reads.
Parameters:
  - paths (array of strings, required): List of file paths to read.
Returns: JSON object mapping each path to its contents.

{"tool":"read_multiple","paths":["src/main.py","src/utils.py"]}
</tool>

### File Writing
<tool name="write_file">
Creates a new file or completely overwrites an existing file. Use this for creating new files or when you need to replace the entire content of an existing file.
Parameters:
  - path (string, required): File path relative to workspace.
  - content (string, required): The complete file contents.
Returns: Confirmation with path and size.

{"tool":"write_file","path":"new_file.py","content":"print('Hello World')"}
</tool>

### Line-Level Editing
<tool name="edit_file">
Replaces a single line in a file. The oldString MUST match exactly — character for character, space for space, tab for tab.
Parameters:
  - path (string, required): File to edit.
  - line (integer, required): 1-indexed line number.
  - oldString (string, required): EXACT current content of the line.
  - newString (string, required): New content for the line.
Returns: Success count or detailed mismatch error.

{"tool":"edit_file","path":"main.py","line":5,"oldString":"    print('hello')","newString":"    print('hello world')"}
</tool>

<tool name="edit_multiple">
Edits multiple lines in a file in one atomic operation. All edits are applied together.
Parameters:
  - path (string, required): File to edit.
  - edits (array, required): Array of edit objects, each with {line, oldString, newString}.
Returns: Success count and list of any failures with detailed mismatch info.

{"tool":"edit_multiple","path":"main.py","edits":[{"line":1,"oldString":"import os","newString":"import os, sys"},{"line":5,"oldString":"print(x)","newString":"print(x, end='')"}]}
</tool>

<tool name="append_to_file">
Appends text to the end of a file. Adds a newline before the content automatically.
Parameters:
  - path (string, required): File to append to.
  - content (string, required): Text to add.
Returns: Confirmation.

{"tool":"append_to_file","path":"log.txt","content":"New log entry"}
</tool>

<tool name="insert_at_line">
Inserts a new line BEFORE the specified line number. Shifts existing lines down.
Parameters:
  - path (string, required): File to modify.
  - line (integer, required): Line number to insert before (1-indexed).
  - content (string, required): The new line content.
Returns: Confirmation.

{"tool":"insert_at_line","path":"main.py","line":1,"content":"#!/usr/bin/env python3"}
</tool>

<tool name="delete_lines">
Deletes a range of lines from a file. Both fromLine and toLine are inclusive (1-indexed).
Parameters:
  - path (string, required): File to modify.
  - fromLine (integer, required): First line to delete (1-indexed, inclusive).
  - toLine (integer, required): Last line to delete (1-indexed, inclusive).
Returns: Confirmation.

{"tool":"delete_lines","path":"main.py","fromLine":10,"toLine":15}
</tool>

### File Management
<tool name="delete_file">
Permanently deletes a file from the workspace. Use with caution — there is no trash/recycle bin.
Parameters:
  - path (string, required): File to delete.
Returns: Confirmation.

{"tool":"delete_file","path":"old_script.py"}
</tool>

<tool name="create_folder">
Creates a new directory in the workspace. Creates parent directories as needed.
Parameters:
  - path (string, required): Directory path relative to workspace.
Returns: Confirmation.

{"tool":"create_folder","path":"src/components"}
</tool>

<tool name="rename_file">
Renames a file or moves it to a new location. Both paths are relative to workspace.
Parameters:
  - oldPath (string, required): Current path of the file.
  - newPath (string, required): New path/name for the file.
Returns: Confirmation.

{"tool":"rename_file","oldPath":"old_name.py","newPath":"new_name.py"}
</tool>

### Discovery & Search
<tool name="list_files">
Lists all files and folders in the workspace. Directories are prefixed with 📁, files with 📄.
Parameters:
  - path (string, optional): Directory to list. Defaults to workspace root.
  - recursive (boolean, optional): Whether to recurse into subdirectories. Default: true.
Returns: Formatted list of files and folders.

{"tool":"list_files"}
{"tool":"list_files","path":"src","recursive":true}
</tool>

<tool name="search_files">
Searches for files by name in the workspace. Matches against file/folder names.
Parameters:
  - query (string, required): Search term (case-insensitive partial match).
  - path (string, optional): Directory to search within. Default: workspace root.
Returns: Array of matching file/folder objects with path and type.

{"tool":"search_files","query":"test"}
{"tool":"search_files","query":"model","path":"src"}
</tool>

<tool name="search_in_files">
Searches for text content within files in the workspace.
Parameters:
  - query (string, required): Text to search for.
  - pattern (string, optional): File pattern to filter (e.g., "*.py", "*.js"). Default: all files.
Returns: Array of results with file paths.

{"tool":"search_in_files","query":"TODO","pattern":"*.py"}
</tool>

### Code Execution
<tool name="run_code">
Executes code and returns the output. Supports Python and Shell.
Parameters:
  - code (string, required): The code to execute.
  - language (string, required): "python" or "shell".
  - timeout (integer, optional): Max execution time in seconds. Default: 30.
Returns: stdout, stderr, and returncode.

{"tool":"run_code","code":"print(list(range(1,11)))","language":"python"}
{"tool":"run_code","code":"ls -la","language":"shell"}
</tool>

<tool name="run_command">
Logs a terminal command. Commands are displayed in the terminal panel.
Parameters:
  - command (string, required): The command to log/run.
  - cwd (string, optional): Working directory. Default: workspace root.
Returns: Confirmation.

{"tool":"run_command","command":"pip install requests"}
</tool>

### File Analysis
<tool name="validate_file">
Validates a file — checks syntax (basic), counts lines and characters.
Parameters:
  - path (string, required): File to validate.
  - language (string, optional): Language for syntax check. Default: auto-detect from extension.
Returns: Line count, size, and basic validation result.

{"tool":"validate_file","path":"main.py","language":"python"}
</tool>

<tool name="get_file_info">
Returns detailed metadata about a file without reading its contents.
Parameters:
  - path (string, required): File to inspect.
Returns: JSON with path, lines, size, extension.

{"tool":"get_file_info","path":"main.py"}
</tool>

<tool name="count_lines">
Counts the number of lines in a file.
Parameters:
  - path (string, required): File to count.
Returns: Line count.

{"tool":"count_lines","path":"main.py"}
</tool>

<tool name="diff_file">
Quick comparison of two files (size and line count).
Parameters:
  - path1 (string, required): First file.
  - path2 (string, required): Second file.
Returns: Size and line count comparison.

{"tool":"diff_file","path1":"main.py","path2":"main_backup.py"}
</tool>

### Context & State
<tool name="get_context">
Returns the currently open file in the user's editor, including its contents (up to 3000 chars).
Parameters: none
Returns: JSON with path and content of the active editor file.

{"tool":"get_context"}
</tool>

<tool name="replace_in_file">
Find-and-replace text across the entire file. For targeted edits, prefer edit_file.
Parameters:
  - path (string, required): File to modify.
  - oldString (string, required): Text to find (literal match, not regex).
  - newString (string, required): Replacement text.
  - firstOnly (boolean, optional): Replace only first occurrence. Default: false (replace all).
Returns: Confirmation with number of replacements.

{"tool":"replace_in_file","path":"config.py","oldString":"DEBUG = False","newString":"DEBUG = True","firstOnly":true}
</tool>

<tool name="undo_last">
Placeholder for undo operation. Currently not implemented — use edit_file to manually revert changes.
Parameters:
  - path (string, optional): File to undo last edit for.
Returns: Guidance message.

{"tool":"undo_last","path":"main.py"}
</tool>

</tools>

## DO NOT USE

<forbidden_actions>
- Do NOT use tools not listed above
- Do NOT invent new tools
- Do NOT nest JSON objects — each line is one flat tool object
- Do NOT include comments in the JSON block
- Do NOT use "read_file" on a file you just wrote without verifying it was needed
- Do NOT call the same tool twice when once suffices
</forbidden_actions>

## Behavior Rules

<behavior>
- After executing tools, BRIEFLY summarize what you did. No more than 3-4 sentences.
- If the user asks something unrelated to the current file, answer directly without tools.
- If you don't know something, say you don't know. Do not guess.
- Do not apologize excessively. If an error occurs, fix it and move on.
- Do not provide explanations for trivial operations like "now I will read the file" — just do it.
- Work step by step. Do not plan 5 steps ahead and try to execute them all at once.
- Respect the user's time. Be efficient.
</behavior>

## Response Style

<style>
- Default language: Polish (unless user writes in English)
- Tone: professional, direct, helpful
- No emojis unless user uses them first
- No markdown headers (###, ##) in chat responses — plain text only
- Code snippets in markdown code blocks with language tag
- Keep responses under 200 words unless the task requires more detail
</style>
`;

const PLAN_SYSTEM_PROMPT = `# MAE PLAN MODE — SYSTEM PROMPT

## Identity
You are MAE AI in PLAN MODE. Your job is to understand the user's request, ask clarifying questions, and create a detailed plan BEFORE taking any action. You do NOT execute tools. You only plan.

## Core Rules

<plan_rules>
1. NEVER EXECUTE. Do not use tools. Do not write code. Only plan.
2. ASK QUESTIONS. If anything is unclear, ask before proceeding.
3. BE THOROUGH. Break complex tasks into numbered steps.
4. IDENTIFY RISKS. Point out edge cases and alternatives.
5. ESTIMATE SCOPE. How many files, how complex.
6. CONFIRM. End with "Ready to build? Switch to Build mode."
</plan_rules>

## Response Format

For each request respond with:

1. **Understanding** — restate what you understood (1-2 sentences)
2. **Questions** — ask specific clarifying questions if needed
3. **Plan** — numbered steps: what files, what tools, expected outcome
4. **Risks** — concerns, alternatives, edge cases
5. **Next** — "Ready? Switch to Build mode."

Example:
User: "Add login to my app"
MAE:
Understanding: Add authentication page to the application.
Questions: Email/password or OAuth? Framework? Signup too?
Plan: 1) Create login.html form 2) Add /api/auth endpoint 3) Add session handling 4) Protect routes
Risks: Need password hashing. DB schema needed.
Ready? Switch to Build mode.

Speak Polish unless user writes English. Professional, direct.
`;

// =============================================
//  FONTS
// =============================================
const FONTS = [
    'Comic Sans MS','JetBrains Mono','Cascadia Code','Fira Code','Consolas',
    'Source Code Pro','Courier New','Arial','Segoe UI','Impact','Monaco',
];

// =============================================
//  SUBAGENT: Explorer
// =============================================
const Explorer = {
    async refresh() {
        const tree = $('#fileTree');
        if (!tree) return;
        tree.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);"><span class="codicon codicon-loading" style="animation:spin 1s infinite;"></span> Loading...</div>';
        try {
            const data = await API.tree();
            const tabsData = M.Tabs.getOpenTabs();
            const openFiles = new Set(tabsData.map(t => t.path));
            tree.innerHTML = this.renderTree(data, 0, openFiles);
        } catch (e) {
            tree.innerHTML = '<div style="padding:20px;text-align:center;color:var(--accent-red);">Backend offline<br><small style="color:var(--text-muted);">Run: python -m uvicorn app.main:app --reload</small></div>';
        }
    },

    renderTree(items, depth, openFiles) {
        if (!items || !items.length) return '<div class="tree-item"><span style="color:var(--text-muted);font-style:italic;">Empty workspace</span></div>';
        let h = '';
        items.forEach(item => {
            const isOpen = openFiles.has(item.path);
            const escapedPath = item.path.replace(/"/g, '&quot;');
            const escapedName = item.name.replace(/"/g, '&quot;');
            if (item.type === 'folder') {
                h += `<div class="tree-item tree-folder" data-path="${escapedPath}">${'<span class="tree-indent"></span>'.repeat(depth)}<span class="codicon codicon-chevron-right" style="font-size:11px;"></span> <span class="fa-solid fa-folder"></span> ${item.name}</div>`;
                if (item.children && item.children.length) {
                    h += `<div class="folder-children hidden" data-folder="${escapedPath}">${this.renderTree(item.children, depth+1, openFiles)}</div>`;
                }
            } else {
                h += `<div class="tree-item tree-file${isOpen?' active':''}" data-path="${escapedPath}" data-name="${escapedName}">${'<span class="tree-indent"></span>'.repeat(depth)}<span class="${iconFor(item.name)}"></span> ${item.name}</div>`;
            }
        });
        return h;
    },

    async openFile(path, name) {
        const data = await API.read(path);
        if (data.error) { Modal.alert(data.error, 'Error'); return; }
        STATE.openFile = data.content;
        STATE.openFilePath = path;
        M.Tabs.openTab(path, name);
        M.Editor.show(data.content, name);
        $('#sbFile').innerHTML = `<span class="codicon codicon-file"></span> ${path}`;
        document.querySelectorAll('.tree-item.active').forEach(el => el.classList.remove('active'));
        const sel = `.tree-item[data-path="${CSS.escape(path)}"]`;
        document.querySelector(sel)?.classList.add('active');
        if (Chat.mode === 'build') {
            Chat.setFileContext(path, data.content);
        }
        const recent = JSON.parse(localStorage.getItem('mae-recent') || '[]');
        const filtered = recent.filter(r => r.path !== path);
        filtered.unshift({ path, name, icon: iconFor(name) });
        localStorage.setItem('mae-recent', JSON.stringify(filtered.slice(0, 10)));
    },

    toggleFolder(path) {
        const sel = `.folder-children[data-folder="${CSS.escape(path)}"]`;
        const el = document.querySelector(sel);
        if (el) el.classList.toggle('hidden');
        const rowSel = `.tree-item.tree-folder[data-path="${CSS.escape(path)}"] .codicon`;
        const icon = document.querySelector(rowSel);
        if (icon) {
            icon.classList.toggle('codicon-chevron-right');
            icon.classList.toggle('codicon-chevron-down');
        }
    },

    async newFile() {
        this._showInlineInput('file');
    },

    async newFolder() {
        this._showInlineInput('folder');
    },

    _showInlineInput(type) {
        const tree = document.getElementById('fileTree');
        if (!tree) return;
        const existing = tree.querySelector('.tree-inline-input');
        if (existing) { existing.focus(); return; }
        const div = document.createElement('div');
        div.className = 'tree-item tree-inline-input-row';
        const icon = type === 'folder' ? 'fa-solid fa-folder' : (type === 'file' ? 'fa-solid fa-file' : 'fa-solid fa-file');
        div.innerHTML = `<span class="${icon}" style="margin-right:5px;"></span>`;
        const input = document.createElement('input');
        input.className = 'tree-inline-input';
        input.placeholder = type === 'folder' ? 'folder-name/' : 'file.name';
        input.style.cssText = 'flex:1;background:var(--bg-input);border:1px solid var(--accent);color:var(--text);padding:2px 6px;border-radius:3px;font-size:12px;font-family:inherit;outline:none;';
        input.onkeydown = (e) => this._handleInlineKey(e, type);
        input.onblur = () => { setTimeout(() => { if (div.parentElement) div.remove(); }, 200); };
        div.appendChild(input);
        tree.insertBefore(div, tree.firstChild);
        setTimeout(() => input.focus(), 10);
    },

    _handleInlineKey(e, type) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.target.value.trim();
            const row = e.target.parentElement;
            if (row) row.remove();
            if (!val) return;
            const isFolder = type === 'folder' || val.endsWith('/');
            const name = val.replace(/\/$/, '');
            if (isFolder) {
                API.mkdir(name).then(() => Explorer.refresh());
            } else {
                API.write(name, '# ' + name + '\n').then(() => Explorer.refresh());
            }
        } else if (e.key === 'Escape') {
            const row = e.target.parentElement;
            if (row) row.remove();
        }
    },

    async search(query) {
        if (!query.trim()) { this.refresh(); return; }
        const data = await API.search(query);
        const tree = $('#fileTree');
        tree.innerHTML = `<div class="tree-section-header"><span class="codicon codicon-search"></span> Results: "${query}"</div>` +
            data.map(item => {
                if (item.type === 'folder') return `<div class="tree-item" onclick="Explorer.openFile('${item.path}','${item.name}')"><span class="fa-solid fa-folder"></span> ${item.name}</div>`;
                return `<div class="tree-item" onclick="Explorer.openFile('${item.path}','${item.name}')"><span class="${iconFor(item.name)}"></span> ${item.name} <span style="color:var(--text-muted);font-size:10px;margin-left:auto;">${item.path}</span></div>`;
            }).join('') || '<div class="tree-item"><span style="color:var(--text-muted);">No results</span></div>';
    },

    async deleteFile() {
        if (!STATE.openFilePath) return;
        Modal.confirm(`Delete ${STATE.openFilePath}?`, async () => {
            await API.delete(STATE.openFilePath);
            M.Tabs.closeTab(STATE.openFilePath);
            STATE.openFile = null;
            STATE.openFilePath = '';
            M.Editor.show('', '');
            await this.refresh();
        }, 'Delete File', 'Delete');
    },
};

// =============================================
//  SUBAGENT: Tabs
// =============================================
const Tabs = {
    tabs: [],

    openTab(path, name) {
        if (path === 'preview.html') return;
        const existing = this.tabs.find(t => t.path === path);
        if (!existing) {
            this.tabs.push({ path, name, active: true });
        }
        this.tabs.forEach(t => t.active = t.path === path);
        this.render();
    },

    closeTab(path) {
        this.tabs = this.tabs.filter(t => t.path !== path);
        if (this.tabs.length > 0) {
            this.tabs[this.tabs.length-1].active = true;
        }
        this.render();
    },

    getOpenTabs() { return this.tabs; },

    render() {
        const bar = $('#tabsContent');
        if (!bar) return;
        let h = this.tabs.map(t => {
            const icon = iconFor(t.name);
            return `<div class="tab${t.active?' active':''}" onclick="Explorer.openFile('${t.path}','${t.name}')">
                <span class="${icon}"></span><span>${t.name}</span>
                <span class="tab-x" onclick="event.stopPropagation();Tabs.closeTab('${t.path}')"><span class="codicon codicon-close"></span></span>
            </div>`;
        }).join('');
        if (this.tabs.length > 0) {
            const active = this.tabs.find(t => t.active);
            if (active && active.name.endsWith('.html')) {
                h += `<button class="tab" onclick="M.Editor.preview()" style="background:var(--accent);color:#0d0d0d;font-weight:600;border:none;padding:0 12px;margin-left:4px;"><span class="codicon codicon-eye"></span> Preview</button>`;
            }
        }
        h += '<div class="tab tab-add"><span class="codicon codicon-add" style="font-size:14px;"></span></div>';
        bar.innerHTML = h;
    },
};

// =============================================
//  SUBAGENT: Editor
// =============================================
const Editor = {
    show(content, name) {
        const code = $('#editorCode');
        const panel = $('#editorPanel');
        if (!code || !panel) return;

        if (!content && !name) {
            panel.innerHTML = this._welcomePage();
            return;
        }

        if (!panel.querySelector('.editor')) {
            panel.innerHTML = `<div class="editor"><div class="editor-gutter font-mono-ui" id="editorGutter"></div><textarea class="editor-code font-mono" id="editorCode" spellcheck="false" placeholder="Select a file from Explorer..."></textarea></div>`;
            const newCode = $('#editorCode');
            if (newCode) {
                newCode.addEventListener('input', () => this.updateGutter());
                newCode.addEventListener('scroll', () => {
                    const gutter = $('#editorGutter');
                    if (gutter) gutter.scrollTop = newCode.scrollTop;
                });
            }
        }

        const codeEl = $('#editorCode');
        codeEl.value = content || '';
        const lines = (content || '').split('\n');
        const gutter = $('#editorGutter');
        gutter.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
    },

    _welcomePage() {
        const recent = JSON.parse(localStorage.getItem('mae-recent') || '[]');
        const recentHTML = recent.slice(0, 5).map(r =>
            `<div onclick="Explorer.openFile('${r.path}','${r.name}')" style="display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:4px;cursor:pointer;font-size:12px;color:var(--text);transition:background 0.15s;" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background='transparent'">
                <span class="${r.icon}" style="font-size:14px;width:18px;text-align:center;"></span>
                <span>${escapeHTML(r.name)}</span>
                <span style="color:var(--text-muted);font-size:10px;margin-left:auto;">${escapeHTML(r.path)}</span>
            </div>`
        ).join('');

        return `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:40px;overflow-y:auto;">
            <div style="max-width:600px;width:100%;">
                <!-- Logo -->
                <div style="text-align:center;margin-bottom:32px;">
                    <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,#fab283 0%,#e8704a 50%,#fc533a 100%);font-size:32px;margin-bottom:12px;">⚡</div>
                    <div style="color:var(--text);font-size:20px;font-weight:700;letter-spacing:-0.5px;">Make Anything Editor</div>
                    <div style="color:var(--text-muted);font-size:12px;margin-top:4px;">Version 1.0 — MAE</div>
                </div>

                <!-- Quick Actions -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:32px;">
                    <div onclick="M.fileNew()" style="padding:16px;background:var(--bg-raised);border:1px solid var(--border);border-radius:8px;cursor:pointer;transition:border-color 0.15s;" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                            <span class="codicon codicon-new-file" style="color:var(--accent);font-size:16px;"></span>
                            <span style="color:var(--text);font-size:13px;font-weight:600;">New File</span>
                        </div>
                        <div style="color:var(--text-muted);font-size:11px;">Create a new file in workspace</div>
                    </div>
                    <div onclick="M.UI.showSidebar('extensions')" style="padding:16px;background:var(--bg-raised);border:1px solid var(--border);border-radius:8px;cursor:pointer;transition:border-color 0.15s;" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                            <span class="codicon codicon-extensions" style="color:var(--accent);font-size:16px;"></span>
                            <span style="color:var(--text);font-size:13px;font-weight:600;">Extensions</span>
                        </div>
                        <div style="color:var(--text-muted);font-size:11px;">Browse & install extensions</div>
                    </div>
                    <div onclick="M.UI.showSidebar('git')" style="padding:16px;background:var(--bg-raised);border:1px solid var(--border);border-radius:8px;cursor:pointer;transition:border-color 0.15s;" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                            <span class="codicon codicon-source-control" style="color:var(--accent);font-size:16px;"></span>
                            <span style="color:var(--text);font-size:13px;font-weight:600;">Source Control</span>
                        </div>
                        <div style="color:var(--text-muted);font-size:11px;">Publish to GitHub</div>
                    </div>
                    <div onclick="M.UI.togglePanel('chat')" style="padding:16px;background:var(--bg-raised);border:1px solid var(--border);border-radius:8px;cursor:pointer;transition:border-color 0.15s;" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                            <span class="codicon codicon-comment-discussion" style="color:var(--accent);font-size:16px;"></span>
                            <span style="color:var(--text);font-size:13px;font-weight:600;">AI Chat</span>
                        </div>
                        <div style="color:var(--text-muted);font-size:11px;">Ask AI for help</div>
                    </div>
                </div>

                <!-- Keyboard Shortcuts -->
                <div style="margin-bottom:32px;">
                    <div style="color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Keyboard Shortcuts</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:var(--bg-raised);border-radius:4px;">
                            <span style="color:var(--text);font-size:11px;">New File</span>
                            <kbd style="background:var(--bg-hover);padding:2px 6px;border-radius:3px;font-size:10px;color:var(--text-dim);font-family:inherit;">Ctrl+N</kbd>
                        </div>
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:var(--bg-raised);border-radius:4px;">
                            <span style="color:var(--text);font-size:11px;">Save</span>
                            <kbd style="background:var(--bg-hover);padding:2px 6px;border-radius:3px;font-size:10px;color:var(--text-dim);font-family:inherit;">Ctrl+S</kbd>
                        </div>
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:var(--bg-raised);border-radius:4px;">
                            <span style="color:var(--text);font-size:11px;">AI Chat</span>
                            <kbd style="background:var(--bg-hover);padding:2px 6px;border-radius:3px;font-size:10px;color:var(--text-dim);font-family:inherit;">Ctrl+K</kbd>
                        </div>
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:var(--bg-raised);border-radius:4px;">
                            <span style="color:var(--text);font-size:11px;">Run Code</span>
                            <kbd style="background:var(--bg-hover);padding:2px 6px;border-radius:3px;font-size:10px;color:var(--text-dim);font-family:inherit;">Ctrl+Enter</kbd>
                        </div>
                    </div>
                </div>

                <!-- Recent Files -->
                ${recent.length > 0 ? `
                <div>
                    <div style="color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Recent Files</div>
                    <div style="background:var(--bg-raised);border-radius:6px;padding:4px;">
                        ${recentHTML}
                    </div>
                </div>
                ` : ''}

                <!-- Links -->
                <div style="text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid var(--border);">
                    <div style="color:var(--text-muted);font-size:11px;">
                        <span onclick="window.open('/docs')" style="color:var(--accent);cursor:pointer;">API Docs</span>
                        <span style="margin:0 8px;">·</span>
                        <span style="cursor:pointer;" onclick="M.UI.showSettings()">Settings</span>
                    </div>
                </div>
            </div>
        </div>`;
    },

    updateGutter() {
        const code = $('#editorCode');
        if (!code) return;
        const lines = (code.value || '').split('\n');
        const gutter = $('#editorGutter');
        gutter.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
    },

    getContent() {
        const code = $('#editorCode');
        return code ? code.value : '';
    },

    async save() {
        if (!STATE.openFilePath) return;
        const content = this.getContent();
        await API.write(STATE.openFilePath, content);
        M.Output.log(`Saved: ${STATE.openFilePath}`, 'ok');
    },

    async saveAs() {
        Modal.prompt('Save as:', 'newfile.py', async (name) => {
            const content = this.getContent();
            await API.write(name, content);
            Explorer.refresh();
            M.Output.log(`Created: ${name}`, 'ok');
        }, 'Save As', 'Save');
    },

    preview() {
        if (!STATE.openFilePath) return;
        if (STATE.openFilePath.endsWith('.html')) {
            window.open('/preview/' + STATE.openFilePath, '_blank');
        } else {
            M.Output.log('Preview only works for .html files', 'warn');
        }
    },
};

// =============================================
//  SUBAGENT: Chat
// =============================================
const Chat = {
    messages: [],
    mode: 'normal',
    fileContext: null,
    fileContent: '',

    async init() {
        try { await this.loadModels(); } catch (e) { console.warn('loadModels failed:', e); }
        try { await this.checkHealth(); } catch (e) { console.warn('checkHealth failed:', e); }
        let sp = localStorage.getItem('mae-system-prompt');
        if (sp === null) {
            sp = DEFAULT_SYSTEM_PROMPT;
            localStorage.setItem('mae-system-prompt', sp);
        }
        const badge = $('#sysPromptBadge');
        if (sp) {
            badge.style.display = 'inline-block';
            badge.title = sp;
        } else {
            badge.style.display = 'none';
        }
        const savedMode = localStorage.getItem('mae-chat-mode') || 'normal';
        this.setMode(savedMode, true);
        this.updateTasks();
    },

    setMode(mode, silent) {
        this.mode = mode;
        localStorage.setItem('mae-chat-mode', mode);
        const sel = $('#chatModeSelect');
        if (sel) sel.value = mode;
        if (!silent) {
            const labels = { normal: 'TRYB CHAT', build: 'TRYB BUILD - narz\u0119dzia', plan: 'TRYB PLAN - pytania i plan' };
            this.addSysMsg(labels[mode] || mode);
        }
    },

    updateTasks() {
        const done = this.messages.filter(m => m.role === 'ai').length;
        const total = this.messages.filter(m => m.role === 'user').length;
        $('#taskDone').textContent = done;
        $('#taskTotal').textContent = total;
        const items = $('#taskItems');
        if (total === 0) {
            items.innerHTML = '<div class="chat-task-item"><span class="codicon codicon-circle-outline"></span> Zadaj pierwsze pytanie</div>';
        } else {
            items.innerHTML = this.messages.filter(m => m.role === 'user').map((m, i) => {
                const isDone = this.messages.filter(x => x.role === 'ai').length > i;
                return `<div class="chat-task-item${isDone ? ' done' : ''}"><span class="codicon ${isDone ? 'codicon-check' : 'codicon-circle-outline'}"></span> ${escapeHTML(m.content.substring(0, 60))}</div>`;
            }).join('');
        }
    },

    toggleBuildMode() {
        this.setMode(this.mode === 'build' ? 'normal' : 'build');
    },

    addFileContext() {
        if (!STATE.openFilePath) {
            M.Output.log('Najpierw otw\u00F3rz plik w Explorerze', 'warn');
            return;
        }
        this.fileContext = STATE.openFilePath;
        this.fileContent = STATE.openFile || '';
        const ctx = $('#chatFileContext');
        ctx.style.display = 'flex';
        $('#chatFileName').textContent = STATE.openFilePath + ' (' + (this.fileContent.length) + ' znak\u00F3w)';
        this.addSysMsg(`Plik dodany do kontekstu: ${STATE.openFilePath}`);
    },

    clearFileContext() {
        this.fileContext = null;
        this.fileContent = '';
        $('#chatFileContext').style.display = 'none';
    },

    setFileContext(path, content) {
        this.fileContext = path;
        this.fileContent = content || '';
        const ctx = $('#chatFileContext');
        ctx.style.display = 'flex';
        $('#chatFileName').textContent = path + ' (' + (this.fileContent.length) + ' znak\u00F3w)';
    },

    _buildSystemPrompt() {
        if (this.mode === 'build') return BUILD_SYSTEM_PROMPT;
        if (this.mode === 'plan') return PLAN_SYSTEM_PROMPT;
        let prompt = localStorage.getItem('mae-system-prompt') || DEFAULT_SYSTEM_PROMPT;
        if (this.fileContext) {
            prompt += '\n\nAKTUALNY PLIK: ' + this.fileContext + '\n```\n' + this.fileContent + '\n```';
        }
        return prompt;
    },

    _systemPromptForLoop() {
        if (this.mode === 'build') return BUILD_SYSTEM_PROMPT;
        if (this.mode === 'plan') return PLAN_SYSTEM_PROMPT;
        return this._buildSystemPrompt();
    },

    async loadModels() {
        const prov = $('#chatProvider').value;
        STATE.provider = prov;
        localStorage.setItem('mae-provider', prov);
        const sel = $('#chatModel');
        try {
            const data = await API.models(prov);
            if (data.models) {
                const saved = localStorage.getItem('mae-model');
                sel.innerHTML = data.models.map(m => `<option value="${m}" ${m===saved?'selected':''}>${m}</option>`).join('');
                STATE.model = sel.value;
            }
        } catch { sel.innerHTML = '<option>Error</option>'; }
    },

    async checkHealth() {
        try {
            const h = await API.health();
            const dot = $('#healthDot');
            dot.style.background = (h.zen||h.go) ? 'var(--accent-green)' : 'var(--accent-red)';
        } catch { $('#healthDot').style.background = 'var(--text-muted)'; }
    },

    async send() {
        const input = $('#chatInput');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;

        const model = $('#chatModel')?.value || STATE.model;
        const provider = $('#chatProvider')?.value || STATE.provider;
        localStorage.setItem('mae-model', model);
        localStorage.setItem('mae-provider', provider);
        STATE.model = model;
        STATE.provider = provider;

        this.messages.push({ role: 'user', content: text });
        this.updateTasks();
        this.addMsg('Edycja', text, 'user', time(), this.fileContext);
        input.value = '';

        if (this.mode === 'build') {
            await this._autoLoop(text, provider, model);
        } else {
            await this._singleChat(text, provider, model);
        }
    },

    async _singleChat(text, provider, model) {
        const systemPrompt = this._buildSystemPrompt();
        const loading = this.addThinking();
        try {
            const data = await API.chat(provider, model, [{ role: 'user', content: text }], systemPrompt);
            loading.remove();
            if (data.error) { this.addMsg('Błąd', data.error, 'error', time()); return; }
            const content = data.choices?.[0]?.message?.content;
            if (content) {
                this.messages.push({ role: 'ai', content });
                this.updateTasks();
                this.addMsg(`MAE · ${model}`, content, 'ai', time());
            }
        } catch (e) { loading.remove(); this.addMsg('Błąd', e.message, 'error', time()); }
    },

    async _autoLoop(initialText, provider, model) {
        const conversation = [
            { role: 'system', content: this._systemPromptForLoop() },
            { role: 'user', content: initialText },
        ];

        const loading = this.addThinking();
        let loopCount = 0;
        const MAX_LOOPS = 8;
        let finalContent = '';

        while (loopCount < MAX_LOOPS) {
            loopCount++;
            try {
                const data = await API.chat(provider, model, conversation, this._systemPromptForLoop());
                if (data.error) { loading.remove(); this.addMsg('Błąd', data.error, 'error', time()); return; }
                const content = data.choices?.[0]?.message?.content;
                if (!content) { loading.remove(); this.addMsg('Błąd', 'Pusta odpowiedź AI', 'error', time()); return; }

                const tools = this._parseTools(content);
                if (tools.length === 0) {
                    loading.remove();
                    finalContent = content;
                    break;
                }

                const results = [];
                for (const tool of tools) {
                    const result = await this._execTool(tool);
                    results.push(result);
                    this.addMsg(`Tool: ${tool.tool}`, result.result, 'tool', time());
                }

                const toolResults = results.map(r => JSON.stringify(r)).join('\n');
                conversation.push({ role: 'assistant', content: content });
                conversation.push({ role: 'user', content: `TOOL RESULTS (JSON):\n${toolResults}\n\nContinue with more tools or respond with final answer.` });
            } catch (e) {
                loading.remove();
                this.addMsg('Błąd pętli', e.message, 'error', time());
                return;
            }
        }

        loading.remove();
        if (finalContent) {
            this.messages.push({ role: 'ai', content: finalContent });
            this.updateTasks();
            this.addMsg(`MAE · ${model}`, finalContent, 'ai', time());
        } else {
            this.addMsg('MAE', 'Przekroczono limit pętli narzędzi. Spróbuj prościej.', 'error', time());
        }
    },

    _parseTools(text) {
        const tools = [];
        const jsonBlock = text.match(/```json\s*([\s\S]*?)```/);
        if (!jsonBlock) return tools;
        const block = jsonBlock[1].trim();
        const lines = block.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('{')) continue;
            try {
                const obj = JSON.parse(trimmed);
                if (obj.tool) tools.push(obj);
            } catch (e) { /* skip */ }
        }
        return tools;
    },

    async _execTool(tool) {
        const t = tool.tool;
        const p = tool;
        const r = (ok, msg) => ({ tool: t, success: ok, result: msg });
        try {
            switch (t) {
                case 'read_file': {
                    const data = await API.read(p.path || '');
                    if (data.error) return r(false, data.error);
                    if (p.path === STATE.openFilePath) { STATE.openFile = data.content; Chat.fileContent = data.content; }
                    return r(true, data.content);
                }
                case 'read_multiple': {
                    const paths = p.paths || [];
                    const results = {};
                    for (const fp of paths) { const d = await API.read(fp); results[fp] = d.error ? `ERROR: ${d.error}` : d.content; }
                    return r(true, JSON.stringify(results, null, 2));
                }
                case 'write_file': {
                    const wRes = await API.write(p.path || 'untitled.txt', p.content || '');
                    if (wRes.error) return r(false, wRes.error);
                    Explorer.refresh();
                    if (p.path === STATE.openFilePath) { STATE.openFile = p.content; Editor.show(p.content, p.path); }
                    return r(true, `Written: ${p.path} (${(p.content||'').length} chars)`);
                }
                case 'edit_file': {
                    return await this._execEdit(p.path, [{ line: p.line, oldString: p.oldString, newString: p.newString }]);
                }
                case 'edit_multiple': {
                    return await this._execEdit(p.path, p.edits || []);
                }
                case 'append_to_file': {
                    const ad = await API.read(p.path);
                    if (ad.error) return r(false, ad.error);
                    const nc = (ad.content || '') + '\n' + (p.content || '');
                    await API.write(p.path, nc);
                    if (p.path === STATE.openFilePath) { STATE.openFile = nc; Chat.fileContent = nc; Editor.show(nc, p.path); }
                    Explorer.refresh();
                    return r(true, `Appended to ${p.path}`);
                }
                case 'insert_at_line': {
                    const id = await API.read(p.path);
                    if (id.error) return r(false, id.error);
                    const ils = id.content.split('\n');
                    ils.splice(Math.min((p.line||1)-1, ils.length), 0, p.content || '');
                    const inew = ils.join('\n');
                    await API.write(p.path, inew);
                    if (p.path === STATE.openFilePath) { STATE.openFile = inew; Chat.fileContent = inew; Editor.show(inew, p.path); }
                    Explorer.refresh();
                    return r(true, `Inserted at line ${p.line} in ${p.path}`);
                }
                case 'delete_lines': {
                    const dd = await API.read(p.path);
                    if (dd.error) return r(false, dd.error);
                    const dls = dd.content.split('\n');
                    dls.splice((p.fromLine||1)-1, (p.toLine||(p.fromLine||1)) - (p.fromLine||1));
                    const dnew = dls.join('\n');
                    await API.write(p.path, dnew);
                    if (p.path === STATE.openFilePath) { STATE.openFile = dnew; Chat.fileContent = dnew; Editor.show(dnew, p.path); }
                    Explorer.refresh();
                    return r(true, `Deleted lines ${p.fromLine}-${p.toLine} in ${p.path}`);
                }
                case 'delete_file': {
                    const delRes = await API.delete(p.path || '');
                    if (delRes.error) return r(false, delRes.error);
                    Explorer.refresh();
                    if (p.path === STATE.openFilePath) { STATE.openFile = null; STATE.openFilePath = ''; Editor.show('', ''); }
                    return r(true, `Deleted: ${p.path}`);
                }
                case 'create_folder': {
                    const mkRes = await API.mkdir(p.path || '');
                    if (mkRes.error) return r(false, mkRes.error);
                    Explorer.refresh();
                    return r(true, `Created folder: ${p.path}`);
                }
                case 'rename_file': {
                    const rnRes = await API.fetch(`/api/files/rename`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ old_path:p.oldPath, new_name:p.newPath.split('/').pop() }) });
                    if (rnRes.error) return r(false, rnRes.error);
                    Explorer.refresh();
                    return r(true, `Renamed: ${p.oldPath} → ${p.newPath}`);
                }
                case 'list_files': {
                    const lf = await API.tree();
                    return r(true, (lf||[]).map(f=>`${f.type==='folder'?'📁':'📄'} ${f.path}`).join('\n')||'Empty');
                }
                case 'search_files': {
                    const sf = await API.search(p.query||'');
                    return r(true, JSON.stringify(sf,null,2));
                }
                case 'search_in_files': {
                    const sif = await API.fetch(`/api/files/search?q=${encodeURIComponent(p.query||'')}`);
                    return r(true, JSON.stringify(sif,null,2));
                }
                case 'run_code': {
                    const rc = await API.execute(p.code||'', p.language||'python');
                    if (rc.error) return r(false, rc.error);
                    const out = (rc.stdout||'') + (rc.stderr?'\nSTDERR:\n'+rc.stderr:'');
                    return r(!rc.stderr&&rc.returncode===0, out||'(no output)');
                }
                case 'run_command': {
                    M.Output.log(`$ ${p.command}`, 'cmd');
                    return r(true, `Ran: ${p.command}`);
                }
                case 'validate_file': {
                    const vd = await API.read(p.path);
                    if (vd.error) return r(false, vd.error);
                    const vlines = vd.content.split('\n');
                    return r(true, `File: ${p.path}\nLines: ${vlines.length}\nSize: ${vd.content.length} chars\nOK`);
                }
                case 'get_file_info': {
                    const gi = await API.read(p.path);
                    if (gi.error) return r(false, gi.error);
                    const gl = gi.content.split('\n');
                    return r(true, JSON.stringify({ path:p.path, lines:gl.length, size:gi.content.length, ext:p.path.split('.').pop() }));
                }
                case 'get_context': {
                    if (!STATE.openFilePath) return r(true, 'No file open');
                    const gc = (STATE.openFile||'').substring(0, 3000);
                    return r(true, JSON.stringify({ path:STATE.openFilePath, content:gc+(gc.length>=3000?'...(truncated)':'') }));
                }
                case 'replace_in_file': {
                    const rd = await API.read(p.path);
                    if (rd.error) return r(false, rd.error);
                    if (!rd.content.includes(p.oldString)) return r(false, `"${p.oldString}" not found`);
                    const rnew = p.firstOnly ? rd.content.replace(p.oldString, p.newString) : rd.content.split(p.oldString).join(p.newString);
                    await API.write(p.path, rnew);
                    if (p.path === STATE.openFilePath) { STATE.openFile = rnew; Chat.fileContent = rnew; Editor.show(rnew, p.path); }
                    Explorer.refresh();
                    return r(true, `Replaced in ${p.path}`);
                }
                case 'count_lines': {
                    const cl = await API.read(p.path);
                    if (cl.error) return r(false, cl.error);
                    return r(true, `${p.path}: ${cl.content.split('\n').length} lines`);
                }
                case 'diff_file': {
                    const da = await API.read(p.path1), db = await API.read(p.path2);
                    if (da.error) return r(false, da.error);
                    if (db.error) return r(false, db.error);
                    return r(true, `${p.path1}: ${da.content.length}c\n${p.path2}: ${db.content.length}c`);
                }
                case 'undo_last': {
                    return r(true, 'Undo not available. Use edit_file to revert.');
                }
                default:
                    return r(false, `Unknown tool: ${t}`);
            }
        } catch (e) { return r(false, `EXCEPTION: ${e.message}`); }
    },

    async _execEdit(path, edits) {
        const r = (ok, msg) => ({ tool: 'edit_file', success: ok, result: msg });
        const data = await API.read(path);
        if (data.error) return r(false, data.error);
        const lines = data.content.split('\n');
        let applied = 0;
        const errors = [];
        for (const e of edits) {
            const idx = (e.line || 1) - 1;
            if (idx < 0 || idx >= lines.length) { errors.push(`Line ${e.line}: out of range (1-${lines.length})`); continue; }
            if (lines[idx] !== e.oldString) { errors.push(`Line ${e.line}: MISMATCH\n  Expected: "${e.oldString}"\n  Actual:   "${lines[idx]}"`); continue; }
            lines[idx] = e.newString;
            applied++;
        }
        if (errors.length > 0) return r(false, `${applied}/${edits.length} applied.\n${errors.join('\n')}`);
        const newContent = lines.join('\n');
        await API.write(path, newContent);
        if (path === STATE.openFilePath) { STATE.openFile = newContent; Chat.fileContent = newContent; Editor.show(newContent, path); }
        Explorer.refresh();
        return r(true, `${applied}/${edits.length} lines in ${path}`);
    },

    addSysMsg(content) {
        const b = $('#chatBody');
        if (!b) return;
        const d = document.createElement('div');
        d.className = 'chat-msg';
        d.innerHTML = `<div class="chat-msg-head"><span class="chat-msg-role ai">MAE</span></div><div class="chat-msg-body" style="color:var(--text-dim);font-style:italic;">${content}</div>`;
        b.appendChild(d);
        b.scrollTop = b.scrollHeight;
    },

    addMsg(role, content, cls, timeStr, fileRef) {
        const b = $('#chatBody');
        if (!b) return;
        const d = document.createElement('div');
        d.className = 'chat-msg';

        const roleClass = cls === 'ai' ? 'ai' : cls === 'user' || cls === 'edits' ? 'user' : cls === 'thinking' ? 'meta' : cls === 'error' ? 'error' : cls === 'tool' ? 'tool' : 'meta';
        let bodyStyle = '';
        if (cls === 'thinking') bodyStyle = 'color:var(--text-dim);font-style:italic;font-size:12px;border-left:2px solid var(--accent-purple);padding-left:8px;';
        if (cls === 'error') bodyStyle = 'color:var(--accent-red);font-family:JetBrains Mono,monospace;font-size:11px;';
        if (cls === 'edits') bodyStyle = 'color:var(--accent-green);font-family:JetBrains Mono,monospace;font-size:11px;white-space:pre-wrap;';
        if (cls === 'tool') bodyStyle = 'color:var(--accent-teal);font-family:JetBrains Mono,monospace;font-size:11px;white-space:pre-wrap;padding:4px 8px;background:rgba(0,206,185,0.06);border-radius:4px;border-left:2px solid var(--accent-teal);';

        let headerExtra = '';
        if (fileRef) headerExtra = `<span class="chat-msg-file" onclick="Explorer.openFile('${fileRef}','${fileRef.split('/').pop()}')">${fileRef}</span>`;

        let html = `<div class="chat-msg-head"><span class="chat-msg-role ${roleClass}">${escapeHTML(role)}</span>${headerExtra}<span class="chat-msg-time">${timeStr}</span></div>`;

        if (cls === 'ai') {
            html += this._renderMarkdown(content);
        } else {
            html += `<div class="chat-msg-body" style="${bodyStyle}">${escapeHTML(content)}</div>`;
        }

        d.innerHTML = html;
        b.appendChild(d);
        b.scrollTop = b.scrollHeight;
    },

    _renderMarkdown(text) {
        let html = escapeHTML(text);
        const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
        let hasCode = false;
        html = html.replace(codeBlockRegex, (match, lang, code) => {
            hasCode = true;
            const escapedCode = code.trimEnd();
            const lines = escapedCode.split('\n');
            const numbered = lines.map((l, i) => `<div class="chat-code-line"><span class="ln">${i + 1}</span>${l || ' '}</div>`).join('');
            const header = `<div class="chat-code-header"><span>${lang || 'code'}</span><span class="codicon codicon-copy" title="Kopiuj"></span></div>`;
            return `${header}<div class="chat-code-body">${numbered}</div>`;
        });
        const wrapped = `<div class="chat-msg-body">${html.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</div>`;
        if (hasCode) {
            return wrapped + `<div class="chat-actions">
                <button class="chat-action-btn"><span class="codicon codicon-copy"></span> Kopiuj</button>
                <button class="chat-action-btn primary"><span class="codicon codicon-diff-added"></span> Zastosuj</button>
                <button class="chat-action-btn"><span class="codicon codicon-history"></span> Cofnij</button>
            </div>`;
        }
        return wrapped;
    },

    addThinking() {
        const b = $('#chatBody');
        if (!b) return { remove: () => { } };
        const d = document.createElement('div');
        d.className = 'chat-msg';
        d.innerHTML = `<div class="chat-msg-head"><span class="chat-msg-role meta">My\u015Blenie</span></div><div class="typing-dots"><span></span><span></span><span></span></div>`;
        b.appendChild(d);
        b.scrollTop = b.scrollHeight;
        return { remove: () => d.remove() };
    },

    newSession() {
        $('#chatBody').innerHTML = '';
        this.messages = [];
        this.updateTasks();
    },

    clear() { this.newSession(); },
};

// =============================================
//  SUBAGENT: Terminal
// =============================================
const Terminal = {
    history: [],
    historyIdx: -1,

    async execute(cmd) {
        const out = $('#terminalOutput');
        if (!out) return;
        this.history.push(cmd);
        this.historyIdx = this.history.length;
        out.innerHTML += `<div class="pline cmd">>>> ${escapeHTML(cmd)}</div>`;

        const trimmed = cmd.trim();
        if (!trimmed) { out.scrollTop = out.scrollHeight; return; }

        let language = 'python';
        const shellPatterns = /^(dir|ls|cd|mkdir|rm|rmdir|cp|copy|mv|move|cat|type|echo|pwd|whoami|ps|tasklist|pip|npm|git|python|node|cls|clear|del|erase|ren|rename|set|path|ver|date|time|help|exit|ipconfig|ping|netstat|where|which)\b/i;
        if (shellPatterns.test(trimmed)) {
            language = 'shell';
        }
        if (/[|>&]/.test(trimmed)) {
            language = 'shell';
        }

        try {
            const result = await API.execute(trimmed, language);
            if (result.stdout) {
                out.innerHTML += result.stdout.split('\n').map(l => `<div class="pline ${language==='shell'?'info':'ok'}">${escapeHTML(l)}</div>`).join('');
            }
            if (result.stderr) {
                out.innerHTML += result.stderr.split('\n').map(l => `<div class="pline err">${escapeHTML(l)}</div>`).join('');
            }
            if (result.error) {
                out.innerHTML += `<div class="pline err">${escapeHTML(result.error)}</div>`;
            }
        } catch (e) {
            out.innerHTML += `<div class="pline err">Error: ${escapeHTML(e.message)}</div>`;
        }
        out.scrollTop = out.scrollHeight;
    },

    handleKey(e) {
        if (e.key === 'Enter') {
            const input = $('#terminalInput');
            if (!input) return;
            const cmd = input.value;
            input.value = '';
            this.execute(cmd);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.history.length > 0) {
                this.historyIdx = Math.max(0, this.historyIdx - 1);
                $('#terminalInput').value = this.history[this.historyIdx] || '';
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIdx < this.history.length - 1) {
                this.historyIdx++;
                $('#terminalInput').value = this.history[this.historyIdx] || '';
            } else {
                this.historyIdx = this.history.length;
                $('#terminalInput').value = '';
            }
        }
    },

    runCode() {
        const code = Editor.getContent();
        if (code.trim()) {
            this.execute(code);
        } else {
            $('#terminalInput')?.focus();
        }
    },

    clear() {
        const out = $('#terminalOutput');
        if (out) out.innerHTML = '<div class="pline info">MAE Terminal v1.0</div><div class="pline cmd">>>> </div>';
    },

    toggle() {
        const panel = document.querySelector('.panel');
        const content = document.getElementById('terminalOutput');
        const inputLine = document.querySelector('.terminal-input-line');
        if (panel && content && inputLine) {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? '' : 'none';
            inputLine.style.display = isHidden ? '' : 'none';
            const btn = $('#panelToggle')?.querySelector('.codicon');
            if (btn) {
                btn.classList.toggle('codicon-chevron-up', isHidden);
                btn.classList.toggle('codicon-chevron-down', !isHidden);
            }
        }
    },

    showTab(name) {
        $$('#panelTabs .panel-tab').forEach(t => t.classList.remove('active'));
        event?.target?.closest('.panel-tab')?.classList.add('active');
        $('#terminalOutput').classList.toggle('hidden', name !== 'terminal');
        $('#outputPanel').classList.toggle('hidden', name !== 'output');
        $('#debugPanel').classList.toggle('hidden', name !== 'debug');
        $('#terminalInputLine').classList.toggle('hidden', name !== 'terminal');
        if (name === 'terminal') setTimeout(() => $('#terminalInput')?.focus(), 50);
    },
};
const Execute = {
    async run() {
        const code = Editor.getContent();
        if (!code.trim()) { M.Output.log('Nothing to run', 'warn'); return; }
        M.Output.log(`>>> Running ${STATE.openFilePath||'code'}`, 'cmd');
        const result = await API.execute(code, 'python');
        const out = $('#terminalOutput');
        if (result.stdout) {
            result.stdout.split('\n').filter(l=>l.trim()).forEach(l => {
                out.innerHTML += `<div class="pline ok">${escapeHTML(l)}</div>`;
            });
        }
        if (result.stderr) {
            result.stderr.split('\n').filter(l=>l.trim()).forEach(l => {
                out.innerHTML += `<div class="pline err">${escapeHTML(l)}</div>`;
            });
        }
        if (result.error) {
            out.innerHTML += `<div class="pline err">${escapeHTML(result.error)}</div>`;
        }
        out.scrollTop = out.scrollHeight;
    },
};

// =============================================
//  SUBAGENT: Output
// =============================================
const Output = {
    log(msg, type = 'info') {
        const out = $('#outputPanel');
        if (!out) return;
        const cls = type === 'ok' ? 'ok' : type === 'err' ? 'err' : type === 'warn' ? 'warn' : type === 'cmd' ? 'cmd' : 'info';
        out.innerHTML += `<div class="pline ${cls}">[${new Date().toLocaleTimeString()}] ${escapeHTML(msg)}</div>`;
        out.scrollTop = out.scrollHeight;
    },
    show() { const o=$('#outputPanel'); if(o)o.scrollTop=o.scrollHeight; },
};

// =============================================
//  SUBAGENT: Settings
// =============================================
const Settings = {
    showTab(tab) {
        $$('.settings-tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        const body = $('#settingsBody');
        if (tab === 'general') {
            const sysPrompt = localStorage.getItem('mae-system-prompt') || '';
            body.innerHTML = `
                <div class="settings-field"><div class="settings-label">Font</div>
                    <select class="settings-select" onchange="Settings.setFont(this.value)" id="settingsFont">
                        ${FONTS.map(f => `<option value="${f}" ${(localStorage.getItem('mae-font')||'Comic Sans MS')===f?'selected':''}>${f}</option>`).join('')}
                    </select>
                </div>
                <div class="settings-field"><div class="settings-label">Theme</div>
                    <select class="settings-select" onchange="Settings.setTheme(this.value)">
                        <option value="oc-2-dark">OpenCode OC-2 Dark</option>
                        <option value="vscode-dark">VS Code Dark</option>
                    </select>
                </div>
                <div class="settings-field"><div class="settings-label">Default Provider</div>
                    <select class="settings-select" id="settingsProvider" onchange="Settings.save('provider',this.value)">
                        <option value="zen" ${STATE.provider==='zen'?'selected':''}>Zen (Free)</option>
                        <option value="go" ${STATE.provider==='go'?'selected':''}>Go ($10/m)</option>
                        <option value="ollama" ${STATE.provider==='ollama'?'selected':''}>Ollama</option>
                    </select>
                </div>
                <div class="settings-field"><div class="settings-label">System Prompt</div>
                    <textarea class="settings-input" id="systemPrompt" rows="4" placeholder="Jesteś pomocnym asystentem AI...">${sysPrompt.replace(/</g,'&lt;')}</textarea>
                </div>
                <div class="settings-field">
                    <button onclick="Settings.saveSystemPrompt()" style="background:var(--accent);color:#0d0d0d;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;">Save System Prompt</button>
                </div>`;
        } else if (tab === 'providers') {
            body.innerHTML = `
                <div class="settings-field"><div class="settings-label">Go API Key</div>
                    <input class="settings-input" type="password" id="goApiKey" placeholder="sk-go-..." value="${localStorage.getItem('mae-go-key')||''}">
                </div>
                <div class="settings-field"><div class="settings-label">Ollama URL</div>
                    <input class="settings-input" id="ollamaUrl" placeholder="http://localhost:11434" value="${localStorage.getItem('mae-ollama-url')||'http://localhost:11434'}">
                </div>
                <div class="settings-field">
                    <button onclick="const k=$('#goApiKey').value;const u=$('#ollamaUrl').value;localStorage.setItem('mae-go-key',k);localStorage.setItem('mae-ollama-url',u);Modal.alert('Settings saved!','Saved')" style="background:var(--accent);color:#0d0d0d;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;">Save</button>
                </div>`;
        } else if (tab === 'github') {
            body.innerHTML = `
                <div class="settings-field"><div class="settings-label">GitHub Personal Access Token</div>
                    <input class="settings-input" type="password" id="githubToken" placeholder="ghp_..." value="${localStorage.getItem('mae-github-token')||''}">
                </div>
                <div class="settings-field"><div class="settings-label">Token scopes needed: repo, workflow</div>
                    <a href="https://github.com/settings/tokens" target="_blank" style="color:var(--accent);font-size:11px;">Create token →</a>
                </div>
                <div class="settings-field" style="display:flex;gap:8px;">
                    <button onclick="M.Settings.saveGithubToken()" style="background:var(--accent);color:#0d0d0d;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;">Save Token</button>
                    <button onclick="M.Settings.testGithub()" style="background:var(--bg-raised);border:1px solid var(--border);color:var(--text);padding:8px 16px;border-radius:4px;cursor:pointer;font-size:12px;">Test Connection</button>
                </div>
                <div id="githubStatus" style="margin-top:8px;font-size:12px;"></div>`;
        } else if (tab === 'editor') {
            body.innerHTML = `
                <div class="settings-field"><div class="settings-label">Show Minimap</div>
                    <input type="checkbox" checked> Enable minimap
                </div>
                <div class="settings-field"><div class="settings-label">Word Wrap</div>
                    <input type="checkbox"> Enable word wrap
                </div>
                <div class="settings-field"><div class="settings-label">Line Numbers</div>
                    <input type="checkbox" checked> Show line numbers
                </div>`;
        }
    },

    setFont(name) {
        document.documentElement.style.setProperty('--editor-font',`'${name}'`);
        $('#fontLabel').textContent = name;
        localStorage.setItem('mae-font', name);
    },

    setTheme(t) { localStorage.setItem('mae-theme', t); },
    save(key, val) { localStorage.setItem(`mae-${key}`, val); },
    saveGithubToken() {
        const v = $('#githubToken')?.value || '';
        localStorage.setItem('mae-github-token', v);
        M.Output.log('GitHub token saved', 'ok');
    },
    async testGithub() {
        const status = $('#githubStatus');
        if (!status) return;
        status.innerHTML = '<span style="color:var(--accent-yellow);">Testing...</span>';
        try {
            const token = $('#githubToken')?.value || localStorage.getItem('mae-github-token') || '';
            const resp = await fetch('/api/github/verify', { headers: { 'X-GitHub-Token': token } });
            const data = await resp.json();
            if (data.valid) {
                status.innerHTML = `<span style="color:var(--accent-green);">Connected as <strong>${data.user}</strong></span>`;
            } else {
                status.innerHTML = `<span style="color:var(--accent-red);">Failed: ${data.error}</span>`;
            }
        } catch (e) {
            status.innerHTML = `<span style="color:var(--accent-red);">Error: ${e.message}</span>`;
        }
    },
    saveSystemPrompt() {
        const v = $('#systemPrompt')?.value || '';
        localStorage.setItem('mae-system-prompt', v);
        const badge = $('#sysPromptBadge');
        if (v) {
            badge.style.display = 'inline-block';
            badge.title = v;
        } else {
            badge.style.display = 'none';
        }
        M.Output.log(v ? `System prompt saved (${v.length} chars)` : 'System prompt cleared', 'ok');
    },
    loadSystemPrompt() {
        const saved = localStorage.getItem('mae-system-prompt') || '';
        const el = $('#systemPrompt');
        if (el) el.value = saved;
    },
};

// =============================================
//  SUBAGENT: UI
// =============================================
const UI = {
    showSidebar(view) {
        $$('.ab-icon').forEach(i => i.classList.remove('active'));
        STATE.sidebarView = view;

        const title = $('#sidebarTitle');
        const body = $('#sidebarBody');
        const actions = $('#sidebarActions');

        const map = {
            explorer: {
                title: 'Explorer',
                icon: $('#abExplorer'),
                actions: '<button class="sidebar-btn" onclick="M.Explorer.newFile()"><span class="codicon codicon-new-file"></span></button><button class="sidebar-btn" onclick="M.Explorer.newFolder()"><span class="codicon codicon-new-folder"></span></button><button class="sidebar-btn" onclick="M.Explorer.refresh()"><span class="codicon codicon-refresh"></span></button>',
                placeholder: 'Search files...',
                render() { body.innerHTML = '<div class="file-tree" id="fileTree"><div style="padding:20px;text-align:center;color:var(--text-muted);"><span class="codicon codicon-loading" style="animation:spin 1s infinite;"></span> Loading...</div></div>'; Explorer.refresh(); },
            },
            search: {
                title: 'Search',
                icon: $('#abSearch'),
                actions: '',
                placeholder: 'Search across files...',
                render() { body.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);"><span class="codicon codicon-search" style="font-size:32px;display:block;margin-bottom:12px;"></span>Wpisz fraz\u0119 w pole wyszukiwania</div>`; },
            },
            git: {
                title: 'Source Control',
                icon: $('#abGit'),
                actions: '<button class="sidebar-btn" onclick="M.Git.refresh()"><span class="codicon codicon-refresh"></span></button>',
                placeholder: 'Search commits...',
                render() { Git.render(); },
            },
            debug: {
                title: 'Run & Debug',
                icon: $('#abDebug'),
                actions: '<button class="sidebar-btn" onclick="M.Execute.run()"><span class="codicon codicon-play"></span></button><button class="sidebar-btn"><span class="codicon codicon-settings-gear"></span></button>',
                placeholder: '',
                render() { body.innerHTML = `<div style="padding:16px;"><div style="color:var(--text-dim);font-size:12px;margin-bottom:8px;">RUN</div><button onclick="M.Execute.run()" style="background:var(--accent);color:#0d0d0d;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;width:100%;margin-bottom:12px;"><span class="codicon codicon-play"></span> Run Code</button><div style="color:var(--text-muted);font-size:11px;">Ctrl+Enter lub kliknij Run</div><hr style="border-color:var(--border);margin:16px 0;"><div style="color:var(--text-dim);font-size:12px;margin-bottom:8px;">BREAKPOINTS</div><div style="color:var(--text-muted);font-size:11px;">No breakpoints set</div></div>`; },
            },
            extensions: {
                title: 'Extensions',
                icon: $('#abExt'),
                actions: '<button class="sidebar-btn" onclick="M.Extensions.refresh()"><span class="codicon codicon-refresh"></span></button>',
                placeholder: 'Search extensions...',
                render() { Extensions.refresh(); },
            },
            skills: {
                title: 'Skills',
                icon: $('#abSkills'),
                actions: '<button class="sidebar-btn" onclick="M.Skills.refresh()"><span class="codicon codicon-refresh"></span></button>',
                placeholder: 'Search skills...',
                render() { Skills.refresh(); },
            },
            accounts: {
                title: 'Accounts',
                icon: $('#abAccount'),
                actions: '',
                placeholder: '',
                render() { body.innerHTML = `<div style="padding:16px;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;"><div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#e8956a);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#0d0d0d;">M</div><div><div style="color:var(--text);font-size:13px;font-weight:500;">MAE User</div><div style="color:var(--text-dim);font-size:11px;">mae@localhost</div></div></div><div style="border-top:1px solid var(--border);padding-top:12px;"><div style="color:var(--text-dim);font-size:12px;margin-bottom:12px;">PROVIDERS</div><div style="display:flex;align-items:center;gap:8px;padding:6px;margin-bottom:4px;color:var(--text);font-size:12px;"><span class="codicon codicon-check" style="color:var(--accent-green);"></span> Zen API - Connected</div><div style="display:flex;align-items:center;gap:8px;padding:6px;margin-bottom:4px;color:var(--text-dim);font-size:12px;"><span class="codicon codicon-circle-slash" style="color:var(--text-muted);"></span> Go API - Not configured</div><div style="display:flex;align-items:center;gap:8px;padding:6px;margin-bottom:4px;color:var(--text-dim);font-size:12px;"><span class="codicon codicon-circle-slash" style="color:var(--text-muted);"></span> Ollama - Local</div></div></div>`; },
            },
        };

        const info = map[view];
        if (!info) return;

        if (info.icon) info.icon.classList.add('active');
        title.textContent = info.title;
        actions.innerHTML = info.actions || '';
        const searchInput = $('#sidebarSearch');
        if (searchInput) {
            searchInput.placeholder = info.placeholder || 'Search...';
            searchInput.value = '';
        }
        info.render();
    },

    togglePanel(panel) {
        if (panel === 'chat') {
            const p = $('#chatPanel');
            p.classList.toggle('hidden');
            if (!p.classList.contains('hidden')) Chat.checkHealth();
        }
    },

    hideChat() {
        $('#chatPanel').classList.add('hidden');
    },

    showSettings() {
        $('#settingsModal').classList.add('show');
        Settings.showTab('general');
    },

    hideSettings() {
        $('#settingsModal').classList.remove('show');
    },

    toggleFontDD() {
        const dd = $('#fontDD');
        if (!dd.children.length) this.buildFontDD();
        dd.classList.toggle('show');
    },

    buildFontDD() {
        const dd = $('#fontDD');
        const saved = localStorage.getItem('mae-font') || 'Comic Sans MS';
        let h = '<div class="font-lbl">Editor Font</div>';
        FONTS.forEach(f => {
            const active = f === saved;
            h += `<div class="font-opt${active?' active':''}" onclick="Settings.setFont('${f}');$('#fontDD').classList.remove('show')">
                <span class="chk codicon codicon-check${active?'':' hid'}"></span><span>${f}</span>
                <span class="prev" style="font-family:'${f}';">Aa</span>
            </div>`;
        });
        dd.innerHTML = h;
    },
};

// =============================================
//  SUBAGENT: Git
// =============================================
const Git = {
    render() {
        const body = $('#sidebarBody');
        const token = localStorage.getItem('mae-github-token');
        let h = '<div style="padding:12px;">';
        if (token) {
            h += `<div style="color:var(--accent-green);font-size:11px;margin-bottom:8px;"><span class="codicon codicon-check"></span> GitHub connected</div>`;
        }
        h += `<div style="color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">SOURCE CONTROL</div>
        <div style="color:var(--text-muted);font-size:11px;margin-bottom:10px;">Ready to publish workspace</div>
        <div style="display:flex;flex-direction:column;gap:5px;">
            <button onclick="M.Git.initAndPush()" style="background:var(--accent);color:#0d0d0d;border:none;padding:7px 12px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:600;text-align:left;"><span class="fa-brands fa-github" style="margin-right:6px;"></span> Publish to GitHub (Full Flow)</button>
            <button onclick="M.Git.pushChanges()" style="background:var(--bg-raised);border:1px solid var(--border);color:var(--text);padding:6px 12px;border-radius:4px;cursor:pointer;font-size:11px;text-align:left;"><span class="codicon codicon-cloud-upload"></span> Push Current Files</button>
            <button onclick="M.Git.createRepo()" style="background:var(--bg-raised);border:1px solid var(--border);color:var(--text);padding:6px 12px;border-radius:4px;cursor:pointer;font-size:11px;text-align:left;"><span class="codicon codicon-repo-create"></span> New Empty Repo</button>
        </div>
        <div style="margin-top:10px;">
            <button onclick="M.Git.initLocal()" style="background:none;border:1px solid var(--border);color:var(--text-dim);padding:5px 10px;border-radius:3px;cursor:pointer;font-size:10px;width:100%;text-align:left;"><span class="codicon codicon-git-commit"></span> git init (local only)</button>
        </div></div>`;
        body.innerHTML = h;
    },

    refresh() { this.render(); },

    initLocal() {
        M.Output.log('Initializing git...', 'info');
        Terminal.execute('cd workspace && git init');
        setTimeout(() => Terminal.execute('cd workspace && git add .'), 1000);
        setTimeout(() => Terminal.execute('cd workspace && git commit -m "Initial commit from MAE"'), 2000);
        setTimeout(() => Terminal.execute('cd workspace && git branch -M main'), 3000);
    },

    async initAndPush() {
        const token = localStorage.getItem('mae-github-token');
        if (!token) { Modal.alert('Configure GitHub token in Settings first', 'GitHub'); return; }
        Modal.prompt('Repository name:', 'mae-project', async (repoName) => {

        const verifyResp = await fetch('/api/github/verify', { headers: { 'X-GitHub-Token': token } });
        const verifyData = await verifyResp.json();
        if (!verifyData.valid) { M.Output.log('Token invalid: ' + verifyData.error, 'err'); return; }
        const user = verifyData.user;

        M.Output.log('Step 1/4: Creating repo on GitHub...', 'info');
        let repoUrl = '';
        try {
            const createResp = await fetch('/api/github/create-repo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-GitHub-Token': token },
                body: JSON.stringify({ name: repoName, description: 'Created with MAE', private: false }),
            });
            const cd = await createResp.json();
            if (!cd.success) { M.Output.log('Failed: ' + (cd.error||cd.detail), 'err'); return; }
            repoUrl = cd.url;
            M.Output.log('Repo created: ' + repoUrl, 'ok');
        } catch (e) { M.Output.log('Create failed: ' + e.message, 'err'); return; }

        M.Output.log('Step 2/4: git init & commit...', 'info');
        await Terminal.execute('cd workspace && git init');
        await Terminal.execute('cd workspace && git add .');
        await Terminal.execute('cd workspace && git commit -m "First Commit from MAE"');
        await Terminal.execute('cd workspace && git branch -M main');

        M.Output.log('Step 3/4: Add remote...', 'info');
        await Terminal.execute(`cd workspace && git remote add origin https://github.com/${user}/${repoName}.git`);

        M.Output.log('Step 4/4: Push to GitHub...', 'info');
        try {
            const treeResp = await fetch('/api/files/tree');
            const tree = await treeResp.json();
            const files = [];
            for (const item of tree) {
                if (item.type === 'file' && !item.path.startsWith('.git')) {
                    const readResp = await fetch('/api/files/read?path=' + encodeURIComponent(item.path));
                    const data = await readResp.json();
                    if (data.content) files.push({ path: item.path, content: data.content });
                }
            }
            const pushResp = await fetch('/api/github/push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-GitHub-Token': token },
                body: JSON.stringify({ repo: repoName, files, message: 'First Commit from MAE', branch: 'main' }),
            });
            const pd = await pushResp.json();
            if (pd.success) {
                M.Output.log(`Pushed ${pd.files} files to ${pd.repo}`, 'ok');
                M.Output.log('DONE! ' + repoUrl, 'ok');
            } else {
                M.Output.log('Push via API failed: ' + (pd.error||pd.detail), 'err');
                M.Output.log('Try manually: cd workspace && git push -u origin main', 'warn');
            }
        } catch (e) { M.Output.log('Push error: ' + e.message, 'err'); }
        }, 'Publish to GitHub', 'Publish');
    },

    async createRepo() {
        const token = localStorage.getItem('mae-github-token');
        if (!token) { Modal.alert('Configure GitHub token in Settings first', 'GitHub'); return; }
        Modal.prompt('Repository name:', 'mae-project', async (name) => {
            try {
                const resp = await fetch('/api/github/create-repo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-GitHub-Token': token },
                    body: JSON.stringify({ name, description: 'Created with MAE', private: false }),
                });
                const data = await resp.json();
                if (data.success) M.Output.log('Repo: ' + data.url, 'ok');
                else M.Output.log('Failed: ' + (data.error || data.detail), 'err');
            } catch (e) { M.Output.log('Error: ' + e.message, 'err'); }
        }, 'New Repository', 'Create');
    },

    async pushChanges() {
        const token = localStorage.getItem('mae-github-token');
        if (!token) { Modal.alert('Configure GitHub token in Settings first', 'GitHub'); return; }
        Modal.multiPrompt('Push to GitHub', [
            { label: 'Repository name', value: '', placeholder: 'e.g. my-project' },
            { label: 'Commit message', value: 'Update from MAE', placeholder: 'Commit message' },
        ], async (vals) => {
            const repo = vals[0], commitMsg = vals[1];
            M.Output.log('Pushing to ' + repo + '...', 'cmd');
            try {
                const treeResp = await fetch('/api/files/tree');
                const tree = await treeResp.json();
                const files = [];
                for (const item of tree) {
                    if (item.type === 'file') {
                        const readResp = await fetch('/api/files/read?path=' + encodeURIComponent(item.path));
                        const data = await readResp.json();
                        if (data.content) files.push({ path: item.path, content: data.content });
                    }
                }
                const resp = await fetch('/api/github/push', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-GitHub-Token': token },
                    body: JSON.stringify({ repo, files, message: commitMsg || 'Update from MAE', branch: 'main' }),
                });
                const data = await resp.json();
                if (data.success) M.Output.log(`Pushed ${data.files} files to ${data.repo}`, 'ok');
                else M.Output.log('Failed: ' + (data.error || data.detail), 'err');
            } catch (e) { M.Output.log('Error: ' + e.message, 'err'); }
        }, 'Push');
    },
};

// =============================================
//  SUBAGENT: Extensions
// =============================================
const Extensions = {
    extensions: [],

    _modal(title, bodyHTML, onConfirm, confirmText) {
        let overlay = $('#extModal');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'extModal';
            overlay.className = 'modal-overlay show';
            overlay.style.zIndex = '1001';
            document.body.appendChild(overlay);
        }
        overlay.innerHTML = `
            <div class="modal-box" style="width:420px;">
                <div class="modal-head">
                    <span>${escapeHTML(title)}</span>
                    <button class="chat-header-btn" onclick="M.Extensions._closeModal()"><span class="codicon codicon-close"></span></button>
                </div>
                <div style="padding:16px;">${bodyHTML}</div>
                <div style="display:flex;justify-content:flex-end;gap:8px;padding:0 16px 16px;">
                    <button onclick="M.Extensions._closeModal()" style="background:var(--bg-raised);border:1px solid var(--border);color:var(--text);padding:6px 16px;border-radius:4px;cursor:pointer;font-size:12px;">Cancel</button>
                    <button id="extModalConfirm" style="background:var(--accent);color:#0d0d0d;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;">${confirmText || 'OK'}</button>
                </div>
            </div>`;
        overlay.onclick = (e) => { if (e.target === overlay) this._closeModal(); };
        const btn = $('#extModalConfirm');
        if (btn && onConfirm) btn.onclick = () => { onConfirm(); this._closeModal(); };
    },

    _closeModal() {
        const m = $('#extModal');
        if (m) m.remove();
    },

    _inputModal(title, label, defaultVal, onConfirm, confirmText) {
        this._modal(title,
            `<div style="margin-bottom:4px;font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">${escapeHTML(label)}</div>
             <input id="extModalInput" class="settings-input" value="${escapeHTML(defaultVal || '')}" autofocus />`,
            () => { const v = $('#extModalInput')?.value?.trim(); if (v) onConfirm(v); },
            confirmText || 'OK'
        );
        setTimeout(() => { const inp = $('#extModalInput'); if (inp) { inp.focus(); inp.select(); inp.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); $('#extModalConfirm')?.click(); } }; } }, 50);
    },

    _multiInputModal(title, fields, onConfirm, confirmText) {
        const fieldsHTML = fields.map((f, i) =>
            `<div style="margin-bottom:10px;">
                <div style="margin-bottom:4px;font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">${escapeHTML(f.label)}</div>
                <input id="extField${i}" class="settings-input" value="${escapeHTML(f.value || '')}" placeholder="${escapeHTML(f.placeholder || '')}" />
            </div>`
        ).join('');
        this._modal(title, fieldsHTML,
            () => {
                const vals = fields.map((f, i) => $('#extField' + i)?.value?.trim() || '');
                if (vals.every(v => v)) onConfirm(vals);
            },
            confirmText || 'Install'
        );
        setTimeout(() => { const inp = $('#extField0'); if (inp) { inp.focus(); inp.select(); } }, 50);
    },

    _textAreaModal(title, label, defaultVal, onConfirm, confirmText) {
        this._modal(title,
            `<div style="margin-bottom:4px;font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">${escapeHTML(label)}</div>
             <textarea id="extModalTextarea" class="settings-input" rows="8" style="font-family:JetBrains Mono,Consolas,monospace;font-size:11px;resize:vertical;">${escapeHTML(defaultVal || '')}</textarea>`,
            () => { const v = $('#extModalTextarea')?.value?.trim(); if (v) onConfirm(v); },
            confirmText || 'Install'
        );
        setTimeout(() => { const ta = $('#extModalTextarea'); if (ta) { ta.focus(); ta.select(); } }, 50);
    },

    async refresh() {
        const body = document.getElementById('sidebarBody');
        if (body) body.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);">Loading extensions...</div>';
        try {
            const resp = await fetch('/api/extensions/list');
            if (resp.ok) {
                this.extensions = await resp.json();
            }
        } catch (e) { this.extensions = []; }
        this.render();
    },

    render() {
        const body = $('#sidebarBody');
        if (!body) return;
        let h = '<div style="padding:10px;">';
        h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">';
        h += '<div style="color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;">MARKETPLACE</div>';
        h += '<button onclick="M.UI.showSidebar(\'skills\')" style="background:var(--bg-raised);border:1px solid var(--border);color:var(--text);padding:3px 8px;border-radius:3px;cursor:pointer;font-size:9px;">Manage</button>';
        h += '</div>';

        const available = [
            { name: 'Python Support', desc: 'Syntax, linting, execution', icon: 'fa-brands fa-python', color: '#3572A5', id: 'python', caps: ['syntax','lint','execute','format'] },
            { name: 'JavaScript & Web', desc: 'JS/TS, HTML, CSS support', icon: 'fa-brands fa-js', color: '#F7DF1E', id: 'javascript', caps: ['syntax','lint','format','debug'] },
            { name: 'OpenCode OC-2 Dark', desc: 'Dark theme based on OC-2', icon: 'fa-solid fa-palette', color: '#fab283', id: 'theme-oc2', caps: ['theme'] },
            { name: 'Code Formatter', desc: 'Auto-format code on save', icon: 'fa-solid fa-indent', color: '#00ceb9', id: 'formatter', caps: ['format'] },
            { name: 'Icon Pack', desc: 'Custom file type icons', icon: 'fa-solid fa-icons', color: '#fcd53a', id: 'icon-pack-example', caps: ['icons'] },
            { name: 'Docker Support', desc: 'Dockerfile, docker-compose', icon: 'fa-brands fa-docker', color: '#2496ED', id: 'docker', caps: ['syntax','lint'] },
            { name: 'GitLens', desc: 'Git blame, history, lenses', icon: 'fa-solid fa-code-branch', color: '#F05032', id: 'gitlens', caps: ['git'] },
            { name: 'Debugger', desc: 'Breakpoints, step-through', icon: 'fa-solid fa-bug', color: '#EA4AAA', id: 'debugger', caps: ['debug'] },
            { name: 'Markdown Preview', desc: 'Live markdown rendering', icon: 'fa-brands fa-markdown', color: '#519aba', id: 'markdown', caps: ['preview'] },
            { name: 'JSON Support', desc: 'JSON validation & formatting', icon: 'fa-solid fa-code', color: '#f5f5f5', id: 'json', caps: ['syntax','lint'] },
            { name: 'Terminal themes', desc: 'Custom terminal colors', icon: 'fa-solid fa-terminal', color: '#4EC9B0', id: 'terminal-themes', caps: ['theme'] },
            { name: 'Error Lens', desc: 'Inline error decorations', icon: 'fa-solid fa-circle-exclamation', color: '#F14C4C', id: 'error-lens', caps: ['diagnostic'] },
        ];

        const installedNames = this.extensions.map(e => e.name);
        const notInstalled = available.filter(a => !installedNames.includes(a.id));

        if (notInstalled.length > 0) {
            notInstalled.forEach(ext => {
                const caps = ext.caps.map(c => `<span style="background:var(--bg-hover);color:var(--text-dim);padding:1px 5px;border-radius:2px;font-size:8px;">${c}</span>`).join(' ');
                h += `<div style="padding:8px;background:var(--bg-raised);border-radius:5px;margin-bottom:4px;border-left:2px solid ${ext.color};">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span class="${ext.icon}" style="color:${ext.color};font-size:14px;width:18px;text-align:center;"></span>
                        <div style="flex:1;min-width:0;">
                            <div style="color:var(--text);font-size:11px;font-weight:500;">${escapeHTML(ext.name)}</div>
                            <div style="color:var(--text-muted);font-size:9px;">${escapeHTML(ext.desc)}</div>
                        </div>
                        <div onclick="M.Extensions.quickInstall('${ext.id}','${escapeHTML(ext.name)}','${ext.icon}','${ext.color}',${JSON.stringify(ext.caps)})" style="background:var(--accent);color:#0d0d0d;border:none;padding:3px 10px;border-radius:3px;cursor:pointer;font-size:9px;font-weight:600;flex-shrink:0;">Install</div>
                    </div>
                    <div style="display:flex;gap:3px;margin-top:4px;">${caps}</div>
                </div>`;
            });
        } else {
            h += '<div style="color:var(--text-muted);font-size:11px;text-align:center;padding:16px;">All extensions installed</div>';
        }

        h += '<div style="color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin:16px 0 8px;">SKILLS</div>';
        const skillTemplates = [
            { name: 'Python Expert', desc: 'Advanced Python coding assistant', icon: 'fa-brands fa-python', color: '#3572A5', prompt: 'You are a Python expert. Write clean, efficient Python code with type hints and docstrings.' },
            { name: 'Code Reviewer', desc: 'Reviews code for bugs & improvements', icon: 'fa-solid fa-magnifying-glass', color: '#EA4AAA', prompt: 'You are a code reviewer. Analyze code for bugs, security issues, and suggest improvements.' },
            { name: 'Test Writer', desc: 'Generates unit tests automatically', icon: 'fa-solid fa-vial', color: '#4EC9B0', prompt: 'You are a test engineer. Write comprehensive unit tests using pytest or unittest.' },
            { name: 'Debugger', desc: 'Finds and fixes bugs in code', icon: 'fa-solid fa-bug', color: '#F14C4C', prompt: 'You are a debugger. Find bugs, explain root causes, and provide fixes.' },
            { name: 'Refactorer', desc: 'Improves code structure & readability', icon: 'fa-solid fa-wand-magic-sparkles', color: '#C586C0', prompt: 'You are a refactoring expert. Improve code structure, readability, and maintainability.' },
            { name: 'Doc Writer', desc: 'Generates documentation & READMEs', icon: 'fa-solid fa-book', color: '#519aba', prompt: 'You are a technical writer. Generate clear documentation, README files, and code comments.' },
        ];
        skillTemplates.forEach(s => {
            h += `<div onclick="M.Extensions.installSkill('${s.name}','${s.desc}','${s.icon}','${s.color}','${s.prompt.replace(/'/g, "\\'")}')" style="padding:8px;background:var(--bg-raised);border-radius:5px;margin-bottom:4px;border-left:2px solid ${s.color};cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background='var(--bg-raised)'">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span class="${s.icon}" style="color:${s.color};font-size:14px;width:18px;text-align:center;"></span>
                    <div style="flex:1;min-width:0;">
                        <div style="color:var(--text);font-size:11px;font-weight:500;">${escapeHTML(s.name)}</div>
                        <div style="color:var(--text-muted);font-size:9px;">${escapeHTML(s.desc)}</div>
                    </div>
                    <div style="background:var(--accent);color:#0d0d0d;border:none;padding:3px 10px;border-radius:3px;font-size:9px;font-weight:600;flex-shrink:0;">Install</div>
                </div>
            </div>`;
        });

        h += '<div style="color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin:16px 0 8px;">CUSTOM</div>';
        h += `<div onclick="M.Extensions.installTemplate('icon-pack')" style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:var(--bg-raised);border-radius:4px;margin-bottom:3px;cursor:pointer;font-size:10px;">
            <span class="fa-solid fa-icons" style="color:#fcd53a;"></span> Custom Icon Pack <span style="color:var(--text-muted);margin-left:auto;">Template</span>
        </div>`;
        h += `<div onclick="M.Extensions.installTemplate('theme')" style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:var(--bg-raised);border-radius:4px;margin-bottom:3px;cursor:pointer;font-size:10px;">
            <span class="fa-solid fa-palette" style="color:#fab283;"></span> Custom Theme <span style="color:var(--text-muted);margin-left:auto;">Template</span>
        </div>`;
        h += `<div onclick="M.Extensions.installTemplate('formatter')" style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:var(--bg-raised);border-radius:4px;margin-bottom:3px;cursor:pointer;font-size:10px;">
            <span class="fa-solid fa-indent" style="color:#00ceb9;"></span> Code Formatter <span style="color:var(--text-muted);margin-left:auto;">Template</span>
        </div>`;
        h += `<div onclick="M.Extensions.showInstall()" style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:var(--bg-raised);border-radius:4px;margin-bottom:3px;cursor:pointer;font-size:10px;">
            <span class="fa-solid fa-code" style="color:var(--accent);"></span> Install from JSON <span style="color:var(--text-muted);margin-left:auto;">Manual</span>
        </div>`;
        h += '</div>';
        body.innerHTML = h;
    },

    quickInstall(id, displayName, icon, color, caps) {
        this._installExt({
            name: id, displayName: displayName, author: 'MAE',
            version: '1.0.0', icon: icon || 'fa-solid fa-puzzle-piece', color: color || '#fab283',
            capabilities: caps || [], activated: true,
        });
    },

    installTemplate(type) {
        const templates = {
            'icon-pack': {
                name: 'my-icon-pack', displayName: 'My Icon Pack', version: '1.0.0',
                description: 'Custom file icon pack',
                icon: 'fa-solid fa-icons', color: '#fcd53a',
                capabilities: ['icons'], activated: true,
                entryPoint: 'icons/mapping.json',
            },
            'theme': {
                name: 'my-theme', displayName: 'My Theme', version: '1.0.0',
                description: 'Custom color theme',
                icon: 'fa-solid fa-palette', color: '#fab283',
                capabilities: ['theme'], activated: true,
                entryPoint: 'theme/colors.json',
            },
            'formatter': {
                name: 'my-formatter', displayName: 'My Formatter', version: '1.0.0',
                description: 'Code formatting extension',
                icon: 'fa-solid fa-indent', color: '#00ceb9',
                capabilities: ['format'], activated: true,
                executeCommand: 'python format.py',
            },
        };
        const template = templates[type];
        if (template) this._installExt(template);
    },

    showInstall() {
        const json = '{"name":"my-extension","displayName":"My Extension","version":"1.0.0","description":"","author":"me","icon":"fa-solid fa-puzzle-piece","color":"#fab283","capabilities":[],"activated":true}';
        try {
            const data = JSON.parse(json);
            this._installExt(data);
        } catch (e) {
            Modal.alert('Invalid JSON: ' + e.message, 'Error');
        }
    },

    async _installExt(data) {
        try {
            const resp = await fetch('/api/extensions/install', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (resp.ok) {
                this.refresh();
                M.Output.log(`Installed: ${data.name}`, 'ok');
            } else {
                const err = await resp.json();
                M.Output.log('Install failed: ' + (err.detail || 'Unknown'), 'err');
            }
        } catch (e) {
            M.Output.log('Error: ' + e.message, 'err');
        }
    },

    async installSkill(name, desc, icon, color, prompt) {
        try {
            const resp = await fetch('/api/skills/install', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.toLowerCase().replace(/\s+/g, '-'),
                    displayName: name,
                    description: desc,
                    icon: icon,
                    color: color,
                    prompt: prompt,
                    version: '1.0.0',
                    author: 'MAE',
                    activated: true,
                }),
            });
            if (resp.ok) {
                M.Output.log(`Installed skill: ${name}`, 'ok');
            } else {
                const err = await resp.json();
                M.Output.log('Install failed: ' + (err.detail || 'Unknown'), 'err');
            }
        } catch (e) {
            M.Output.log('Error: ' + e.message, 'err');
        }
    },

    search(query) {
        M.Output.log(`Searching: "${query}"`, 'info');
    },
};

// =============================================
//  SUBAGENT: Skills (Installed Management)
// =============================================
const Skills = {
    skills: [],

    async refresh() {
        const body = document.getElementById('sidebarBody');
        if (body) body.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);">Loading skills...</div>';
        try {
            const resp = await fetch('/api/skills/list');
            if (resp.ok) {
                this.skills = await resp.json();
            }
        } catch (e) { this.skills = []; }
        this.render();
    },

    render() {
        const body = $('#sidebarBody');
        if (!body) return;
        let h = '<div style="padding:10px;">';
        h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">';
        h += '<div style="color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;">INSTALLED (' + this.skills.length + ')</div>';
        h += '<button onclick="M.UI.showSidebar(\'extensions\')" style="background:var(--accent);color:#0d0d0d;border:none;padding:3px 8px;border-radius:3px;cursor:pointer;font-size:9px;font-weight:600;">+ Add</button>';
        h += '</div>';

        if (this.skills.length === 0) {
            h += '<div style="color:var(--text-muted);font-size:11px;text-align:center;padding:16px;">No skills installed<br><span style="font-size:10px;">Install from Extensions marketplace</span></div>';
        } else {
            this.skills.forEach(skill => {
                const icon = skill.icon || 'fa-solid fa-wand-magic-sparkles';
                const color = skill.color || '#fab283';
                const active = skill.activated !== false;
                const caps = (skill.capabilities || []).map(c => `<span style="background:var(--bg-hover);color:var(--text-dim);padding:1px 5px;border-radius:2px;font-size:8px;">${c}</span>`).join(' ');
                h += `<div style="padding:8px;background:var(--bg-raised);border-radius:5px;margin-bottom:4px;border-left:2px solid ${color};${active?'':'opacity:0.4'}">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span class="${icon}" style="color:${color};font-size:14px;width:18px;text-align:center;"></span>
                        <div style="flex:1;min-width:0;">
                            <div style="color:var(--text);font-size:11px;font-weight:500;">${escapeHTML(skill.displayName)}</div>
                            <div style="color:var(--text-muted);font-size:9px;">v${escapeHTML(skill.version)} · ${escapeHTML(skill.author||'MAE')}</div>
                        </div>
                        <div onclick="M.Skills.toggleSkill('${skill.name}')" style="width:20px;height:20px;border-radius:3px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:${active?'var(--accent-green)':'var(--text-muted)'};background:var(--bg-hover);font-size:14px;flex-shrink:0;" title="${active?'Active - click to deactivate':'Inactive - click to activate'}">${active?'●':'○'}</div>
                        <div onclick="M.Skills.uninstallSkill('${skill.name}')" style="width:16px;height:16px;border-radius:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:14px;flex-shrink:0;" title="Uninstall">×</div>
                    </div>
                    ${skill.description ? `<div style="color:var(--text-dim);font-size:9px;margin-top:4px;line-height:1.3;">${escapeHTML(skill.description)}</div>` : ''}
                    ${skill.prompt ? `<div style="color:var(--text-dim);font-size:9px;margin-top:3px;padding:3px 6px;background:var(--bg-hover);border-radius:3px;font-style:italic;">${escapeHTML(skill.prompt.substring(0, 80))}${skill.prompt.length > 80 ? '...' : ''}</div>` : ''}
                    ${caps ? `<div style="display:flex;gap:3px;margin-top:4px;flex-wrap:wrap;">${caps}</div>` : ''}
                </div>`;
            });
        }

        h += '</div>';
        body.innerHTML = h;
    },

    async toggleSkill(name) {
        try {
            const resp = await fetch(`/api/skills/get?name=${name}`);
            const skill = await resp.json();
            skill.activated = skill.activated === false;
            await fetch('/api/skills/install', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(skill),
            });
            this.refresh();
        } catch (e) { this.refresh(); }
    },

    uninstallSkill(name) {
        Modal.confirm(`Uninstall skill "${name}"?`, async () => {
            try {
                await fetch(`/api/skills/uninstall?name=${name}`, { method: 'DELETE' });
                this.refresh();
                M.Output.log(`Uninstalled skill: ${name}`, 'ok');
            } catch (e) { M.Output.log('Uninstall failed: ' + e.message, 'err'); }
        }, 'Uninstall Skill', 'Uninstall');
    },
};

// =============================================
//  Quick commands (exposed globally)
// =============================================
const M = {
    Explorer, Tabs, Editor, Chat, Settings, UI, Execute, Output, Git, Extensions, Skills, Terminal,

    fileNew() { Explorer.newFile(); },
    executeRun() { Execute.run(); },

    init() {
        Chat.init();
        Explorer.refresh();
        Tabs.render();
        Editor.show('', '');

        const savedFont = localStorage.getItem('mae-font') || 'Comic Sans MS';
        document.documentElement.style.setProperty('--editor-font', `'${savedFont}'`);
        $('#fontLabel').textContent = savedFont;

        const savedProvider = localStorage.getItem('mae-provider');
        if (savedProvider) {
            $('#chatProvider').value = savedProvider;
            STATE.provider = savedProvider;
        }

        document.addEventListener('click', e => {
            const w = $('#fontWrap');
            if (w && !w.contains(e.target)) $('#fontDD').classList.remove('show');
        });

        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key === 's') { e.preventDefault(); Editor.save(); }
            if (e.ctrlKey && e.key === 'p') { e.preventDefault(); Explorer.newFile(); }
        });

        document.addEventListener('click', e => {
            const row = e.target.closest('.tree-item');
            if (!row) return;
            if (row.classList.contains('tree-folder')) {
                Explorer.toggleFolder(row.dataset.path);
            } else if (row.classList.contains('tree-file')) {
                Explorer.openFile(row.dataset.path, row.dataset.name);
            }
        });

        const editorCode = $('#editorCode');
        if (editorCode) {
            editorCode.addEventListener('input', () => Editor.updateGutter());
            editorCode.addEventListener('scroll', () => {
                const gutter = $('#editorGutter');
                if (gutter) gutter.scrollTop = editorCode.scrollTop;
            });
        }

        setTimeout(() => Terminal.showTab('terminal'), 100);
        setTimeout(() => $('#terminalInput')?.focus(), 200);
    },
};

window.M = M;
document.addEventListener('DOMContentLoaded', () => M.init());
