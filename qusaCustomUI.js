"use strict";
(() => {
if (window.__qusaInjected) return;
window.__qusaInjected = true;
/**
 * Custom Color, Wallpaper, Telemetry, Reversible RU Localization & Model Renamer for Antigravity
 * Persists all settings & local wallpapers to disk via window.qusaPersist (independent of localhost port).
 */

const PRESETS = [
  { name: 'Оригинал', color: '#121212' },
  { name: 'OLED Чёрный', color: '#050505' },
  { name: 'Полночь', color: '#0f172a' },
  { name: 'Глубокий синий', color: '#0c1624' },
  { name: 'Изумруд', color: '#0d1d1a' },
  { name: 'Фиолет', color: '#171226' },
  { name: 'Бордо', color: '#211118' },
  { name: 'Графит', color: '#1c1f26' },
  { name: 'Кофе', color: '#1b1613' },
  { name: 'Хвойный', color: '#111d15' },
];

const KNOWN_MODELS = [
  'Gemini 4 Neon',
  'Gemini 4 Argon',
  'Gemini 4 Hydrogen',
  'Orchestrator (Neon)',
  'Orchestrator (Argon)',
  'Gemini 3.8 Flash',
  'Claude Opus 5.5',
  'Claude Sonnet 5.5',
  'GPT-OSS 120B (Medium)',
  'Gemini 4 Carbon',
];

const RU_DICT = {
  'Antigravity': 'Antigravity',
  'Workspace': 'Проекты',
  'Workspaces': 'Проекты',
  'View': 'Вид',
  'Window': 'Окно',
  'File': 'Файл',
  'Edit': 'Правка',
  'Help': 'Справка',
  'New Conversation': 'Новый чат',
  '+ New Conversation': '+ Новый чат',
  'Automations': 'Автоматизации',
  'Customizations': 'Кастомизация',
  'Pinned Conversations': 'Закреплённые чаты',
  'Projects': 'Проекты',
  'Conversations': 'Чаты',
  'Settings': 'Настройки',
  'Ask anything, @ to mention, / for actions': 'Спроси что угодно, @ — упомянуть, / — команды',
  'Ask anything...': 'Спроси что угодно...',
  'Planning': 'План',
  'Fast': 'Быстро',
  'Turbo': 'Турбо',
  'Working': 'Работаю...',
  'Working...': 'Работаю...',
  'Thinking...': 'Думаю...',
  'Thought for': 'Размышлял',
  'Show more': 'Показать ещё',
  'Show less': 'Свернуть',
  'Copy': 'Копировать',
  'Copied': 'Скопировано',
  'Retry': 'Повторить',
  'Regenerate': 'Перегенерировать',
  'Cancel': 'Отмена',
  'Save': 'Сохранить',
  'Delete': 'Удалить',
  'Rename': 'Переименовать',
  'Pin': 'Закрепить',
  'Unpin': 'Открепить',
  'Close': 'Закрыть',
  'Open': 'Открыть',
  'Open Folder': 'Открыть папку',
  'Open Workspace': 'Открыть проект',
  'No active workspace': 'Нет активного проекта',
  'Search': 'Поиск',
  'Search conversations...': 'Поиск по чатам...',
  'History': 'История',
  'Files': 'Файлы',
  'Terminal': 'Терминал',
  'Browser': 'Браузер',
  'Plugins': 'Плагины',
  'Skills': 'Навыки',
  'Rules': 'Правила',
  'Agents': 'Агенты',
  'Model': 'Модель',
  'Models': 'Модели',
  'Model Selection': 'Выбор модели',
  'View Usage': 'Использование',
  'Theme': 'Тема',
  'Appearance': 'Внешний вид',
  'Language': 'Язык',
  'General': 'Основные',
  'Account': 'Аккаунт',
  'Sign in': 'Войти',
  'Sign out': 'Выйти',
  'New Tab': 'Новая вкладка',
  'New Window': 'Новое окно',
  'Check for Updates': 'Проверить обновления',
  'Docs': 'Документация',
  'Send': 'Отправить',
  'Stop': 'Стоп',
  'Attach': 'Прикрепить',
  'Upload': 'Загрузить',
  'Download': 'Скачать',
  'Refresh': 'Обновить',
  'Reload': 'Перезагрузить',
  'Clear': 'Очистить',
  'Back': 'Назад',
  'Forward': 'Вперёд',
  'Done': 'Готово',
  'Error': 'Ошибка',
  'Warning': 'Предупреждение',
  'Loading...': 'Загрузка...',
  'Enable': 'Включить',
  'Disable': 'Выключить',
  'Enabled': 'Включено',
  'Disabled': 'Выключено',
  'Installed': 'Установлено',
  'Marketplace': 'Маркетплейс',
  'MCP Servers': 'MCP-серверы',
  'Workflows': 'Воркфлоу',
  'Low': 'Низкий',
  'Medium': 'Средний',
  'High': 'Высокий',
  'Always allow': 'Всегда разрешать',
  'Allow': 'Разрешить',
  'Deny': 'Отклонить',
  'Reject': 'Отклонить',
  'Accept': 'Принять',
  'Apply': 'Применить',
  'Reset': 'Сбросить',
};

const STORAGE_KEY = 'qusa_custom_ui_v2';

const DEFAULT_CONFIG = {
  colorEnabled: true,
  baseColor: '#121212',
  separateSidebar: false,
  sidebarColor: '#181818',
  panelContrast: 1.0,
  wallpaperUrl: '',
  wallpaperLocalName: '',
  wallpaperDim: 0.42,
  wallpaperBlur: 0,
  panelAlpha: 0.68,
  ruEnabled: false,
  customAccountName: '',
  modelRenames: {},
  fabHidden: false,
  fabHotkey: 'Alt+KeyS',
  fabLeft: null,
  fabTop: null,
  antyEnabled: true,
  antyRoam: true,
  antySize: 58,
};

let activeLocalBlobUrl = '';
let activeLocalMime = '';
let saveDiskTimer = null;

function mergeConfig(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    return { ...DEFAULT_CONFIG, modelRenames: {} };
  }
  return {
    ...DEFAULT_CONFIG,
    ...parsed,
    modelRenames: { ...(parsed.modelRenames || {}) },
  };
}

async function loadConfigAsync() {
  try {
    if (window.qusaPersist && typeof window.qusaPersist.loadConfig === 'function') {
      const diskCfg = await window.qusaPersist.loadConfig();
      if (diskCfg && typeof diskCfg === 'object') {
        return mergeConfig(diskCfg);
      }
    }
  } catch (err) {
    console.error('[Qusa] Disk config load failed:', err);
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const cfg = mergeConfig(JSON.parse(raw));
      saveConfig(cfg, true);
      return cfg;
    }
  } catch {}
  return { ...DEFAULT_CONFIG, modelRenames: {} };
}

function saveConfig(cfg, immediate = false) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {}
  if (window.qusaPersist && typeof window.qusaPersist.saveConfig === 'function') {
    const flush = () => {
      saveDiskTimer = null;
      void window.qusaPersist.saveConfig(cfg).catch((err) => {
        console.error('[Qusa] Disk config save failed:', err);
      });
    };
    if (immediate) {
      if (saveDiskTimer) clearTimeout(saveDiskTimer);
      flush();
    } else {
      if (saveDiskTimer) clearTimeout(saveDiskTimer);
      saveDiskTimer = setTimeout(flush, 120);
    }
  }
}

async function saveLocalWallpaper(file) {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  if (window.qusaPersist && typeof window.qusaPersist.saveWallpaper === 'function') {
    await window.qusaPersist.saveWallpaper({
      bytes,
      name: file.name,
      type: file.type || 'application/octet-stream',
    });
  }
}

async function loadLocalWallpaper() {
  try {
    if (window.qusaPersist && typeof window.qusaPersist.loadWallpaper === 'function') {
      const res = await window.qusaPersist.loadWallpaper();
      if (res && res.bytes && res.bytes.length > 0) {
        const blob = new Blob([res.bytes], { type: res.type || 'image/jpeg' });
        return { blob, name: res.name || 'локальные обои', type: res.type || '' };
      }
    }
  } catch (err) {
    console.error('[Qusa] Disk wallpaper load failed:', err);
  }
  return null;
}

async function clearLocalWallpaper() {
  try {
    if (window.qusaPersist && typeof window.qusaPersist.clearWallpaper === 'function') {
      await window.qusaPersist.clearWallpaper();
    }
  } catch {}
  if (activeLocalBlobUrl) {
    URL.revokeObjectURL(activeLocalBlobUrl);
    activeLocalBlobUrl = '';
    activeLocalMime = '';
  }
}

function hasActiveWallpaper(cfg) {
  return Boolean((cfg.wallpaperUrl && cfg.wallpaperUrl.trim()) || activeLocalBlobUrl);
}

function hexToRgb(hex) {
  const clean = String(hex || '').trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(clean)) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  if (/^[0-9a-f]{6}$/i.test(clean)) {
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  }
  return null;
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function shiftRgb(rgb, delta) {
  return [
    clamp(Math.round(rgb[0] + delta), 0, 255),
    clamp(Math.round(rgb[1] + delta), 0, 255),
    clamp(Math.round(rgb[2] + delta), 0, 255),
  ];
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function eventToHotkey(e) {
  if (!e || !e.code) return '';
  const parts = [];
  if (e.ctrlKey) parts.push('Ctrl');
  if (e.altKey) parts.push('Alt');
  if (e.shiftKey) parts.push('Shift');
  if (e.metaKey) parts.push('Meta');
  parts.push(e.code);
  return parts.join('+');
}

function formatHotkey(combo) {
  if (!combo) return 'Не задано';
  return combo
    .split('+')
    .map((p) => p.replace(/^Key/, '').replace(/^Digit/, ''))
    .join(' + ');
}

function updateWallpaperLayer(cfg) {
  const wpActive = hasActiveWallpaper(cfg);
  let layer = document.getElementById('qusa-bg-layer');

  if (!wpActive) {
    if (layer) layer.remove();
    return;
  }

  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'qusa-bg-layer';
    layer.innerHTML = '<div id="qusa-bg-media-host"></div><div id="qusa-bg-dim"></div>';
    document.body.appendChild(layer);
  }

  const host = document.getElementById('qusa-bg-media-host');
  if (!host) return;

  const url = (cfg.wallpaperUrl || '').trim() || activeLocalBlobUrl;
  const isVideo = /\.(mp4|webm)(\?|$)/i.test(url) || (url === activeLocalBlobUrl && activeLocalMime.startsWith('video/'));
  const currentSrc = host.getAttribute('data-src') || '';

  if (currentSrc !== url) {
    host.setAttribute('data-src', url);
    host.innerHTML = '';
    if (isVideo) {
      const vid = document.createElement('video');
      vid.id = 'qusa-bg-media';
      vid.src = url;
      vid.autoplay = true;
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.setAttribute('muted', '');
      vid.setAttribute('autoplay', '');
      vid.setAttribute('loop', '');
      vid.setAttribute('playsinline', '');
      vid.onerror = () => {
        const st = document.getElementById('qusa-wp-status');
        if (st) st.textContent = '⚠️ Не удалось воспроизвести видео (Electron часто не поддерживает MP4/H.264 — используй WebM или GIF)';
      };
      host.appendChild(vid);
      void vid.play().catch((err) => {
        console.warn('[Qusa] Video autoplay/codec warning:', err);
        const st = document.getElementById('qusa-wp-status');
        if (st && vid.error) {
          st.textContent = '⚠️ Кодек видео не поддерживается Electron — конвертируй в WebM или GIF';
        }
      });
    } else {
      const img = document.createElement('img');
      img.id = 'qusa-bg-media';
      img.src = url;
      img.alt = '';
      img.onerror = () => {
        img.style.display = 'none';
        const st = document.getElementById('qusa-wp-status');
        if (st) st.textContent = '⚠️ Не удалось загрузить изображение обоев';
      };
      host.appendChild(img);
    }
  }
}

