#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agy-Custom-Design Unified Installer & Lifecycle Manager
Automates ASAR patching, Antigravity MCP server registration, and backups.
Can be executed directly by the Antigravity Agent or from terminal.
"""

import os
import sys
import json
import shutil
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ASAR_PATCHER = BASE_DIR / "patch_asar.py"
UI_SCRIPT = BASE_DIR / "qusaCustomUI.js"
MCP_CONTROLLER = BASE_DIR / "agy_control.py"

HOME_DIR = Path(os.environ.get("USERPROFILE", os.path.expanduser("~")))
LOCALAPPDATA = Path(os.environ.get("LOCALAPPDATA", HOME_DIR / "AppData" / "Local"))
ANTIGRAVITY_APP_DIR = LOCALAPPDATA / "Programs" / "antigravity"
RESOURCES_DIR = ANTIGRAVITY_APP_DIR / "resources"
TARGET_ASAR = RESOURCES_DIR / "app.asar"
BACKUP_ASAR = RESOURCES_DIR / "app.asar.bak"

GEMINI_CONFIG_DIR = HOME_DIR / ".gemini" / "config"
MCP_CONFIG_FILE = GEMINI_CONFIG_DIR / "mcp_config.json"
ANTIGRAVITY_DATA_DIR = HOME_DIR / ".gemini" / "antigravity"
CUSTOM_CONFIG_FILE = ANTIGRAVITY_DATA_DIR / "custom-ui-config.json"


def check_status() -> dict:
    installed = False
    version = "unknown"
    if TARGET_ASAR.exists() and ASAR_PATCHER.exists():
        try:
            res = subprocess.run(
                [sys.executable, str(ASAR_PATCHER), "--check", str(TARGET_ASAR)],
                capture_output=True,
                text=True
            )
            out = res.stdout.strip()
            installed = out.startswith("PATCHED")
            if "version=" in out:
                version = out.split("version=")[-1]
        except Exception:
            pass

    has_backup = BACKUP_ASAR.exists()
    mcp_registered = False
    if MCP_CONFIG_FILE.exists():
        try:
            with open(MCP_CONFIG_FILE, "r", encoding="utf-8") as f:
                cfg = json.load(f)
                mcp_registered = "agy-custom" in cfg.get("mcpServers", {})
        except Exception:
            pass

    return {
        "antigravity_found": TARGET_ASAR.exists(),
        "asar_path": str(TARGET_ASAR),
        "is_patched": installed,
        "has_backup": has_backup,
        "antigravity_version": version,
        "mcp_registered": mcp_registered
    }


def register_mcp_server() -> bool:
    GEMINI_CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    mcp_data = {"mcpServers": {}}
    if MCP_CONFIG_FILE.exists():
        try:
            with open(MCP_CONFIG_FILE, "r", encoding="utf-8") as f:
                mcp_data = json.load(f)
        except Exception:
            mcp_data = {"mcpServers": {}}

    servers = mcp_data.setdefault("mcpServers", {})
    servers["agy-custom"] = {
        "command": sys.executable,
        "args": [str(MCP_CONTROLLER), "mcp"]
    }

    try:
        with open(MCP_CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(mcp_data, f, indent=2)
        print(f"[Installer] Registered agy-custom in {MCP_CONFIG_FILE}")
        return True
    except Exception as e:
        print(f"[Installer] Failed to update {MCP_CONFIG_FILE}: {e}")
        return False


def unregister_mcp_server() -> bool:
    if not MCP_CONFIG_FILE.exists():
        return True
    try:
        with open(MCP_CONFIG_FILE, "r", encoding="utf-8") as f:
            mcp_data = json.load(f)
        if "agy-custom" in mcp_data.get("mcpServers", {}):
            del mcp_data["mcpServers"]["agy-custom"]
            with open(MCP_CONFIG_FILE, "w", encoding="utf-8") as f:
                json.dump(mcp_data, f, indent=2)
            print("[Installer] Unregistered agy-custom from mcp_config.json")
        return True
    except Exception as e:
        print(f"[Installer] Error removing MCP config: {e}")
        return False


def install() -> bool:
    if not TARGET_ASAR.exists():
        print(f"[Installer] Error: Antigravity app.asar not found at {TARGET_ASAR}", file=sys.stderr)
        return False

    # 1. Ensure backup exists
    if not BACKUP_ASAR.exists():
        print(f"[Installer] Creating initial backup: {BACKUP_ASAR}")
        shutil.copy2(TARGET_ASAR, BACKUP_ASAR)
    else:
        print(f"[Installer] Backup already exists at {BACKUP_ASAR}")

    # 2. Patch into temporary file
    temp_patched = TARGET_ASAR.with_suffix(".tmp_patched")
    source_asar = BACKUP_ASAR if BACKUP_ASAR.exists() else TARGET_ASAR

    print(f"[Installer] Patching ASAR using {UI_SCRIPT.name}...")
    cmd = [
        sys.executable,
        str(ASAR_PATCHER),
        "--patch", str(source_asar),
        "--ui", str(UI_SCRIPT),
        "--out", str(temp_patched),
        "--force"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"[Installer] Patching failed: {res.stderr or res.stdout}", file=sys.stderr)
        if temp_patched.exists():
            temp_patched.unlink()
        return False

    # 3. Replace target ASAR
    try:
        if TARGET_ASAR.exists():
            TARGET_ASAR.unlink()
        temp_patched.rename(TARGET_ASAR)
        print("[Installer] Successfully installed custom UI into app.asar!")
    except Exception as e:
        print(f"[Installer] Error moving patched ASAR into place: {e}", file=sys.stderr)
        if BACKUP_ASAR.exists() and not TARGET_ASAR.exists():
            shutil.copy2(BACKUP_ASAR, TARGET_ASAR)
        return False

    # 4. Register MCP Server
    register_mcp_server()

    # 5. Initialize config with Swiss + Gemini 4 Neon defaults
    ANTIGRAVITY_DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not CUSTOM_CONFIG_FILE.exists():
        from agy_control import DEFAULT_CONFIG, PRESETS
        init_cfg = dict(DEFAULT_CONFIG)
        init_cfg.update(PRESETS["swiss"])
        with open(CUSTOM_CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(init_cfg, f, indent=2, ensure_ascii=False)
        print(f"[Installer] Created default config at {CUSTOM_CONFIG_FILE}")

    print("\n[SUCCESS] Antigravity Custom Design installed!")
    print("Restart Antigravity or reopen the app to activate.")
    return True


def restore() -> bool:
    if not BACKUP_ASAR.exists():
        print(f"[Installer] Error: No backup found at {BACKUP_ASAR}", file=sys.stderr)
        return False

    try:
        if TARGET_ASAR.exists():
            TARGET_ASAR.unlink()
        shutil.copy2(BACKUP_ASAR, TARGET_ASAR)
        print("[Installer] Restored original app.asar from backup!")
    except Exception as e:
        print(f"[Installer] Failed to restore backup: {e}", file=sys.stderr)
        return False

    unregister_mcp_server()
    print("[SUCCESS] Antigravity restored to 100% clean original state.")
    return True


def trigger_restart(batch_file: Path):
    ps_script = BASE_DIR / "apply_and_restart.ps1"
    print(f"[Installer] Spawning detached restart via Task Scheduler for {ps_script.name}...")
    task_cmd = f'powershell.exe -NoProfile -ExecutionPolicy Bypass -File "{ps_script}"'
    subprocess.run(["schtasks", "/create", "/tn", "AgyApplyRestart", "/tr", task_cmd, "/sc", "once", "/st", "23:59", "/f"], capture_output=True)
    subprocess.run(["schtasks", "/run", "/tn", "AgyApplyRestart"], capture_output=True)
    subprocess.run(["schtasks", "/delete", "/tn", "AgyApplyRestart", "/f"], capture_output=True)


def main():
    if len(sys.argv) < 2:
        print("Usage: python installer.py [install | restore | status] [--restart]")
        sys.exit(1)

    cmd = sys.argv[1].lower()
    auto_restart = "--restart" in sys.argv

    if cmd == "status":
        print(json.dumps(check_status(), indent=2))
    elif cmd in ("install", "apply"):
        register_mcp_server()
        if auto_restart:
            trigger_restart(BASE_DIR / "apply_and_restart.bat")
            print("[Installer] Restart sequence triggered!")
            sys.exit(0)
        ok = install()
        sys.exit(0 if ok else 1)
    elif cmd in ("restore", "uninstall"):
        if auto_restart:
            trigger_restart(BASE_DIR / "restore_original.bat")
            print("[Installer] Restore & restart sequence triggered!")
            sys.exit(0)
        ok = restore()
        sys.exit(0 if ok else 1)
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)


if __name__ == "__main__":
    main()
