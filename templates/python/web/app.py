""" {name} — Flask Web App """

import os
import sqlite3
from datetime import datetime

from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-key-change-me")
DB_PATH = os.path.join(os.path.dirname(__file__), "tasks.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute(
            """CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                done INTEGER DEFAULT 0,
                created TEXT DEFAULT (datetime('now'))
            )"""
        )


init_db()


@app.route("/")
def index():
    with get_db() as conn:
        tasks = conn.execute("SELECT * FROM tasks ORDER BY created DESC").fetchall()
    return render_template("index.html", tasks=tasks)


@app.route("/add", methods=["POST"])
def add():
    title = request.form.get("title", "").strip()
    if not title:
        flash("Title cannot be empty.", "error")
        return redirect(url_for("index"))
    with get_db() as conn:
        conn.execute("INSERT INTO tasks (title) VALUES (?)", (title,))
    flash("Task added!", "success")
    return redirect(url_for("index"))


@app.route("/toggle/<int:task_id>")
def toggle(task_id):
    with get_db() as conn:
        conn.execute("UPDATE tasks SET done = NOT done WHERE id = ?", (task_id,))
    return redirect(url_for("index"))


@app.route("/delete/<int:task_id>")
def delete(task_id):
    with get_db() as conn:
        conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    flash("Task deleted.", "info")
    return redirect(url_for("index"))


@app.errorhandler(404)
def not_found(e):
    return render_template("index.html", error="Page not found"), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