function injectStyles(cfg) {
  let styleEl = document.getElementById('qusa-custom-styles');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'qusa-custom-styles';
    document.head.appendChild(styleEl);
  }

  const baseRgb = hexToRgb(cfg.baseColor) || [18, 18, 18];
  const wpActive = hasActiveWallpaper(cfg);
  const isCustomColor = Boolean(cfg.colorEnabled && cfg.baseColor.toLowerCase() !== '#121212');
  const modalBg = shiftRgb(baseRgb, 10);
  const btnBg = shiftRgb(baseRgb, 16);
  const wpBlur = Number(cfg.wallpaperBlur || 0);
  const wpDim = Number(cfg.wallpaperDim ?? 0.42);

  styleEl.textContent = `
    ${wpActive ? `
    html, body, #root, #app, #root > div, #root > div > div, main, [class*="chat"], [class*="Chat"], [class*="conversation"] {
      background-color: transparent !important;
      background: transparent !important;
    }
    [class*="bg-gradient-to-"], [class*="bg-linear-to-"], [class*="from-background"], [class*="from-sidebar"], [class*="from-muted"] {
      background-image: none !important;
      background-color: transparent !important;
    }
    [data-qusa-no-bg="1"],
    [data-qusa-no-bg="1"]::before,
    [data-qusa-no-bg="1"]::after {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }
    #qusa-bg-layer {
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none !important;
      overflow: hidden;
      background: ${cfg.baseColor};
    }
    #qusa-bg-layer * {
      pointer-events: none !important;
    }
    #qusa-bg-media {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      ${wpBlur > 0 ? `filter: blur(${wpBlur}px); transform: scale(1.04);` : ''}
    }
    #qusa-bg-dim {
      position: absolute;
      inset: 0;
      background: rgba(5, 7, 12, ${wpDim});
    }
    ` : (isCustomColor ? `
    html, body {
      background-color: ${cfg.baseColor} !important;
    }
    [class*="bg-gradient-to-"], [class*="bg-linear-to-"], [class*="from-background"], [class*="from-sidebar"], [class*="from-muted"] {
      background-image: none !important;
      background-color: transparent !important;
    }
    [data-qusa-no-bg="1"],
    [data-qusa-no-bg="1"]::before,
    [data-qusa-no-bg="1"]::after {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }
    ` : '')}

    /* Compact Native-Style Draggable Button */
    #qusa-style-fab {
      position: fixed;
      right: 215px;
      top: 42px;
      z-index: 99998;
      display: ${cfg.fabHidden ? 'none' : 'flex'};
      align-items: center;
      gap: 6px;
      padding: 5px 11px;
      border-radius: 8px;
      background: rgb(${btnBg[0]}, ${btnBg[1]}, ${btnBg[2]});
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.12);
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 12px;
      font-weight: 500;
      cursor: grab;
      user-select: none;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
      transition: border-color 0.15s ease, background-color 0.15s ease;
    }
    #qusa-style-fab:active {
      cursor: grabbing;
    }
    #qusa-style-fab:hover {
      border-color: rgba(255, 255, 255, 0.28);
    }
    #qusa-fab-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${cfg.baseColor};
      border: 1px solid rgba(255, 255, 255, 0.35);
      display: inline-block;
    }

    /* Customizer Modal */
    #qusa-theme-modal {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: none;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(4px);
      font-family: system-ui, -apple-system, sans-serif;
      color: #e2e8f0;
    }
    #qusa-theme-modal.open {
      display: flex;
    }
    .qusa-modal-card {
      width: 470px;
      max-width: 94vw;
      max-height: 88vh;
      overflow-y: auto;
      background: rgb(${modalBg[0]}, ${modalBg[1]}, ${modalBg[2]});
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65);
    }
    .qusa-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .qusa-modal-title {
      font-size: 15px;
      font-weight: 600;
      color: #f8fafc;
    }
    .qusa-close-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cbd5e1;
      border-radius: 8px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;
    }
    .qusa-close-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
    }
    .qusa-preset-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin: 10px 0 14px;
    }
    .qusa-preset-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 10px;
      border-radius: 9px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.09);
      cursor: pointer;
      font-size: 12px;
      color: #e2e8f0;
      transition: background-color 0.12s ease, border-color 0.12s ease;
    }
    .qusa-preset-item:hover {
      background: rgba(255, 255, 255, 0.09);
    }
    .qusa-preset-item.active {
      border-color: rgba(255, 255, 255, 0.45);
      background: rgba(255, 255, 255, 0.11);
    }
    .qusa-swatch {
      width: 16px;
      height: 16px;
      border-radius: 5px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      flex-shrink: 0;
    }
    .qusa-field {
      margin-bottom: 12px;
    }
    .qusa-field label {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #cbd5e1;
      margin-bottom: 6px;
    }
    .qusa-color-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .qusa-color-row input[type="color"] {
      width: 40px;
      height: 32px;
      padding: 2px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: transparent;
      cursor: pointer;
    }
    .qusa-input {
      flex: 1;
      min-width: 0;
      padding: 6px 9px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(0, 0, 0, 0.28);
      color: #f8fafc;
      font-size: 12px;
      outline: none;
    }
    .qusa-input:focus {
      border-color: rgba(255, 255, 255, 0.38);
    }
    .qusa-input-mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .qusa-field input[type="range"] {
      width: 100%;
      accent-color: #94a3b8;
    }
    .qusa-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 0;
      font-size: 13px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .qusa-details {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 8px;
      margin-top: 2px;
    }
    .qusa-details summary {
      cursor: pointer;
      font-size: 13px;
      color: #e2e8f0;
      user-select: none;
      padding: 4px 0;
    }
    .qusa-wp-box {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .qusa-wp-status {
      font-size: 11.5px;
      color: #94a3b8;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .qusa-models-list {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-top: 10px;
    }
    .qusa-model-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .qusa-model-orig {
      width: 165px;
      flex-shrink: 0;
      font-size: 11.5px;
      color: #94a3b8;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .qusa-custom-add {
      display: flex;
      gap: 6px;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px dashed rgba(255, 255, 255, 0.10);
    }
    .qusa-footer {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    /* Anty Mascot */
    #qusa-anty {
      position: fixed;
      z-index: 99990;
      width: ${cfg.antySize || 58}px;
      height: ${cfg.antySize || 58}px;
      display: ${cfg.antyEnabled !== false ? 'block' : 'none'};
      user-select: none;
      cursor: grab;
      pointer-events: auto;
      will-change: left, top;
      filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45));
    }
    #qusa-anty:active {
      cursor: grabbing;
    }
    #qusa-anty-flip {
      width: 100%;
      height: 100%;
      transition: transform 0.16s ease;
    }
    #qusa-anty[data-dir="left"] #qusa-anty-flip {
      transform: scaleX(-1);
    }
    #qusa-anty-sprite {
      width: 100%;
      height: 100%;
      transform-origin: center bottom;
    }
    #qusa-anty-sprite svg {
      width: 100%;
      height: 100%;
      display: block;
      image-rendering: pixelated;
    }
    #qusa-anty[data-state="idle"] #qusa-anty-sprite {
      animation: none;
    }
    #qusa-anty[data-state="walking"] #qusa-anty-sprite {
      animation: qusa-anty-walk 0.36s steps(2, end) infinite;
    }
    #qusa-anty[data-state="walking"] .anty-leg-l {
      animation: qusa-anty-step-l 0.36s steps(2, end) infinite;
    }
    #qusa-anty[data-state="walking"] .anty-leg-r {
      animation: qusa-anty-step-r 0.36s steps(2, end) infinite;
    }
    #qusa-anty[data-state="walking"] .anty-arm-l {
      animation: qusa-anty-arm-l 0.36s steps(2, end) infinite;
    }
    #qusa-anty[data-state="walking"] .anty-arm-r {
      animation: qusa-anty-arm-r 0.36s steps(2, end) infinite;
    }
    #qusa-anty[data-state="walking"] .anty-tail {
      animation: qusa-anty-tail 0.36s steps(2, end) infinite;
    }
    #qusa-anty[data-state="working"] #qusa-anty-sprite {
      animation: qusa-anty-work 0.45s ease-in-out infinite;
    }
    #qusa-anty[data-state="asking"] #qusa-anty-sprite {
      animation: qusa-anty-curious 1.8s ease-in-out infinite;
    }
    #qusa-anty[data-state="completed"] #qusa-anty-sprite {
      animation: qusa-anty-happy 0.55s ease-in-out infinite;
    }
    #qusa-anty[data-state="sleeping"] #qusa-anty-sprite {
      animation: qusa-anty-sleep 3.2s ease-in-out infinite;
    }
    #qusa-anty[data-state="petting"] #qusa-anty-sprite {
      animation: qusa-anty-pet 0.38s ease-in-out infinite;
    }
    .qusa-anty-heart {
      position: absolute;
      pointer-events: none;
      font-size: 13px;
      line-height: 1;
      color: #ff75bd;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
      animation: qusa-anty-heart-rise 0.95s ease-out forwards;
      z-index: 2;
    }
    #qusa-anty-bubble {
      position: absolute;
      bottom: calc(100% + 2px);
      left: 50%;
      transform: translateX(-50%) translateY(4px);
      background: rgba(16, 18, 28, 0.92);
      color: #f1f5f9;
      border: 1px solid rgba(182, 108, 255, 0.38);
      border-radius: 10px;
      padding: 3px 8px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.18s ease, transform 0.18s ease;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
    }
    #qusa-anty-bubble.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    @keyframes qusa-anty-walk {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    @keyframes qusa-anty-step-l {
      0%, 100% { transform: translate(-6px, -10px); }
      50% { transform: translate(7px, 0); }
    }
    @keyframes qusa-anty-step-r {
      0%, 100% { transform: translate(7px, 0); }
      50% { transform: translate(-6px, -10px); }
    }
    @keyframes qusa-anty-arm-l {
      0%, 100% { transform: translate(5px, -4px); }
      50% { transform: translate(-5px, 3px); }
    }
    @keyframes qusa-anty-arm-r {
      0%, 100% { transform: translate(-5px, 3px); }
      50% { transform: translate(5px, -4px); }
    }
    @keyframes qusa-anty-tail {
      0%, 100% { transform: translateY(-5px); }
      50% { transform: translateY(3px); }
    }
    @keyframes qusa-anty-work {
      0%, 100% { transform: translateY(0) rotate(-1.5deg); }
      50% { transform: translateY(-2px) rotate(1.5deg); }
    }
    @keyframes qusa-anty-curious {
      0%, 100% { transform: rotate(-4deg) translateY(0); }
      50% { transform: rotate(4deg) translateY(-2px); }
    }
    @keyframes qusa-anty-happy {
      0%, 100% { transform: translateY(0) scale(1); }
      45% { transform: translateY(-9px) scale(1.06); }
    }
    @keyframes qusa-anty-sleep {
      0%, 100% { transform: scaleY(1) scaleX(1); }
      50% { transform: scaleY(0.95) scaleX(1.03); }
    }
    @keyframes qusa-anty-pet {
      0%, 100% { transform: scaleX(1.06) scaleY(0.91) rotate(-4deg); }
      50% { transform: scaleX(1.08) scaleY(0.89) rotate(4deg); }
    }
    @keyframes qusa-anty-heart-rise {
      0% { opacity: 1; transform: translate(-50%, 0) scale(0.8); }
      100% { opacity: 0; transform: translate(-50%, -32px) scale(1.25); }
    }
  `;

  const dot = document.getElementById('qusa-fab-dot');
  if (dot) dot.style.background = cfg.baseColor;
}

