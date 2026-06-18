""" {name} — File Organizer Script """

import argparse
import logging
import shutil
import sys
from pathlib import Path

FILE_CATEGORIES = {
    "Images": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"],
    "Documents": [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".md", ".csv"],
    "Archives": [".zip", ".tar", ".gz", ".bz2", ".7z", ".rar"],
    "Audio": [".mp3", ".wav", ".flac", ".aac", ".ogg"],
    "Video": [".mp4", ".avi", ".mkv", ".mov", ".wmv"],
    "Code": [".py", ".js", ".ts", ".html", ".css", ".json", ".xml", ".yaml", ".yml", ".toml"],
    "Scripts": [".sh", ".bat", ".ps1", ".exe"],
}


def setup_logging(verbose: bool) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )


def get_category(file_ext: str) -> str:
    file_ext = file_ext.lower()
    for category, extensions in FILE_CATEGORIES.items():
        if file_ext in extensions:
            return category
    return "Other"


def organize_directory(target: Path, dry_run: bool = False) -> None:
    if not target.is_dir():
        logging.error("Directory not found: %s", target)
        sys.exit(1)

    items = [p for p in target.iterdir() if p.is_file() and not p.name.startswith(".")]
    if not items:
        logging.info("No files to organize in %s", target)
        return

    for item in items:
        category = get_category(item.suffix)
        dest_dir = target / category
        dest_path = dest_dir / item.name

        if dest_path.exists():
            logging.warning("Skipping %s — already exists in %s", item.name, category)
            continue

        if dry_run:
            logging.info("[DRY-RUN] Would move %s -> %s/", item.name, category)
        else:
            dest_dir.mkdir(parents=True, exist_ok=True)
            shutil.move(str(item), str(dest_path))
            logging.info("Moved %s -> %s/", item.name, category)

    if not dry_run:
        logging.info("Done! Organized %d file(s).", len(items))
    else:
        logging.info("Dry-run complete. %d file(s) would be moved.", len(items))


def main():
    parser = argparse.ArgumentParser(
        description="{name} — Organize files in a directory by type"
    )
    parser.add_argument(
        "directory",
        nargs="?",
        default=".",
        help="Target directory to organize (default: current)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be moved without making changes",
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Enable debug logging",
    )
    args = parser.parse_args()

    setup_logging(args.verbose)
    organize_directory(Path(args.directory).resolve(), dry_run=args.dry_run)


if __name__ == "__main__":
    main()
