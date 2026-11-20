#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agy-Custom-Design Controller & MCP Server
Unified CLI and MCP Server to control Antigravity UI, Wallpapers, Model Names, and Mascot Anty directly from chat.
"""

import os
import sys
import json
import argparse
from pathlib import Path

CONFIG_DIR = Path(os.environ.get("USERPROFILE", os.path.expanduser("~"))) / ".gemini" / "antigravity"
CONFIG_FILE = CONFIG_DIR / "custom-ui-config.json"
WALLPAPER_FILE = CONFIG_DIR / "custom-ui-wallpaper.bin"
WALLPAPER_META = CONFIG_DIR / "custom-ui-wallpaper.meta.json"

DEFAULT_CONFIG = {
    "colorEnabled": True,
    "baseColor": "#121212",
    "separateSidebar": False,
    "sidebarColor": "#181818",
    "panelContrast": 1.0,
    "wallpaperUrl": "",
    "wallpaperLocalName": "",
    "wallpaperDim": 0.42,
    "wallpaperBlur": 0,
    "panelAlpha": 0.68,
    "ruEnabled": False,
    "customAccountName": "",
    "modelRenames": {
        "Gemini 3.8 Flash (Medium)": "Gemini 4 Neon (Overclocked)",
        "Gemini 3.8 Flash": "Gemini 4 Neon"
    },
    "fabHidden": False,
    "fabHotkey": "Alt+KeyS",
    "fabLeft": None,
    "fabTop": None,
    "antyEnabled": True,
    "antyRoam": True,
    "antySize": 58,
    "mascotMessage": ""
}

PRESETS = {
    "swiss": {
        "colorEnabled": True,
        "baseColor": "#0e0f12",
        "separateSidebar": True,
        "sidebarColor": "#14151a",
        "panelContrast": 1.0,
        "panelAlpha": 0.85
    },
    "neon": {
        "colorEnabled": True,
        "baseColor": "#050608",
        "separateSidebar": True,
        "sidebarColor": "#080b12",
        "panelContrast": 1.15,
        "panelAlpha": 0.72
    },
    "linear": {
        "colorEnabled": True,
        "baseColor": "#0d0e12",
        "separateSidebar": True,
        "sidebarColor": "#121318",
        "panelContrast": 1.05,
        "panelAlpha": 0.80
    },
    "oled": {
        "colorEnabled": True,
        "baseColor": "#000000",
        "separateSidebar": True,
        "sidebarColor": "#050505",
        "panelContrast": 1.25,
        "panelAlpha": 0.95
    }
}


def load_config() -> dict:
    if not CONFIG_FILE.exists():
        return dict(DEFAULT_CONFIG)
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            cfg = json.load(f)
            merged = dict(DEFAULT_CONFIG)
            merged.update(cfg)
            if "modelRenames" in cfg:
                merged["modelRenames"] = dict(cfg["modelRenames"])
            return merged
    except Exception as e:
        print(f"[AgyCustom] Error reading config: {e}", file=sys.stderr)
        return dict(DEFAULT_CONFIG)


def save_config(cfg: dict) -> bool:
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    tmp_file = CONFIG_FILE.with_suffix(".tmp")
    try:
        with open(tmp_file, "w", encoding="utf-8") as f:
            json.dump(cfg, f, indent=2, ensure_ascii=False)
        if CONFIG_FILE.exists():
            CONFIG_FILE.unlink()
        tmp_file.rename(CONFIG_FILE)
        return True
    except Exception as e:
        print(f"[AgyCustom] Error saving config: {e}", file=sys.stderr)
        if tmp_file.exists():
            try:
                tmp_file.unlink()
            except Exception:
                pass
        return False


def set_wallpaper(path_or_url: str, dim: float = None, blur: int = None, alpha: float = None) -> dict:
    cfg = load_config()
    target = path_or_url.strip()

    # If it's a local file, convert to file:/// URI or handle
    if Path(target).is_file():
        file_path = Path(target).resolve()
        target = file_path.as_uri()

    cfg["wallpaperUrl"] = target
    if dim is not None:
        cfg["wallpaperDim"] = max(0.0, min(1.0, float(dim)))
    if blur is not None:
        cfg["wallpaperBlur"] = max(0, int(blur))
    if alpha is not None:
        cfg["panelAlpha"] = max(0.0, min(1.0, float(alpha)))

    ok = save_config(cfg)
    return {
        "status": "success" if ok else "error",
        "wallpaper": target,
        "dim": cfg["wallpaperDim"],
        "blur": cfg["wallpaperBlur"],
        "alpha": cfg["panelAlpha"]
    }


def clear_wallpaper() -> dict:
    cfg = load_config()
    cfg["wallpaperUrl"] = ""
    cfg["wallpaperLocalName"] = ""
    save_config(cfg)
    if WALLPAPER_FILE.exists():
        try:
            WALLPAPER_FILE.unlink()
        except Exception:
            pass
    if WALLPAPER_META.exists():
        try:
            WALLPAPER_META.unlink()
        except Exception:
            pass
    return {"status": "success", "message": "Wallpaper cleared"}


def set_theme(preset: str = None, base_color: str = None, sidebar_color: str = None, contrast: float = None, alpha: float = None) -> dict:
    cfg = load_config()
    if preset and preset.lower() in PRESETS:
        cfg.update(PRESETS[preset.lower()])
    if base_color:
        cfg["baseColor"] = base_color.strip()
        cfg["colorEnabled"] = True
    if sidebar_color:
        cfg["sidebarColor"] = sidebar_color.strip()
        cfg["separateSidebar"] = True
    if contrast is not None:
        cfg["panelContrast"] = float(contrast)
    if alpha is not None:
        cfg["panelAlpha"] = float(alpha)

    ok = save_config(cfg)
    return {
        "status": "success" if ok else "error",
        "baseColor": cfg["baseColor"],
        "sidebarColor": cfg["sidebarColor"],
        "contrast": cfg["panelContrast"],
        "alpha": cfg["panelAlpha"]
    }


def rename_model(orig_name: str, new_name: str) -> dict:
    cfg = load_config()
    renames = cfg.get("modelRenames", {})
    if new_name.strip():
        renames[orig_name.strip()] = new_name.strip()
    else:
        renames.pop(orig_name.strip(), None)
    cfg["modelRenames"] = renames
    ok = save_config(cfg)
    return {"status": "success" if ok else "error", "modelRenames": renames}


def rename_account(new_name: str) -> dict:
    cfg = load_config()
    cfg["customAccountName"] = new_name.strip()
    ok = save_config(cfg)
    return {"status": "success" if ok else "error", "customAccountName": cfg["customAccountName"]}


def toggle_mascot(enabled: bool = None, roam: bool = None, size: int = None, say: str = None) -> dict:
    cfg = load_config()
    if enabled is not None:
        cfg["antyEnabled"] = bool(enabled)
    if roam is not None:
        cfg["antyRoam"] = bool(roam)
    if size is not None:
        cfg["antySize"] = int(size)
    if say is not None:
        cfg["mascotMessage"] = say.strip()

    ok = save_config(cfg)
    return {
        "status": "success" if ok else "error",
        "antyEnabled": cfg["antyEnabled"],
        "antyRoam": cfg["antyRoam"],
        "antySize": cfg["antySize"],
        "mascotMessage": cfg.get("mascotMessage", "")
    }


# ==============================================================================
# Model Context Protocol (MCP) Server Loop
# ==============================================================================

TOOLS = [
    {
        "name": "agy_status",
        "description": "Get current Antigravity custom UI status (active wallpaper, colors, model renames, mascot state).",
        "inputSchema": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "agy_set_wallpaper",
        "description": "Set custom background wallpaper (image, GIF, MP4/WebM video) with blur and opacity.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "path_or_url": {
                    "type": "string",
                    "description": "Absolute file path (e.g. C:/wallpapers/cyber.png) or direct web URL."
                },
                "dim": {
                    "type": "number",
                    "description": "Darkening overlay amount from 0.0 (bright) to 1.0 (black). Default 0.42."
                },
                "blur": {
                    "type": "integer",
                    "description": "Background blur in pixels (0 for sharp, 5-20 for glass blur). Default 0."
                },
                "alpha": {
                    "type": "number",
                    "description": "Panel surface transparency from 0.0 (transparent) to 1.0 (opaque). Default 0.7."
                }
            },
            "required": ["path_or_url"]
        }
    },
    {
        "name": "agy_clear_wallpaper",
        "description": "Remove custom wallpaper and revert to clean color surface.",
        "inputSchema": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "agy_set_theme",
        "description": "Apply interface color theme or preset (swiss, neon, linear, oled).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "preset": {
                    "type": "string",
                    "enum": ["swiss", "neon", "linear", "oled"],
                    "description": "Curated design preset."
                },
                "base_color": {
                    "type": "string",
                    "description": "HEX color for main panels (e.g. #0e0f12)."
                },
                "sidebar_color": {
                    "type": "string",
                    "description": "HEX color for navigation sidebar."
                },
                "contrast": {
                    "type": "number",
                    "description": "Panel contrast ratio (0.8 - 1.4)."
                }
            }
        }
    },
    {
        "name": "agy_rename_model",
        "description": "Visually rename any model in the Antigravity selector (e.g. rename 'Gemini 3.8 Flash' to 'Gemini 4 Neon').",
        "inputSchema": {
            "type": "object",
            "properties": {
                "original_name": {
                    "type": "string",
                    "description": "Original model name string to find."
                },
                "new_name": {
                    "type": "string",
                    "description": "New displayed model name (or empty string to reset)."
                }
            },
            "required": ["original_name", "new_name"]
        }
    },
    {
        "name": "agy_rename_account",
        "description": "Visually customize the displayed account / greeting name on the Antigravity home screen.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "new_name": {
                    "type": "string",
                    "description": "Custom name to show."
                }
            },
            "required": ["new_name"]
        }
    },
    {
        "name": "agy_set_mascot",
        "description": "Control Anty the pixel mascot (toggle visibility, roaming, size, or speech bubble message).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "enabled": {
                    "type": "boolean",
                    "description": "Enable or disable mascot Anty."
                },
                "roam": {
                    "type": "boolean",
                    "description": "Allow Anty to walk around the prompt border."
                },
                "size": {
                    "type": "integer",
                    "description": "Mascot size in pixels (36 to 96)."
                },
                "say": {
                    "type": "string",
                    "description": "Text for Anty to say in a speech bubble."
                }
            }
        }
    }
]


def run_mcp_server():
    """Stdio JSON-RPC MCP server loop for native Antigravity tool calling."""
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
        except Exception:
            continue

        req_id = req.get("id")
        method = req.get("method")
        params = req.get("params", {})

        if method == "initialize":
            resp = {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {"tools": {}},
                    "serverInfo": {
                        "name": "agy-custom-design",
                        "version": "2.0.0"
                    }
                }
            }
            sys.stdout.write(json.dumps(resp) + "\n")
            sys.stdout.flush()

        elif method == "notifications/initialized":
            pass

        elif method == "tools/list":
            resp = {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "tools": TOOLS
                }
            }
            sys.stdout.write(json.dumps(resp) + "\n")
            sys.stdout.flush()

        elif method == "tools/call":
            tool_name = params.get("name")
            args = params.get("arguments", {})
            res = {}

            if tool_name == "agy_status":
                res = load_config()
            elif tool_name == "agy_set_wallpaper":
                res = set_wallpaper(
                    args.get("path_or_url", ""),
                    dim=args.get("dim"),
                    blur=args.get("blur"),
                    alpha=args.get("alpha")
                )
            elif tool_name == "agy_clear_wallpaper":
                res = clear_wallpaper()
            elif tool_name == "agy_set_theme":
                res = set_theme(
                    preset=args.get("preset"),
                    base_color=args.get("base_color"),
                    sidebar_color=args.get("sidebar_color"),
                    contrast=args.get("contrast")
                )
            elif tool_name == "agy_rename_model":
                res = rename_model(args.get("original_name", ""), args.get("new_name", ""))
            elif tool_name == "agy_rename_account":
                res = rename_account(args.get("new_name", ""))
            elif tool_name == "agy_set_mascot":
                res = toggle_mascot(
                    enabled=args.get("enabled"),
                    roam=args.get("roam"),
                    size=args.get("size"),
                    say=args.get("say")
                )
            else:
                res = {"error": f"Unknown tool: {tool_name}"}

            resp = {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "content": [
                        {
                            "type": "text",
                            "text": json.dumps(res, indent=2, ensure_ascii=False)
                        }
                    ]
                }
            }
            sys.stdout.write(json.dumps(resp) + "\n")
            sys.stdout.flush()


def main():
    parser = argparse.ArgumentParser(description="Agy-Custom-Design CLI & MCP Server")
    sub = parser.add_subparsers(dest="cmd")

    sub.add_parser("status", help="Show current configuration")
    sub.add_parser("mcp", help="Run as stdio MCP server")

    wp_parser = sub.add_parser("set-wallpaper", help="Set background wallpaper")
    wp_parser.add_argument("path", help="Local file path or URL")
    wp_parser.add_argument("--dim", type=float, default=None, help="Dim ratio (0.0 - 1.0)")
    wp_parser.add_argument("--blur", type=int, default=None, help="Blur pixels (e.g. 10)")
    wp_parser.add_argument("--alpha", type=float, default=None, help="Panel opacity (0.0 - 1.0)")

    sub.add_parser("clear-wallpaper", help="Clear wallpaper")

    theme_parser = sub.add_parser("set-theme", help="Set color theme / preset")
    theme_parser.add_argument("--preset", choices=["swiss", "neon", "linear", "oled"], help="Preset name")
    theme_parser.add_argument("--base", help="Base color (#hex)")
    theme_parser.add_argument("--sidebar", help="Sidebar color (#hex)")
    theme_parser.add_argument("--contrast", type=float, help="Contrast ratio")

    model_parser = sub.add_parser("rename-model", help="Rename model in selector")
    model_parser.add_argument("orig", help="Original model string")
    model_parser.add_argument("new", help="New model string")

    acc_parser = sub.add_parser("rename-account", help="Rename greeting name")
    acc_parser.add_argument("name", help="New greeting name")

    mascot_parser = sub.add_parser("mascot", help="Control Anty mascot")
    mascot_parser.add_argument("--enable", action="store_true", default=None)
    mascot_parser.add_argument("--disable", action="store_true", default=None)
    mascot_parser.add_argument("--roam", action="store_true", default=None)
    mascot_parser.add_argument("--say", help="Say something in speech bubble")

    args = parser.parse_args()

    if args.cmd == "mcp" or (len(sys.argv) == 1 and not sys.stdin.isatty()):
        run_mcp_server()
        return

    if args.cmd == "status":
        print(json.dumps(load_config(), indent=2, ensure_ascii=False))
    elif args.cmd == "set-wallpaper":
        res = set_wallpaper(args.path, dim=args.dim, blur=args.blur, alpha=args.alpha)
        print(json.dumps(res, indent=2))
    elif args.cmd == "clear-wallpaper":
        print(json.dumps(clear_wallpaper(), indent=2))
    elif args.cmd == "set-theme":
        res = set_theme(preset=args.preset, base_color=args.base, sidebar_color=args.sidebar, contrast=args.contrast)
        print(json.dumps(res, indent=2))
    elif args.cmd == "rename-model":
        res = rename_model(args.orig, args.new)
        print(json.dumps(res, indent=2))
    elif args.cmd == "rename-account":
        res = rename_account(args.name)
        print(json.dumps(res, indent=2))
    elif args.cmd == "mascot":
        enabled = True if args.enable else (False if args.disable else None)
        res = toggle_mascot(enabled=enabled, roam=args.roam, say=args.say)
        print(json.dumps(res, indent=2))
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