const INTERACTIVE_SELECTOR = 'button, a, input, select, [role="button"], [role="menuitem"], [role="option"], [role="tab"]';

let _colorCanvasCtx = null;
const _colorParseCache = new Map();

function parseAnyCssColor(cssStr) {
  if (!cssStr || cssStr === 'transparent' || cssStr === 'rgba(0, 0, 0, 0)') return null;
  if (_colorParseCache.has(cssStr)) return _colorParseCache.get(cssStr);

  const m = cssStr.match(/^rgba?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*[,\s]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
  if (m) {
    let a = 1;
    if (m[4] !== undefined) {
      a = m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    }
    const res = [Math.round(parseFloat(m[1])), Math.round(parseFloat(m[2])), Math.round(parseFloat(m[3])), a];
    _colorParseCache.set(cssStr, res);
    return res;
  }

  try {
    if (!_colorCanvasCtx) {
      const c = document.createElement('canvas');
      c.width = 1;
      c.height = 1;
      _colorCanvasCtx = c.getContext('2d', { willReadFrequently: true });
    }
    _colorCanvasCtx.clearRect(0, 0, 1, 1);
    _colorCanvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
    _colorCanvasCtx.fillStyle = cssStr;
    _colorCanvasCtx.fillRect(0, 0, 1, 1);
    const d = _colorCanvasCtx.getImageData(0, 0, 1, 1).data;
    const res = [d[0], d[1], d[2], d[3] / 255];
    _colorParseCache.set(cssStr, res);
    return res;
  } catch {
    _colorParseCache.set(cssStr, null);
    return null;
  }
}

function applySurfaceColors(cfg) {
  const baseRgb = hexToRgb(cfg.baseColor) || [18, 18, 18];
  const sidebarRgb = hexToRgb(cfg.sidebarColor) || [24, 24, 24];
  const contrast = Number.isFinite(cfg.panelContrast) ? cfg.panelContrast : 1.0;
  const wpActive = hasActiveWallpaper(cfg);
  const pAlpha = Number.isFinite(cfg.panelAlpha) ? cfg.panelAlpha : 0.68;

  const shouldApply = Boolean(
    wpActive ||
    (cfg.colorEnabled &&
      (cfg.baseColor.toLowerCase() !== '#121212' || (cfg.separateSidebar && cfg.sidebarColor.toLowerCase() !== '#181818') || contrast !== 1.0))
  );

  const els = document.querySelectorAll('div, main, section, aside, nav, header, footer, pre, form');
  for (const el of els) {
    if (el.id && el.id.startsWith('qusa-')) continue;
    if (el.closest('#qusa-theme-modal, #qusa-style-fab, #qusa-telemetry-bar, #qusa-bg-layer, #qusa-anty')) continue;
    if (el.matches(INTERACTIVE_SELECTOR)) continue;

    let origStr = el.getAttribute('data-qusa-orig-bg');
    let role = el.getAttribute('data-qusa-role');

    if (!origStr) {
      const rect = el.getBoundingClientRect();
      // Clean dark gradient/solid backdrop boxes in the top-right bar (including narrow fade strips next to icons)
      if (shouldApply && rect.top <= 88 && rect.height >= 12 && rect.height <= 56 && rect.right >= window.innerWidth - 360 && rect.width >= 6 && rect.width <= 320) {
        const csTop = getComputedStyle(el);
        const csTopB = getComputedStyle(el, '::before');
        const csTopA = getComputedStyle(el, '::after');
        const hasTopGrad = (csTop.backgroundImage && csTop.backgroundImage !== 'none') ||
          (csTopB.backgroundImage && csTopB.backgroundImage !== 'none') ||
          (csTopA.backgroundImage && csTopA.backgroundImage !== 'none');
        const pTop = parseAnyCssColor(csTop.backgroundColor);
        const isTopDarkBox = rect.right >= window.innerWidth - 120 && pTop && pTop[3] >= 0.5 && pTop[0] <= 68 && pTop[1] <= 68 && pTop[2] <= 68;
        if (hasTopGrad || isTopDarkBox) {
          el.setAttribute('data-qusa-no-bg', '1');
          continue;
        }
      }
      const inSidebar = Boolean(el.closest('[data-qusa-role="sidebar"]'));
      if (inSidebar && shouldApply && rect.width >= 24 && rect.height >= 16 && rect.height <= 48) {
        const csSide = getComputedStyle(el);
        if (csSide.backgroundImage && csSide.backgroundImage.includes('gradient')) {
          el.style.setProperty('background-image', 'none', 'important');
          el.style.setProperty('background-color', 'transparent', 'important');
          continue;
        }
      }
      if (rect.width < 80 || rect.height < 18) continue;
      const cs = getComputedStyle(el);

      if (shouldApply && rect.width > 260 && rect.height > 12 && rect.height <= 140 && cs.backgroundImage && cs.backgroundImage.includes('gradient') && el.innerText.trim() === '') {
        el.style.setProperty('background-image', 'none', 'important');
        el.style.setProperty('background-color', 'transparent', 'important');
        continue;
      }

      const parsed = parseAnyCssColor(cs.backgroundColor);
      if (!parsed) continue;
      const [r, g, b, a] = parsed;

      const spread = Math.max(r, g, b) - Math.min(r, g, b);
      if (a < 0.85 || spread > 18 || r > 68 || g > 68 || b > 68) continue;

      origStr = `${r},${g},${b},${a}`;
      el.setAttribute('data-qusa-orig-bg', origStr);

      const isPopup = Boolean(el.matches('[role="listbox"], [role="menu"], [role="dialog"]') || el.closest('[role="listbox"], [role="menu"], [role="dialog"]'));
      const clsStr = typeof el.className === 'string' ? el.className : '';
      const isInsideSidebar = Boolean(el.parentElement && el.parentElement.closest('[data-qusa-role="sidebar"]'));
      const isSidebarItem = !isPopup && (
        (isInsideSidebar && rect.height <= 56) ||
        (rect.left <= 36 && rect.right <= 390 && rect.width >= 100 && rect.height >= 18 && rect.height <= 56 && rect.top >= 48)
      );
      const isSidebar = !isPopup && !isSidebarItem && (
        el.tagName === 'ASIDE' ||
        el.tagName === 'NAV' ||
        Boolean(el.closest('aside, nav, [data-qusa-role="sidebar"]')) ||
        /sidebar/i.test(clsStr) ||
        (rect.left <= 24 && rect.right <= 390 && rect.width >= 140 && rect.height > window.innerHeight * 0.35)
      );
      const isHeader = !isPopup && !isSidebar && !isSidebarItem && (
        el.tagName === 'HEADER' ||
        (rect.top <= 48 && rect.height <= 64 && rect.width > window.innerWidth * 0.4)
      );
      const borderRad = parseFloat(cs.borderRadius) || 0;
      const isCard = !isPopup && !isSidebar && !isSidebarItem && !isHeader && (
        el.tagName === 'PRE' ||
        el.tagName === 'FORM' ||
        (borderRad >= 8 && rect.width < window.innerWidth * 0.72 && rect.height < window.innerHeight * 0.75)
      );
      role = isPopup ? 'popup' : isSidebarItem ? 'sidebar-item' : isSidebar ? 'sidebar' : isHeader ? 'header' : isCard ? 'card' : 'canvas';
      el.setAttribute('data-qusa-role', role);
    }

    if (!shouldApply) {
      el.style.removeProperty('background-color');
      continue;
    }

    if (wpActive && (role === 'canvas' || role === 'sidebar-item')) {
      el.style.setProperty('background-color', 'transparent', 'important');
      continue;
    }

    const parts = origStr.split(',').map(Number);
    const origLum = (parts[0] + parts[1] + parts[2]) / 3;
    const origA = parts[3];

    let targetRgb = cfg.colorEnabled ? baseRgb : [18, 18, 18];
    let refLum = 18;
    if (cfg.colorEnabled && cfg.separateSidebar && (role === 'sidebar' || role === 'sidebar-item')) {
      targetRgb = sidebarRgb;
      refLum = 24;
    }

    const delta = (origLum - refLum) * (cfg.colorEnabled ? contrast : 1.0);
    const shifted = shiftRgb(targetRgb, delta);

    let outAlpha = origA;
    if (wpActive) {
      if (role === 'popup') {
        outAlpha = Math.max(0.92, pAlpha);
      } else {
        outAlpha = pAlpha;
      }
    }

    const colorVal = outAlpha < 1
      ? `rgba(${shifted[0]}, ${shifted[1]}, ${shifted[2]}, ${outAlpha})`
      : `rgb(${shifted[0]}, ${shifted[1]}, ${shifted[2]})`;
    el.style.setProperty('background-color', colorVal, 'important');
  }
}

// --- Reversible Text Transforms (Model Renaming + Russian Translation) ---

const origTextMap = new WeakMap();
const lastAppliedMap = new WeakMap();
let detectedAccountName = '';

const GREETING_PATTERNS = [
  // "Hey <name>, what are we building?" / "Hi <name>, ..."
  /^(\s*(?:Hey|Hi|Hello|Yo|Привет|Здорово)\s+)([^.!?,:\n]{1,40})([,!?.]\s*.*)$/i,
  // "Welcome back, <name>. ..." / "Good to see you, <name>. ..."
  /^(\s*(?:Welcome(?: back)?|Good (?:to see you|morning|afternoon|evening)|Hello|Hey|Hi|Nice to see you|Glad (?:you're|to see you) back|Ready(?: when you are)?|Back again|What(?:'s| is) on your mind|How can I help(?: you)?|Let(?:'s| us) (?:build|get started)|С возвращением|Привет|Рад видеть),\s*)([^.!?,:\n]{1,40})([.!?,\s]*.*)$/i,
];

function applyAccountNameToString(raw, customName, parentEl) {
  if (!raw || !customName) return raw;
  for (const re of GREETING_PATTERNS) {
    const m = raw.match(re);
    if (m) {
      if (!detectedAccountName && m[2]) detectedAccountName = m[2].trim();
      return `${m[1]}${customName}${m[3]}`;
    }
  }
  // Safe fallback for any other hero greeting: only replace a single-token handle right after a comma
  if (parentEl && (parentEl.matches('h1, h2, h3') || parseFloat(getComputedStyle(parentEl).fontSize) >= 20)) {
    const gm = raw.match(/^(\s*[A-Za-zА-Яа-яЁё'\s]{3,36},\s*)([^\s.!?,]{1,32})([.!?].*)$/);
    if (gm) {
      if (!detectedAccountName && gm[2]) detectedAccountName = gm[2].trim();
      return `${gm[1]}${customName}${gm[3]}`;
    }
  }
  if (detectedAccountName && raw.trim() === detectedAccountName) {
    return raw.replace(detectedAccountName, customName);
  }
  return raw;
}

function shouldSkipTextNode(el) {
  if (!el) return true;
  if (el.closest && el.closest('pre, code, .prose, [contenteditable="true"], [data-lexical-editor], [data-testid*="drag"], [data-qusa-skip], #qusa-theme-modal, #qusa-style-fab, #qusa-telemetry-bar, #qusa-anty')) {
    return true;
  }
  return false;
}

function getActiveModelPairs(cfg) {
  const map = cfg.modelRenames || {};
  return Object.entries(map)
    .map(([from, to]) => [String(from).trim(), String(to).trim()])
    .filter(([from, to]) => from.length > 0 && to.length > 0 && from !== to)
    .sort((a, b) => b[0].length - a[0].length);
}

function applyModelRenamesToString(raw, pairs) {
  if (!raw || pairs.length === 0) return raw;
  let out = raw;
  for (const [from, to] of pairs) {
    if (out.toLowerCase().includes(from.toLowerCase())) {
      out = out.replace(new RegExp(escapeRegExp(from), 'gi'), to);
    }
  }
  return out;
}

function translateTextValue(raw) {
  if (!raw) return raw;
  const trimmed = raw.trim();
  if (!trimmed || /^[a-z0-9-]+$/.test(trimmed)) return raw;
  if (RU_DICT[trimmed]) return raw.replace(trimmed, RU_DICT[trimmed]);
  const agoMatch = trimmed.match(/^(\d+)([mhd])\s+ago$/);
  if (agoMatch) {
    const unitMap = { m: 'м назад', h: 'ч назад', d: 'д назад' };
    return raw.replace(trimmed, `${agoMatch[1]}${unitMap[agoMatch[2]]}`);
  }
  if (trimmed.startsWith('Thought for ')) return raw.replace('Thought for ', 'Думал ');
  if (trimmed.startsWith('Running ')) return raw.replace('Running ', 'Выполняю: ');
  if (trimmed.startsWith('Ran ')) return raw.replace('Ran ', 'Выполнено: ');
  return raw;
}

function processSingleTextNode(node, cfg, pairs) {
  const parent = node.parentElement;
  if (!parent || shouldSkipTextNode(parent)) return;

  const cur = node.nodeValue || '';
  let base;
  if (origTextMap.has(node)) {
    if (cur !== lastAppliedMap.get(node)) {
      base = cur;
      origTextMap.set(node, base);
    } else {
      base = origTextMap.get(node);
    }
  } else {
    base = cur;
  }

  let result = base;
  const customAcc = (cfg.customAccountName || '').trim();
  if (customAcc) {
    result = applyAccountNameToString(result, customAcc, parent);
  }
  if (pairs.length > 0) {
    result = applyModelRenamesToString(result, pairs);
  }
  if (cfg.ruEnabled) {
    result = translateTextValue(result);
  }

  if (result !== base) {
    if (!origTextMap.has(node)) origTextMap.set(node, base);
    lastAppliedMap.set(node, result);
    if (cur !== result) node.nodeValue = result;
  } else if (origTextMap.has(node)) {
    origTextMap.delete(node);
    lastAppliedMap.delete(node);
    if (cur !== base) node.nodeValue = base;
  }
}

function processElementAttrs(el, cfg, pairs) {
  if (shouldSkipTextNode(el)) return;
  for (const attr of ['placeholder', 'aria-label', 'title']) {
    const dataAttr = `data-qusa-orig-${attr}`;
    const hasSaved = el.hasAttribute(dataAttr);
    const curVal = el.getAttribute(attr);
    if (!hasSaved && !curVal) continue;

    const base = hasSaved ? el.getAttribute(dataAttr) : curVal;
    let next = base || '';
    if (pairs.length > 0) {
      next = applyModelRenamesToString(next, pairs);
    }
    if (cfg.ruEnabled && RU_DICT[next.trim()]) {
      next = RU_DICT[next.trim()];
    }

    if (next !== base) {
      if (!hasSaved) el.setAttribute(dataAttr, base);
      if (curVal !== next) el.setAttribute(attr, next);
    } else if (hasSaved) {
      if (curVal !== base) el.setAttribute(attr, base);
      el.removeAttribute(dataAttr);
    }
  }
}

function applyTextTransforms(root, cfg) {
  if (!root) return;
  const el = root.nodeType === 1 ? root : root.parentElement;
  if (!el || shouldSkipTextNode(el)) return;
  const pairs = getActiveModelPairs(cfg);

  if (root.nodeType === Node.TEXT_NODE) {
    processSingleTextNode(root, cfg, pairs);
    return;
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let node = walker.currentNode;
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      processSingleTextNode(node, cfg, pairs);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      processElementAttrs(node, cfg, pairs);
    }
    node = walker.nextNode();
  }
}

// --- Settings UI ---

function createStyleUI(cfg) {
  if (!document.getElementById('qusa-style-fab')) {
    const fab = document.createElement('button');
    fab.id = 'qusa-style-fab';
    fab.type = 'button';
    fab.innerHTML = `<span id="qusa-fab-dot"></span><span>Стиль</span>`;
    if (cfg.fabLeft !== null && cfg.fabTop !== null) {
      fab.style.left = `${cfg.fabLeft}px`;
      fab.style.top = `${cfg.fabTop}px`;
      fab.style.right = 'auto';
    }
    let isDragging = false;
    let moved = false;
    let startX = 0, startY = 0, origLeft = 0, origTop = 0;
    fab.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      moved = false;
      const rect = fab.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      origLeft = rect.left;
      origTop = rect.top;
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      if (moved) {
        const nextLeft = Math.max(4, Math.min(window.innerWidth - fab.offsetWidth - 4, origLeft + dx));
        const nextTop = Math.max(4, Math.min(window.innerHeight - fab.offsetHeight - 4, origTop + dy));
        fab.style.left = `${nextLeft}px`;
        fab.style.top = `${nextTop}px`;
        fab.style.right = 'auto';
      }
    });
    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      if (moved) {
        const rect = fab.getBoundingClientRect();
        cfg.fabLeft = Math.round(rect.left);
        cfg.fabTop = Math.round(rect.top);
        saveConfig(cfg, true);
      }
    });
    fab.addEventListener('click', () => {
      if (moved) return;
      const modal = document.getElementById('qusa-theme-modal');
      if (modal) modal.classList.add('open');
    });
    document.body.appendChild(fab);
  }

  if (!document.getElementById('qusa-theme-modal')) {
    const modal = document.createElement('div');
    modal.id = 'qusa-theme-modal';
    modal.innerHTML = `
      <div class="qusa-modal-card">
        <div class="qusa-modal-header">
          <div class="qusa-modal-title">Настройка интерфейса Antigravity</div>
          <button class="qusa-close-btn" id="qusa-modal-close">Закрыть</button>
        </div>

        <div class="qusa-row" style="border-top:none;padding-top:0;">
          <span>Включить свой цвет</span>
          <input type="checkbox" id="qusa-color-enabled" />
        </div>

        <div class="qusa-field">
          <label><span>Основной цвет</span></label>
          <div class="qusa-color-row">
            <input type="color" id="qusa-base-picker" />
            <input type="text" class="qusa-input qusa-input-mono" id="qusa-base-hex" placeholder="#121212" />
          </div>
        </div>

        <div class="qusa-preset-grid" id="qusa-preset-grid"></div>

        <div class="qusa-row">
          <span>Отдельный цвет сайдбара</span>
          <input type="checkbox" id="qusa-sep-sidebar" />
        </div>

        <div class="qusa-field" id="qusa-sidebar-field" style="display:none;margin-top:6px;">
          <div class="qusa-color-row">
            <input type="color" id="qusa-sidebar-picker" />
            <input type="text" class="qusa-input qusa-input-mono" id="qusa-sidebar-hex" placeholder="#181818" />
          </div>
        </div>

        <div class="qusa-field" style="margin-top:8px;">
          <label><span>Контраст панелей и карточек</span><span id="qusa-contrast-val"></span></label>
          <input type="range" id="qusa-contrast-range" min="0" max="2" step="0.1" />
        </div>

        <details class="qusa-details" id="qusa-wp-details">
          <summary>Обои на задний фон (картинка / GIF / видео)</summary>
          <div class="qusa-wp-box">
            <div class="qusa-color-row">
              <button class="qusa-close-btn" id="qusa-wp-file-btn" type="button">Выбрать файл с ПК...</button>
              <button class="qusa-close-btn" id="qusa-wp-clear-btn" type="button">Убрать обои</button>
              <input type="file" id="qusa-wp-file-input" accept="image/*,video/mp4,video/webm" style="display:none;" />
            </div>
            <div class="qusa-wp-status" id="qusa-wp-status"></div>
            <div class="qusa-field" style="margin-bottom:0;">
              <label><span>Или прямая ссылка (URL: JPG / PNG / GIF / MP4)</span></label>
              <input type="text" class="qusa-input" id="qusa-wp-url" placeholder="https://..." />
            </div>
            <div class="qusa-field" style="margin-bottom:0;">
              <label><span>Затемнение обоев</span><span id="qusa-wp-dim-val"></span></label>
              <input type="range" id="qusa-wp-dim-range" min="0" max="0.92" step="0.02" />
            </div>
            <div class="qusa-field" style="margin-bottom:0;">
              <label><span>Прозрачность панелей поверх обоев</span><span id="qusa-wp-alpha-val"></span></label>
              <input type="range" id="qusa-wp-alpha-range" min="0.10" max="0.95" step="0.02" />
            </div>
            <div class="qusa-field" style="margin-bottom:0;">
              <label><span>Размытие обоев (Blur)</span><span id="qusa-wp-blur-val"></span></label>
              <input type="range" id="qusa-wp-blur-range" min="0" max="20" step="1" />
            </div>
          </div>
        </details>

        <div class="qusa-row">
          <span>Перевод интерфейса на русский</span>
          <input type="checkbox" id="qusa-ru-toggle" />
        </div>

        <div class="qusa-row">
          <span>Скрыть кнопку «Стиль»</span>
          <input type="checkbox" id="qusa-fab-hidden-toggle" />
        </div>

        <div class="qusa-field" style="padding-top:4px;">
          <label><span>Клавиша показа / скрытия кнопки «Стиль»</span></label>
          <div class="qusa-color-row">
            <button class="qusa-close-btn" id="qusa-hotkey-btn" type="button" style="flex:1;text-align:left;"></button>
            <button class="qusa-close-btn" id="qusa-hotkey-reset-btn" type="button">Alt+S</button>
          </div>
        </div>

        <div class="qusa-field" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:10px;margin-top:4px;">
          <label><span>Имя аккаунта в главном меню (визуально)</span></label>
          <div class="qusa-color-row">
            <input type="text" class="qusa-input" id="qusa-account-name" placeholder="Оставить оригинальное..." />
            <button class="qusa-close-btn" id="qusa-account-reset-btn" type="button">Вернуть</button>
          </div>
        </div>

        <details class="qusa-details" id="qusa-anty-details">
          <summary>Маскот Anty (сидит на промпте и гуляет)</summary>
          <div class="qusa-wp-box">
            <div class="qusa-row" style="border-top:none;padding-top:0;">
              <span>Включить маскота Anty</span>
              <input type="checkbox" id="qusa-anty-toggle" />
            </div>
            <div class="qusa-row">
              <span>Гулять по интерфейсу</span>
              <input type="checkbox" id="qusa-anty-roam-toggle" />
            </div>
            <div class="qusa-field" style="margin-bottom:0;">
              <label><span>Размер Anty</span><span id="qusa-anty-size-val"></span></label>
              <input type="range" id="qusa-anty-size-range" min="36" max="96" step="2" />
            </div>
          </div>
        </details>

        <details class="qusa-details" id="qusa-models-details">
          <summary>Переименование моделей (визуально)</summary>
          <div class="qusa-models-list" id="qusa-models-list"></div>
          <div class="qusa-custom-add">
            <input type="text" class="qusa-input" id="qusa-custom-from" placeholder="Оригинал (напр. Gemini 4 ...)" />
            <input type="text" class="qusa-input" id="qusa-custom-to" placeholder="Новое название" />
            <button class="qusa-close-btn" id="qusa-custom-add-btn" type="button">+</button>
          </div>
        </details>

        <div class="qusa-footer">
          <button class="qusa-close-btn" id="qusa-reset-models-btn" type="button">Сбросить имена</button>
          <button class="qusa-close-btn" id="qusa-reset-btn" type="button">Сбросить цвет</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
    document.getElementById('qusa-modal-close').addEventListener('click', () => {
      modal.classList.remove('open');
    });

    const colorEnabledEl = document.getElementById('qusa-color-enabled');
    const basePicker = document.getElementById('qusa-base-picker');
    const baseHex = document.getElementById('qusa-base-hex');
    const sepSidebarEl = document.getElementById('qusa-sep-sidebar');
    const sidebarField = document.getElementById('qusa-sidebar-field');
    const sidebarPicker = document.getElementById('qusa-sidebar-picker');
    const sidebarHex = document.getElementById('qusa-sidebar-hex');
    const contrastRange = document.getElementById('qusa-contrast-range');
    const contrastVal = document.getElementById('qusa-contrast-val');
    const wpFileBtn = document.getElementById('qusa-wp-file-btn');
    const wpFileInput = document.getElementById('qusa-wp-file-input');
    const wpClearBtn = document.getElementById('qusa-wp-clear-btn');
    const wpStatus = document.getElementById('qusa-wp-status');
    const wpUrl = document.getElementById('qusa-wp-url');
    const wpDimRange = document.getElementById('qusa-wp-dim-range');
    const wpDimVal = document.getElementById('qusa-wp-dim-val');
    const wpAlphaRange = document.getElementById('qusa-wp-alpha-range');
    const wpAlphaVal = document.getElementById('qusa-wp-alpha-val');
    const wpBlurRange = document.getElementById('qusa-wp-blur-range');
    const wpBlurVal = document.getElementById('qusa-wp-blur-val');
    const ruToggle = document.getElementById('qusa-ru-toggle');
    const fabHiddenToggle = document.getElementById('qusa-fab-hidden-toggle');
    const hotkeyBtn = document.getElementById('qusa-hotkey-btn');
    const hotkeyResetBtn = document.getElementById('qusa-hotkey-reset-btn');
    const accountNameInput = document.getElementById('qusa-account-name');
    const accountResetBtn = document.getElementById('qusa-account-reset-btn');
    const antyToggle = document.getElementById('qusa-anty-toggle');
    const antyRoamToggle = document.getElementById('qusa-anty-roam-toggle');
    const antySizeRange = document.getElementById('qusa-anty-size-range');
    const antySizeVal = document.getElementById('qusa-anty-size-val');
    const resetBtn = document.getElementById('qusa-reset-btn');
    const resetModelsBtn = document.getElementById('qusa-reset-models-btn');
    const customFrom = document.getElementById('qusa-custom-from');
    const customTo = document.getElementById('qusa-custom-to');
    const customAddBtn = document.getElementById('qusa-custom-add-btn');

    const updateWpStatusText = () => {
      if (cfg.wallpaperUrl && cfg.wallpaperUrl.trim()) {
        wpStatus.textContent = `Активна ссылка: ${cfg.wallpaperUrl.trim()}`;
      } else if (activeLocalBlobUrl) {
        wpStatus.textContent = `Активен файл: ${cfg.wallpaperLocalName || 'локальные обои'}`;
      } else {
        wpStatus.textContent = 'Обои не выбраны (сплошной цвет)';
      }
    };

    const applyAll = (immediate = false) => {
      saveConfig(cfg, immediate);
      injectStyles(cfg);
      updateWallpaperLayer(cfg);
      applySurfaceColors(cfg);
      updateWpStatusText();
    };

    const renderModelsList = () => {
      const list = document.getElementById('qusa-models-list');
      list.innerHTML = '';
      const allKeys = [...KNOWN_MODELS];
      for (const k of Object.keys(cfg.modelRenames || {})) {
        if (!allKeys.includes(k)) allKeys.push(k);
      }
      for (const origName of allKeys) {
        const row = document.createElement('div');
        row.className = 'qusa-model-row';

        const label = document.createElement('span');
        label.className = 'qusa-model-orig';
        label.textContent = origName;
        label.title = origName;

        const inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'qusa-input';
        inp.placeholder = origName;
        inp.value = (cfg.modelRenames && cfg.modelRenames[origName]) || '';
        inp.addEventListener('input', () => {
          const v = inp.value.trim();
          if (v) {
            cfg.modelRenames[origName] = v;
          } else {
            delete cfg.modelRenames[origName];
          }
          saveConfig(cfg, false);
          applyTextTransforms(document.body, cfg);
        });

        row.appendChild(label);
        row.appendChild(inp);

        if (!KNOWN_MODELS.includes(origName)) {
          const del = document.createElement('button');
          del.type = 'button';
          del.className = 'qusa-close-btn';
          del.textContent = '×';
          del.addEventListener('click', () => {
            delete cfg.modelRenames[origName];
            saveConfig(cfg, true);
            renderModelsList();
            applyTextTransforms(document.body, cfg);
          });
          row.appendChild(del);
        }
        list.appendChild(row);
      }
    };

    const renderPresets = () => {
      const grid = document.getElementById('qusa-preset-grid');
      grid.innerHTML = '';
      for (const p of PRESETS) {
        const btn = document.createElement('div');
        btn.className = 'qusa-preset-item' + (cfg.baseColor.toLowerCase() === p.color.toLowerCase() ? ' active' : '');
        btn.innerHTML = `<span class="qusa-swatch" style="background:${p.color}"></span><span>${p.name}</span>`;
        btn.addEventListener('click', () => {
          cfg.colorEnabled = true;
          cfg.baseColor = p.color;
          syncControls();
          applyAll(true);
        });
        grid.appendChild(btn);
      }
    };

    const syncControls = () => {
      colorEnabledEl.checked = Boolean(cfg.colorEnabled);
      basePicker.value = cfg.baseColor;
      baseHex.value = cfg.baseColor;
      sepSidebarEl.checked = Boolean(cfg.separateSidebar);
      sidebarField.style.display = cfg.separateSidebar ? 'block' : 'none';
      sidebarPicker.value = cfg.sidebarColor;
      sidebarHex.value = cfg.sidebarColor;
      contrastRange.value = String(cfg.panelContrast);
      contrastVal.textContent = `${Math.round(cfg.panelContrast * 100)}%`;
      wpUrl.value = cfg.wallpaperUrl || '';
      wpDimRange.value = String(cfg.wallpaperDim ?? 0.42);
      wpDimVal.textContent = `${Math.round((cfg.wallpaperDim ?? 0.42) * 100)}%`;
      wpAlphaRange.value = String(cfg.panelAlpha ?? 0.68);
      wpAlphaVal.textContent = `${Math.round((cfg.panelAlpha ?? 0.68) * 100)}%`;
      wpBlurRange.value = String(cfg.wallpaperBlur || 0);
      wpBlurVal.textContent = `${cfg.wallpaperBlur || 0}px`;
      ruToggle.checked = Boolean(cfg.ruEnabled);
      fabHiddenToggle.checked = Boolean(cfg.fabHidden);
      hotkeyBtn.textContent = formatHotkey(cfg.fabHotkey || 'Alt+KeyS');
      accountNameInput.value = cfg.customAccountName || '';
      antyToggle.checked = cfg.antyEnabled !== false;
      antyRoamToggle.checked = cfg.antyRoam !== false;
      antySizeRange.value = String(cfg.antySize || 58);
      antySizeVal.textContent = `${cfg.antySize || 58}px`;
      renderPresets();
      renderModelsList();
      updateWpStatusText();
    };

    syncControls();
    window.__qusaSyncWpStatus = updateWpStatusText;

    colorEnabledEl.addEventListener('change', () => {
      cfg.colorEnabled = colorEnabledEl.checked;
      applyAll(true);
    });

    basePicker.addEventListener('input', () => {
      cfg.colorEnabled = true;
      cfg.baseColor = basePicker.value;
      colorEnabledEl.checked = true;
      baseHex.value = cfg.baseColor;
      renderPresets();
      applyAll(false);
    });

    baseHex.addEventListener('change', () => {
      let val = baseHex.value.trim();
      if (!val.startsWith('#')) val = '#' + val;
      if (hexToRgb(val)) {
        cfg.colorEnabled = true;
        cfg.baseColor = val;
        syncControls();
        applyAll(true);
      } else {
        baseHex.value = cfg.baseColor;
      }
    });

    sepSidebarEl.addEventListener('change', () => {
      cfg.separateSidebar = sepSidebarEl.checked;
      sidebarField.style.display = cfg.separateSidebar ? 'block' : 'none';
      applyAll(true);
    });

    sidebarPicker.addEventListener('input', () => {
      cfg.sidebarColor = sidebarPicker.value;
      sidebarHex.value = cfg.sidebarColor;
      applyAll(false);
    });

    sidebarHex.addEventListener('change', () => {
      let val = sidebarHex.value.trim();
      if (!val.startsWith('#')) val = '#' + val;
      if (hexToRgb(val)) {
        cfg.sidebarColor = val;
        sidebarPicker.value = val;
        applyAll(true);
      } else {
        sidebarHex.value = cfg.sidebarColor;
      }
    });

    contrastRange.addEventListener('input', () => {
      cfg.panelContrast = parseFloat(contrastRange.value);
      contrastVal.textContent = `${Math.round(cfg.panelContrast * 100)}%`;
      applyAll(false);
    });

    wpFileBtn.addEventListener('click', () => wpFileInput.click());

    wpFileInput.addEventListener('change', async () => {
      const file = wpFileInput.files && wpFileInput.files[0];
      if (!file) return;
      try {
        await saveLocalWallpaper(file);
        if (activeLocalBlobUrl) URL.revokeObjectURL(activeLocalBlobUrl);
        activeLocalBlobUrl = URL.createObjectURL(file);
        activeLocalMime = file.type || '';
        cfg.wallpaperLocalName = file.name;
        cfg.wallpaperUrl = '';
        wpUrl.value = '';
        applyAll(true);
      } catch (err) {
        console.error('[Qusa] Failed to save wallpaper:', err);
      }
      wpFileInput.value = '';
    });

    wpClearBtn.addEventListener('click', async () => {
      cfg.wallpaperUrl = '';
      cfg.wallpaperLocalName = '';
      wpUrl.value = '';
      await clearLocalWallpaper();
      applyAll(true);
    });

    wpUrl.addEventListener('change', () => {
      cfg.wallpaperUrl = wpUrl.value.trim();
      applyAll(true);
    });

    wpDimRange.addEventListener('input', () => {
      cfg.wallpaperDim = parseFloat(wpDimRange.value);
      wpDimVal.textContent = `${Math.round(cfg.wallpaperDim * 100)}%`;
      applyAll(false);
    });

    wpAlphaRange.addEventListener('input', () => {
      cfg.panelAlpha = parseFloat(wpAlphaRange.value);
      wpAlphaVal.textContent = `${Math.round(cfg.panelAlpha * 100)}%`;
      applyAll(false);
    });

    wpBlurRange.addEventListener('input', () => {
      cfg.wallpaperBlur = parseInt(wpBlurRange.value, 10);
      wpBlurVal.textContent = `${cfg.wallpaperBlur}px`;
      applyAll(false);
    });

    ruToggle.addEventListener('change', () => {
      cfg.ruEnabled = ruToggle.checked;
      saveConfig(cfg, true);
      applyTextTransforms(document.body, cfg);
    });

    fabHiddenToggle.addEventListener('change', () => {
      cfg.fabHidden = fabHiddenToggle.checked;
      applyAll(true);
    });

    let recordingHotkey = false;
    hotkeyBtn.addEventListener('click', () => {
      recordingHotkey = true;
      hotkeyBtn.textContent = 'Нажмите клавишу или комбинацию... (Esc — отмена)';
    });

    hotkeyResetBtn.addEventListener('click', () => {
      recordingHotkey = false;
      cfg.fabHotkey = 'Alt+KeyS';
      hotkeyBtn.textContent = formatHotkey(cfg.fabHotkey);
      saveConfig(cfg, true);
    });

    window.addEventListener('keydown', (e) => {
      if (recordingHotkey) {
        e.preventDefault();
        e.stopPropagation();
        if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;
        if (e.code === 'Escape') {
          recordingHotkey = false;
          hotkeyBtn.textContent = formatHotkey(cfg.fabHotkey || 'Alt+KeyS');
          return;
        }
        const combo = eventToHotkey(e);
        if (combo) {
          cfg.fabHotkey = combo;
          saveConfig(cfg, true);
        }
        recordingHotkey = false;
        hotkeyBtn.textContent = formatHotkey(cfg.fabHotkey || 'Alt+KeyS');
        return;
      }

      const targetHotkey = cfg.fabHotkey || 'Alt+KeyS';
      if (!targetHotkey) return;
      const curCombo = eventToHotkey(e);
      if (curCombo !== targetHotkey) return;

      const hasModifier = e.ctrlKey || e.altKey || e.metaKey;
      const isFuncKey = /^F\d{1,2}$/.test(e.code || '');
      const activeEl = document.activeElement;
      const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
      if (isTyping && !hasModifier && !isFuncKey) return;

      e.preventDefault();
      cfg.fabHidden = !cfg.fabHidden;
      fabHiddenToggle.checked = Boolean(cfg.fabHidden);
      applyAll(true);
    }, true);

    accountNameInput.addEventListener('input', () => {
      cfg.customAccountName = accountNameInput.value.trim();
      saveConfig(cfg, false);
      applyTextTransforms(document.body, cfg);
    });

    accountResetBtn.addEventListener('click', () => {
      cfg.customAccountName = '';
      accountNameInput.value = '';
      saveConfig(cfg, true);
      applyTextTransforms(document.body, cfg);
    });

    antyToggle.addEventListener('change', () => {
      cfg.antyEnabled = antyToggle.checked;
      applyAll(true);
      if (window.__qusaUpdateAnty) window.__qusaUpdateAnty(cfg);
    });

    antyRoamToggle.addEventListener('change', () => {
      cfg.antyRoam = antyRoamToggle.checked;
      saveConfig(cfg, true);
      if (window.__qusaUpdateAnty) window.__qusaUpdateAnty(cfg);
    });

    antySizeRange.addEventListener('input', () => {
      cfg.antySize = parseInt(antySizeRange.value, 10);
      antySizeVal.textContent = `${cfg.antySize}px`;
      applyAll(false);
      if (window.__qusaUpdateAnty) window.__qusaUpdateAnty(cfg);
    });

    customAddBtn.addEventListener('click', () => {
      const from = customFrom.value.trim();
      const to = customTo.value.trim();
      if (!from || !to) return;
      cfg.modelRenames[from] = to;
      customFrom.value = '';
      customTo.value = '';
      saveConfig(cfg, true);
      renderModelsList();
      applyTextTransforms(document.body, cfg);
    });

    resetModelsBtn.addEventListener('click', () => {
      cfg.modelRenames = {};
      saveConfig(cfg, true);
      renderModelsList();
      applyTextTransforms(document.body, cfg);
    });

    resetBtn.addEventListener('click', () => {
      cfg.colorEnabled = true;
      cfg.baseColor = DEFAULT_CONFIG.baseColor;
      cfg.separateSidebar = false;
      cfg.sidebarColor = DEFAULT_CONFIG.sidebarColor;
      cfg.panelContrast = 1.0;
      syncControls();
      applyAll(true);
    });
  }
}

// --- Anty Mascot (Clawd-style animated companion) ---

const ANTY_SVGS = {
  idle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" shape-rendering="crispEdges"><defs><linearGradient id="anty-acc-idle" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b66cff"/><stop offset="1" stop-color="#55d9ff"/></linearGradient><linearGradient id="anty-ear-idle" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a86bff"/><stop offset="1" stop-color="#78cfff"/></linearGradient></defs><path d="M166 174h22v-10h18v10h10v18h-10v18h-18v10h-20v-10h-10v-18h10z" fill="#242131" stroke="#090812" stroke-width="6"/><path d="M184 178h18v12h-10v16h-14v-12h6z" fill="url(#anty-acc-idle)"/><path d="M63 83V43h22V29h22v14h20v-9h22v12h22v37h13v45h-13v22h-18v13H79v-13H61v-22H48V96h15z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M73 76V48h14v-9h12v20h12v17z" fill="url(#anty-ear-idle)"/><path d="M143 76V59h12V39h13v10h12v27z" fill="url(#anty-ear-idle)"/><path d="M76 101h104v42h-13v13H88v-13H76z" fill="#090812"/><rect x="99" y="112" width="9" height="20" fill="#b98aff"/><rect x="148" y="112" width="9" height="20" fill="#8bdcff"/><path d="M79 158h98v18h18v53h-20v12H81v-12H61v-53h18z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M103 159h50v17h-10v18h-30v-18h-10z" fill="#171522" stroke="#090812" stroke-width="5"/><path d="M116 198h12v-10h10v10h12v10h-12v10h-10v-10h-12z" fill="url(#anty-acc-idle)"/><path d="M68 178H53v39h15v10h20v-18H78v-20H68zM177 178h15v39h-15v10h-20v-18h10v-20h10z" fill="#242131" stroke="#090812" stroke-width="6"/><path d="M88 220h28v18H82v-8h6zM143 220h28v18h-34v-8h6z" fill="#242131" stroke="#090812" stroke-width="6"/></svg>`,
  walking: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" shape-rendering="crispEdges"><defs><linearGradient id="anty-acc-walk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b66cff"/><stop offset="1" stop-color="#55d9ff"/></linearGradient><linearGradient id="anty-ear-walk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a86bff"/><stop offset="1" stop-color="#78cfff"/></linearGradient></defs><g class="anty-tail"><path d="M166 174h22v-10h18v10h10v18h-10v18h-18v10h-20v-10h-10v-18h10z" fill="#242131" stroke="#090812" stroke-width="6"/><path d="M184 178h18v12h-10v16h-14v-12h6z" fill="url(#anty-acc-walk)"/></g><g class="anty-leg-l"><path d="M88 220h28v18H82v-8h6z" fill="#242131" stroke="#090812" stroke-width="6"/></g><g class="anty-leg-r"><path d="M143 220h28v18h-34v-8h6z" fill="#242131" stroke="#090812" stroke-width="6"/></g><path d="M63 83V43h22V29h22v14h20v-9h22v12h22v37h13v45h-13v22h-18v13H79v-13H61v-22H48V96h15z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M73 76V48h14v-9h12v20h12v17z" fill="url(#anty-ear-walk)"/><path d="M143 76V59h12V39h13v10h12v27z" fill="url(#anty-ear-walk)"/><path d="M76 101h104v42h-13v13H88v-13H76z" fill="#090812"/><rect x="99" y="112" width="9" height="20" fill="#b98aff"/><rect x="148" y="112" width="9" height="20" fill="#8bdcff"/><path d="M79 158h98v18h18v53h-20v12H81v-12H61v-53h18z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M103 159h50v17h-10v18h-30v-18h-10z" fill="#171522" stroke="#090812" stroke-width="5"/><path d="M116 198h12v-10h10v10h12v10h-12v10h-10v-10h-12z" fill="url(#anty-acc-walk)"/><g class="anty-arm-l"><path d="M68 178H53v39h15v10h20v-18H78v-20H68z" fill="#242131" stroke="#090812" stroke-width="6"/></g><g class="anty-arm-r"><path d="M177 178h15v39h-15v10h-20v-18h10v-20h10z" fill="#242131" stroke="#090812" stroke-width="6"/></g></svg>`,
  sleeping: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" shape-rendering="crispEdges"><defs><linearGradient id="anty-acc-sleep" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b66cff"/><stop offset="1" stop-color="#55d9ff"/></linearGradient><linearGradient id="anty-ear-sleep" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a86bff"/><stop offset="1" stop-color="#78cfff"/></linearGradient></defs><path d="M163 174h22v-12h18v12h13v19h-10v20h-18v10h-25v-10h-12v-20h12z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M181 178h18v13h-10v16h-17v-12h9z" fill="url(#anty-acc-sleep)"/><path d="M71 164h104v18h20v34h-15v16H84v-10H64v-38h7z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M65 103V65h20V48h24v17h39V48h24v17h18v38h13v40h-16v15H68v-15H52v-40z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M77 91V69h13V57h12v34zM157 91V57h12v12h13v22z" fill="url(#anty-ear-sleep)"/><path d="M92 122h16v8H92zM145 122h16v8h-16z" fill="#b98aff"/><path d="M119 139h10v8h-10z" fill="#8bdcff"/><path d="M76 180h32v17H91v10H76zM143 180h32v17h-17v10h-15z" fill="#171522" stroke="#090812" stroke-width="5"/><path d="M193 54h20v7h-11v7h11v7h-20v-7h11v-7h-11z" fill="url(#anty-acc-sleep)"/><path d="M215 34h13v5h-7v5h7v5h-13v-5h7v-5h-7z" fill="#b98aff"/></svg>`,
  working: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" shape-rendering="crispEdges"><defs><linearGradient id="anty-acc-work" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b66cff"/><stop offset="1" stop-color="#55d9ff"/></linearGradient><linearGradient id="anty-ear-work" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a86bff"/><stop offset="1" stop-color="#78cfff"/></linearGradient></defs><path d="M174 177h18v-10h17v10h12v19h-12v17h-18v10h-20v-10h-9v-19h12z" fill="#242131" stroke="#090812" stroke-width="6"/><path d="M189 180h14v13h-8v15h-13v-12h7z" fill="url(#anty-acc-work)"/><path d="M74 156h104v18h16v44h-17v15H81v-12H63v-47h11z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M67 91V54h21V38h22v16h40V38h23v16h17v37h13v40h-15v17H69v-17H53V91z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M79 81V59h13V47h12v34zM157 81V47h12v12h13v22z" fill="url(#anty-ear-work)"/><rect x="91" y="103" width="10" height="20" fill="#b98aff"/><rect x="151" y="103" width="10" height="20" fill="#8bdcff"/><path d="M91 158h93v57H91z" fill="#11101a" stroke="#090812" stroke-width="7"/><path d="M99 166h77v40H99z" fill="#29243d"/><path d="M125 179h12v-8h10v8h12v9h-12v9h-10v-9h-12z" fill="url(#anty-acc-work)"/><path d="M78 216h122l-10 12H89z" fill="#38334b" stroke="#090812" stroke-width="5"/><path d="M81 198h22v15H88v8H75v-14h6zM173 198h22v15h-15v8h-13v-14h6z" fill="#242131" stroke="#090812" stroke-width="5"/><path d="M38 73h10v10H38zM28 83h10v10H28zM213 67h10v10h-10zM223 57h10v10h-10z" fill="url(#anty-acc-work)"/></svg>`,
  asking: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" shape-rendering="crispEdges"><defs><linearGradient id="anty-acc-ask" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b66cff"/><stop offset="1" stop-color="#55d9ff"/></linearGradient><linearGradient id="anty-ear-ask" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a86bff"/><stop offset="1" stop-color="#78cfff"/></linearGradient></defs><path d="M65 102V64h20V47h24v17h39V47h24v17h18v38h13v40h-16v15H68v-15H52v-40z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M77 91V68h13V56h12v35zM157 91V56h12v12h13v23z" fill="url(#anty-ear-ask)"/><rect x="91" y="111" width="10" height="19" fill="#b98aff"/><rect x="151" y="111" width="10" height="19" fill="#8bdcff"/><path d="M118 139h19v8h-19z" fill="#090812"/><path d="M78 158h100v18h18v48h-20v12H81v-12H61v-48h17z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M112 180h32v11h-10v14h-12v-14h-10z" fill="url(#anty-acc-ask)"/><path d="M61 176h19v15h10v18H70v-9H57v-16h4zM176 176h19v8h5v16h-13v9h-20v-18h9z" fill="#242131" stroke="#090812" stroke-width="6"/><path d="M186 23h48v39h-15v14h-15V62h-18z" fill="#171522" stroke="#090812" stroke-width="6"/><path d="M201 36h18v8h-8v7h-10v-8h8v-2h-8zM205 54h10v7h-10z" fill="url(#anty-acc-ask)"/></svg>`,
  completed: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" shape-rendering="crispEdges"><defs><linearGradient id="anty-acc-done" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b66cff"/><stop offset="1" stop-color="#55d9ff"/></linearGradient><linearGradient id="anty-ear-done" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a86bff"/><stop offset="1" stop-color="#78cfff"/></linearGradient></defs><path d="M190 47h12V35h18v12h12v18h-12v12h-18V65h-12z" fill="#ff75bd" stroke="#090812" stroke-width="5"/><path d="M201 48h8v-6h7v8h8v8h-8v8h-7v-8h-8z" fill="#ffc0e1"/><path d="M165 178h20v-10h18v10h12v19h-12v18h-18v10h-20v-10h-10v-19h10z" fill="#242131" stroke="#090812" stroke-width="6"/><path d="M184 181h15v13h-9v14h-14v-12h8z" fill="url(#anty-acc-done)"/><path d="M79 157h99v18h18v44h-20v14H84v-12H63v-46h16z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M65 95V58h20V42h24v16h39V42h24v16h18v37h13v40h-16v16H68v-16H52V95z" fill="#242131" stroke="#090812" stroke-width="7"/><path d="M77 84V62h13V50h12v34zM157 84V50h12v12h13v22z" fill="url(#anty-ear-done)"/><path d="M91 111h10v7h10v8H99v-7h-8zM145 126h-10v-8h10v-7h10v8h-10z" fill="#b98aff"/><path d="M91 174h28v16h-10v12H91zM137 174h28v28h-18v-12h-10z" fill="#171522" stroke="#090812" stroke-width="5"/></svg>`,
};

function initAntyMascot(cfg) {
  if (document.getElementById('qusa-anty')) return;

  const root = document.createElement('div');
  root.id = 'qusa-anty';
  root.setAttribute('data-state', 'idle');
  root.setAttribute('data-dir', 'right');
  root.title = 'Anty (клик — погладить, перетащить — переместить, двойной клик — вернуть на промпт)';
  root.innerHTML = `<div id="qusa-anty-bubble"></div><div id="qusa-anty-flip"><div id="qusa-anty-sprite">${ANTY_SVGS.idle}</div></div>`;
  document.body.appendChild(root);

  const spriteEl = document.getElementById('qusa-anty-sprite');
  const bubbleEl = document.getElementById('qusa-anty-bubble');

  let curState = 'idle';
  let curSvgKey = 'idle';
  let posX = window.innerWidth * 0.6;
  let posY = window.innerHeight - 160;
  let targetX = posX;
  let targetY = posY;
  let mode = 'perch'; // 'perch' | 'roam' | 'pinned'
  let perchRatio = 0.78;
  let isWalking = false;
  let isDragging = false;
  let dragMoved = false;
  let lastActivityTs = Date.now();
  let typingUntilTs = 0;
  let celebrateUntilTs = 0;
  let pettingUntilTs = 0;
  let hoverStartTs = 0;
  let isHovered = false;
  let lastPetX = 0;
  let lastPetDir = 0;
  let petDistance = 0;
  let petReversals = 0;
  let lastHeartTs = 0;
  let wasWorking = false;
  let nextActionTs = Date.now() + 9000;
  let roamReturnTs = 0;
  let bubbleTimer = null;

  const getSize = () => Number(cfg.antySize || 58);

  const setBubble = (text, ms = 2200) => {
    if (!bubbleEl) return;
    bubbleEl.textContent = text;
    bubbleEl.classList.add('show');
    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => {
      bubbleEl.classList.remove('show');
    }, ms);
  };
  window.__qusaSay = setBubble;

  const setState = (state, svgKey) => {
    if (curState !== state) {
      curState = state;
      root.setAttribute('data-state', state);
    }
    const key = svgKey || state;
    if (curSvgKey !== key && ANTY_SVGS[key]) {
      curSvgKey = key;
      spriteEl.innerHTML = ANTY_SVGS[key];
    }
  };

  const getComposerRect = () => {
    const editors = document.querySelectorAll('[contenteditable="true"], textarea');
    let editor = null;
    for (const ed of editors) {
      if (ed.closest('#qusa-theme-modal')) continue;
      const r = ed.getBoundingClientRect();
      if (r.width >= 150 && r.height >= 16) {
        editor = ed;
        break;
      }
    }
    if (!editor) return null;
    let cur = editor;
    let best = null;
    for (let i = 0; i < 8 && cur && cur !== document.body; i++) {
      const r = cur.getBoundingClientRect();
      if (r.width >= 260 && r.width <= window.innerWidth * 0.92 && r.height >= 44 && r.height <= 340) {
        const cs = getComputedStyle(cur);
        const br = parseFloat(cs.borderRadius) || 0;
        if (cur.tagName === 'FORM' || br >= 10 || (cs.borderTopWidth && parseFloat(cs.borderTopWidth) >= 1)) {
          best = r;
        }
      }
      cur = cur.parentElement;
    }
    return best || editor.getBoundingClientRect();
  };

  const getPerchPoint = (ratio) => {
    const sz = getSize();
    const cr = getComposerRect();
    if (!cr) {
      return {
        x: clamp(window.innerWidth - sz - 36, 16, window.innerWidth - sz - 16),
        y: clamp(window.innerHeight - sz - 24, 48, window.innerHeight - sz - 8),
      };
    }
    const pad = 16;
    const minX = cr.left + pad;
    const maxX = Math.max(minX, cr.right - sz - pad);
    const x = minX + (maxX - minX) * clamp(ratio, 0, 1);
    const y = Math.max(44, cr.top - sz + Math.round(sz * 0.14));
    return { x, y };
  };

  const placeAt = (x, y) => {
    const sz = getSize();
    posX = clamp(x, 6, Math.max(6, window.innerWidth - sz - 6));
    posY = clamp(y, 40, Math.max(40, window.innerHeight - sz - 4));
    root.style.left = `${Math.round(posX)}px`;
    root.style.top = `${Math.round(posY)}px`;
  };

  const snapToPerch = () => {
    const p = getPerchPoint(perchRatio);
    targetX = p.x;
    targetY = p.y;
    placeAt(p.x, p.y);
  };

  const isAgentWorking = () => {
    return Boolean(document.querySelector('[aria-label*="Stop"], button[title*="Stop"], [aria-label*="Cancel generation"]'));
  };

  // Drag & pet interaction
  let startMX = 0, startMY = 0, origX = 0, origY = 0;
  root.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    dragMoved = false;
    startMX = e.clientX;
    startMY = e.clientY;
    origX = posX;
    origY = posY;
    lastActivityTs = Date.now();
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startMX;
    const dy = e.clientY - startMY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragMoved = true;
    if (dragMoved) {
      mode = 'pinned';
      isWalking = false;
      placeAt(origX + dx, origY + dy);
      targetX = posX;
      targetY = posY;
    }
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    if (dragMoved) {
      // If dropped close to composer top edge, re-attach to perch
      const cr = getComposerRect();
      const sz = getSize();
      if (cr && posX >= cr.left - 30 && posX <= cr.right + 30 && Math.abs((posY + sz) - cr.top) < 70) {
        mode = 'perch';
        const span = Math.max(1, cr.width - sz - 32);
        perchRatio = clamp((posX - (cr.left + 16)) / span, 0, 1);
      } else {
        roamReturnTs = Date.now() + 25000;
      }
    }
  });

  const PET_LINES = ['♥', 'Anty!', 'мур~', '✨', 'готов помочь!', '⚡'];
  const PURR_LINES = ['мур~ ♥', 'приятно~', 'муррр ♥', 'ещё! ♥', 'хехе ♥'];

  const spawnHeart = (relX) => {
    const h = document.createElement('span');
    h.className = 'qusa-anty-heart';
    h.textContent = Math.random() < 0.75 ? '♥' : '✨';
    const xPct = clamp(relX, 18, 82);
    h.style.left = `${xPct}%`;
    h.style.top = '4px';
    root.appendChild(h);
    setTimeout(() => h.remove(), 980);
  };

  let hoverLeaveTimer = null;

  root.addEventListener('pointerenter', (e) => {
    if (hoverLeaveTimer) {
      clearTimeout(hoverLeaveTimer);
      hoverLeaveTimer = null;
    }
    if (!isHovered) {
      isHovered = true;
      if (!hoverStartTs) hoverStartTs = Date.now();
      lastPetX = e.clientX;
      lastPetDir = 0;
      petDistance = 0;
      petReversals = 0;
    }
    // Pause walking immediately so Anty stays under your cursor
    if (isWalking) {
      targetX = posX;
      targetY = posY;
      isWalking = false;
    }
  });

  root.addEventListener('pointerleave', () => {
    isHovered = false;
    // Grace period so rubbing slightly past Anty's 58px edge doesn't reset the 2s timer
    if (hoverLeaveTimer) clearTimeout(hoverLeaveTimer);
    hoverLeaveTimer = setTimeout(() => {
      hoverLeaveTimer = null;
      if (!isHovered) {
        hoverStartTs = 0;
        petDistance = 0;
        petReversals = 0;
      }
    }, 900);
  });

  window.addEventListener('pointermove', (e) => {
    if (isDragging || cfg.antyEnabled === false) return;
    const r = root.getBoundingClientRect();
    const pad = 22;
    const nearAnty = e.clientX >= r.left - pad && e.clientX <= r.right + pad && e.clientY >= r.top - pad && e.clientY <= r.bottom + pad;
    if (!isHovered && !nearAnty) return;

    const now = Date.now();
    if (!hoverStartTs) {
      hoverStartTs = now;
      lastPetX = e.clientX;
      return;
    }
    if (now - hoverStartTs < 2000) {
      lastPetX = e.clientX;
      return;
    }
    const dx = e.clientX - lastPetX;
    if (Math.abs(dx) < 2) return;
    lastPetX = e.clientX;
    const dir = dx > 0 ? 1 : -1;
    if (lastPetDir !== 0 && dir !== lastPetDir) {
      petReversals++;
    }
    lastPetDir = dir;
    petDistance += Math.abs(dx);

    if (petReversals >= 1 || petDistance >= 10) {
      const wasPetting = now < pettingUntilTs;
      pettingUntilTs = now + 950;
      lastActivityTs = now;
      setState('petting', 'completed');
      if (!wasPetting) {
        setBubble(PURR_LINES[Math.floor(Math.random() * PURR_LINES.length)], 1800);
      }
      if (now - lastHeartTs >= 240) {
        lastHeartTs = now;
        const relX = r.width > 0 ? ((e.clientX - r.left) / r.width) * 100 : 50;
        spawnHeart(relX);
      }
    }
  }, true);

  root.addEventListener('click', () => {
    if (dragMoved) return;
    lastActivityTs = Date.now();
    celebrateUntilTs = Date.now() + 2600;
    setState('completed', 'completed');
    setBubble(PET_LINES[Math.floor(Math.random() * PET_LINES.length)], 2000);
  });

  root.addEventListener('dblclick', () => {
    mode = 'perch';
    const p = getPerchPoint(0.78);
    perchRatio = 0.78;
    targetX = p.x;
    targetY = p.y;
    isWalking = true;
    setBubble('На базу!', 1400);
  });

  // React to user typing in prompt box
  document.addEventListener('keydown', (e) => {
    lastActivityTs = Date.now();
    const t = e.target;
    if (t && t.nodeType === 1 && !t.closest('#qusa-theme-modal') && (t.isContentEditable || t.tagName === 'TEXTAREA')) {
      typingUntilTs = Date.now() + 3500;
      if (mode !== 'perch') {
        mode = 'perch';
        const p = getPerchPoint(perchRatio);
        targetX = p.x;
        targetY = p.y;
      }
    }
  }, true);

  document.addEventListener('pointerdown', () => {
    lastActivityTs = Date.now();
  }, true);

  // Initial placement
  snapToPerch();
  setTimeout(snapToPerch, 700);
  setTimeout(snapToPerch, 1800);

  window.__qusaUpdateAnty = (newCfg) => {
    cfg = newCfg;
    const sz = getSize();
    root.style.width = `${sz}px`;
    root.style.height = `${sz}px`;
    root.style.display = cfg.antyEnabled !== false ? 'block' : 'none';
    if (!cfg.antyRoam && mode === 'roam') {
      mode = 'perch';
    }
    if (mode === 'perch') snapToPerch();
  };

  // Smooth animation & behavior loop (~30fps)
  const SPEED = 2.4;
  setInterval(() => {
    if (document.hidden || cfg.antyEnabled === false || isDragging) return;
    const now = Date.now();
    const working = isAgentWorking();

    if (wasWorking && !working) {
      celebrateUntilTs = now + 5500;
      setBubble('Готово! ♥', 2600);
    }
    wasWorking = working;

    // Keep anchored to composer when perched
    if (mode === 'perch' && !isWalking) {
      const p = getPerchPoint(perchRatio);
      if (Math.hypot(p.x - posX, p.y - posY) > 6) {
        targetX = p.x;
        targetY = p.y;
      }
    }

    // If working or typing, always return to composer
    if ((working || now < typingUntilTs) && mode !== 'perch') {
      mode = 'perch';
      const p = getPerchPoint(perchRatio);
      targetX = p.x;
      targetY = p.y;
    }

    // Return from roam/pin after timer expires
    if ((mode === 'roam' || mode === 'pinned') && roamReturnTs > 0 && now > roamReturnTs && !working) {
      mode = 'perch';
      roamReturnTs = 0;
      const p = getPerchPoint(perchRatio);
      targetX = p.x;
      targetY = p.y;
    }

    // Decide next stroll when idle (don't walk away while cursor is hovering/petting)
    if (!isHovered && now > pettingUntilTs && !working && now > typingUntilTs && now > celebrateUntilTs && now > nextActionTs && now - lastActivityTs < 42000) {
      nextActionTs = now + 11000 + Math.random() * 14000;
      const sz = getSize();
      if (mode === 'perch') {
        const shouldRoam = cfg.antyRoam !== false && Math.random() < 0.28;
        if (shouldRoam) {
          mode = 'roam';
          roamReturnTs = now + 10000 + Math.random() * 7000;
          const pickEdge = Math.random();
          if (pickEdge < 0.65) {
            // Walk along bottom edge of window
            targetX = 280 + Math.random() * Math.max(80, window.innerWidth - 360 - sz);
            targetY = window.innerHeight - sz - 8;
          } else {
            // Peek near sidebar/top area
            targetX = 270 + Math.random() * Math.max(80, window.innerWidth - 420 - sz);
            targetY = 64 + Math.random() * 80;
          }
        } else {
          // Stroll along top edge of prompt box
          perchRatio = 0.08 + Math.random() * 0.84;
          const p = getPerchPoint(perchRatio);
          targetX = p.x;
          targetY = p.y;
        }
      }
    }

    // Move smoothly toward target
    const dx = targetX - posX;
    const dy = targetY - posY;
    const dist = Math.hypot(dx, dy);

    if (dist > 3) {
      isWalking = true;
      const step = Math.min(dist, SPEED * (dist > 140 ? 1.8 : 1.0));
      placeAt(posX + (dx / dist) * step, posY + (dy / dist) * step);
      if (Math.abs(dx) > 1.5) {
        root.setAttribute('data-dir', dx < 0 ? 'left' : 'right');
      }
      setState('walking', 'walking');
      return;
    }

    isWalking = false;

    // Choose stationary state
    if (now < pettingUntilTs) {
      setState('petting', 'completed');
    } else if (working) {
      setState('working', 'working');
    } else if (now < celebrateUntilTs) {
      setState('completed', 'completed');
    } else if (now < typingUntilTs) {
      setState('asking', 'asking');
    } else if (now - lastActivityTs >= 45000) {
      setState('sleeping', 'sleeping');
    } else {
      setState('idle', 'idle');
    }
  }, 33);
}

