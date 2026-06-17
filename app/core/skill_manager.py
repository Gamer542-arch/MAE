import json
import os
from pathlib import Path
from typing import Optional

SKILLS_DIR = Path(__file__).parent.parent.parent / "skills"


class SkillManager:
    def __init__(self):
        SKILLS_DIR.mkdir(exist_ok=True)

    def list_all(self) -> list[dict]:
        skills = []
        if not SKILLS_DIR.exists():
            return skills
        for folder in sorted(SKILLS_DIR.iterdir()):
            if folder.is_dir():
                manifest = self._read_manifest(folder.name)
                if manifest:
                    skills.append(manifest)
        return skills

    def get(self, name: str) -> Optional[dict]:
        return self._read_manifest(name)

    def install(self, manifest: dict) -> dict:
        name = manifest.get("name", "")
        if not name:
            return {"error": "name is required"}
        folder = SKILLS_DIR / name
        folder.mkdir(parents=True, exist_ok=True)
        manifest_path = folder / "manifest.json"
        manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False))
        return {"installed": name, "path": str(folder)}

    def uninstall(self, name: str) -> dict:
        import shutil
        folder = SKILLS_DIR / name
        if not folder.exists():
            return {"error": f"Skill '{name}' not found"}
        shutil.rmtree(folder)
        return {"uninstalled": name}

    def _read_manifest(self, name: str) -> Optional[dict]:
        path = SKILLS_DIR / name / "manifest.json"
        if not path.exists():
            return None
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            data["_folder"] = name
            data["_path"] = str(SKILLS_DIR / name)
            return data
        except (json.JSONDecodeError, OSError):
            return None

    def validate_manifest(self, manifest: dict) -> dict:
        errors = []
        required = ["name", "displayName", "version"]
        for field in required:
            if not manifest.get(field):
                errors.append(f"Missing required field: {field}")
        if errors:
            return {"valid": False, "errors": errors}
        return {"valid": True}