function initQusaCustomUI() {
  const boot = async () => {
    if (!document.head || !document.body) return;
    const cfg = await loadConfigAsync();

    const savedLocal = await loadLocalWallpaper();
    if (savedLocal && savedLocal.blob) {
      activeLocalBlobUrl = URL.createObjectURL(savedLocal.blob);
      activeLocalMime = savedLocal.type || '';
      if (!cfg.wallpaperLocalName && savedLocal.name) {
        cfg.wallpaperLocalName = savedLocal.name;
      }
    }

    injectStyles(cfg);
    updateWallpaperLayer(cfg);
    createStyleUI(cfg);
    initAntyMascot(cfg);
    if (window.__qusaSyncWpStatus) window.__qusaSyncWpStatus();
    applySurfaceColors(cfg);
    applyTextTransforms(document.body, cfg);
    setTimeout(() => {
      applySurfaceColors(cfg);
      applyTextTransforms(document.body, cfg);
    }, 600);
    setTimeout(() => {
      applySurfaceColors(cfg);
      applyTextTransforms(document.body, cfg);
    }, 1800);

    // --- Live Hot-Reload from Disk (MCP & Antigravity Chat Control) ---
    let lastKnownDiskConfigJson = '';
    let lastKnownMascotMsg = '';
    setInterval(async () => {
      try {
        if (window.qusaPersist && typeof window.qusaPersist.loadConfig === 'function') {
          const diskCfg = await window.qusaPersist.loadConfig();
          if (diskCfg && typeof diskCfg === 'object') {
            const diskJson = JSON.stringify(diskCfg);
            if (lastKnownDiskConfigJson && diskJson !== lastKnownDiskConfigJson) {
              lastKnownDiskConfigJson = diskJson;
              Object.assign(cfg, mergeConfig(diskCfg));
              injectStyles(cfg);
              updateWallpaperLayer(cfg);
              applySurfaceColors(cfg);
              applyTextTransforms(document.body, cfg);
              if (diskCfg.mascotMessage && diskCfg.mascotMessage !== lastKnownMascotMsg && window.__qusaSay) {
                lastKnownMascotMsg = diskCfg.mascotMessage;
                window.__qusaSay(diskCfg.mascotMessage, 3500);
              }
            } else if (!lastKnownDiskConfigJson) {
              lastKnownDiskConfigJson = diskJson;
              if (diskCfg.mascotMessage) lastKnownMascotMsg = diskCfg.mascotMessage;
            }
          }
        }
      } catch (err) {
        // silent
      }
    }, 1000);

    window.addEventListener('beforeunload', () => {
      saveConfig(cfg, true);
    });

    // Clean solid/gradient hover-action overlays (including ::before/::after & React-mounted icons) inside sidebar rows
    const cleanSidebarRow = (row) => {
      if (!row || !row.isConnected) return;
      const rowRect = row.getBoundingClientRect();
      const kids = row.querySelectorAll('*');
      for (const k of kids) {
        if (k.tagName === 'SVG' || k.tagName === 'PATH' || k.tagName === 'CIRCLE' || k.tagName === 'LINE' || k.tagName === 'RECT' || k.tagName === 'POLYLINE') continue;
        const kr = k.getBoundingClientRect();
        if (kr.width === 0 || kr.height === 0) continue;
        const cs = getComputedStyle(k);
        const csB = getComputedStyle(k, '::before');
        const csA = getComputedStyle(k, '::after');
        const hasGrad = (cs.backgroundImage && cs.backgroundImage !== 'none') ||
          (csB.backgroundImage && csB.backgroundImage !== 'none') ||
          (csA.backgroundImage && csA.backgroundImage !== 'none');
        const isAbs = cs.position === 'absolute';
        const isRightActionBox = kr.width < rowRect.width * 0.85 && kr.left > rowRect.left + 30 && kr.right >= rowRect.right - 24;
        if (hasGrad || isAbs || isRightActionBox) {
          k.setAttribute('data-qusa-no-bg', '1');
        }
      }
    };

    document.addEventListener('pointerover', (e) => {
      if (!hasActiveWallpaper(cfg) && !(cfg.colorEnabled && cfg.baseColor.toLowerCase() !== '#121212')) return;
      if (e.clientX > 390) return;
      const target = e.target;
      if (!target || target.nodeType !== 1) return;
      if (target.closest('#qusa-theme-modal, #qusa-style-fab')) return;
      let row = target;
      let bestRow = null;
      while (row && row !== document.body) {
        const r = row.getBoundingClientRect();
        if (r.left <= 40 && r.height >= 20 && r.height <= 56 && r.width >= 100 && r.width <= 385) {
          bestRow = row;
        }
        row = row.parentElement;
      }
      if (!bestRow) return;
      cleanSidebarRow(bestRow);
      requestAnimationFrame(() => cleanSidebarRow(bestRow));
      setTimeout(() => cleanSidebarRow(bestRow), 60);
    }, true);

    let recolorTimer = null;
    const observer = new MutationObserver((mutations) => {
      if (!recolorTimer) {
        recolorTimer = setTimeout(() => {
          recolorTimer = null;
          applySurfaceColors(cfg);
        }, 800);
      }
      const pairs = getActiveModelPairs(cfg);
      const hasAcc = Boolean((cfg.customAccountName || '').trim());
      if (!cfg.ruEnabled && pairs.length === 0 && !hasAcc) return;

      for (const m of mutations) {
        if (m.type === 'characterData') {
          processSingleTextNode(m.target, cfg, pairs);
        } else if (m.type === 'childList') {
          for (const added of m.addedNodes) {
            if (added.nodeType === Node.ELEMENT_NODE || added.nodeType === Node.TEXT_NODE) {
              applyTextTransforms(added, cfg);
            }
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => { void boot(); }, { once: true });
  } else {
    void boot();
  }
}

initQusaCustomUI();
})();
