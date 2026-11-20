# Agy Custom Design (`agy-custom`)

> **Chat-Driven UI, Wallpapers, Live Hot-Reload & Model Renamer for Google Antigravity (Windows)**  
> *Форк проекта [AsInsideOut/ag-custom](https://github.com/AsInsideOut/ag-custom) с управлением напрямую из чата через MCP-сервер и мгновенным Hot-Reload без перезапусков.*

---

## ⚡ Главные нововведения форка

1. **Полное управление через чат Antigravity**:
   * Больше никаких лишних меню и ручных кликов. Ты просто говоришь агенту в диалоге:
     * *«Поставь этот арт на обои с блюром 10px»*
     * *«Переименуй 3.8 Flash в Gemini 4 Neon»*
     * *«Включи швейцарский стиль оформления (Swiss Bento)»*
     * *«Скажи Anty: 'Прод на базе!'»*
   * Агент сам вызывает встроенные **MCP-инструменты** и меняет интерфейс на лету.

2. **Мгновенный Live Hot-Reload**:
   * Скрипт интерфейса слушает конфиг на лету (каждую 1 сек).
   * Обои, прозрачность, блюр, цвета и переименования обновляются **сразу же**, без перезапуска приложения!

3. **Готовые архитектурные пресеты**:
   * **`swiss`** — Swiss Editorial / Modern Bento (графитовая база, сигнальный оранжевый `#ff3b00`, жесткая сетка, ноль AI-мыла).
   * **`neon`** — True Cyber Neon (глубокий OLED-черный `#050608`, циан `#00f3ff`, статусная телеметрия).
   * **`linear`** — Инженерный минимализм Linear/Vercel.
   * **`oled`** — Абсолютный 100% черный контраст.

4. **Маскот Anty с репликами из чата**:
   * Пиксельный компаньон умеет выводить текстовые облачка сообщений (`mascotMessage`) по команде агента.

---

## 🚀 Быстрый запуск

### Шаг 1: Применить патч (1 клик)
Запусти файл **`apply_and_restart.bat`** на Рабочем столе:
* Он сделает бэкап `app.asar.bak`;
* Внедрится в `app.asar` с пересчетом SHA-256 integrity;
* Запустит Antigravity в Medium Integrity Level (с рабочим drag-and-drop).

### Шаг 2: Управлять из чата
Всё! Модель уже подключена к управлению. Просто пиши в чат Antigravity:
* *«Включи тему neon»*
* *«Поставь видео-обои C:/wallpapers/cyber.mp4»*
* *«Переименуй модель в Gemini 4 Neon»*

---

## 🛠 Ручное управление через консоль (CLI)

Если захочешь настроить через терминал PowerShell:
```powershell
cd "C:\Users\User\Desktop\Agy-Custom-Design"

# Посмотреть текущий статус и настройки
python agy_control.py status

# Включить пресет
python agy_control.py set-theme --preset swiss
python agy_control.py set-theme --preset neon

# Установить обои (картинка, GIF или видео MP4/WebM)
python agy_control.py set-wallpaper "C:\path\to\wallpaper.png" --dim 0.4 --blur 8 --alpha 0.7

# Сбросить обои
python agy_control.py clear-wallpaper

# Переименовать модель
python agy_control.py rename-model "Gemini 3.8 Flash (Medium)" "Gemini 4 Neon"

# Сказать реплику через Anty
python agy_control.py mascot --say "Я готов кодить!"
```

---

## 🔄 Как откатить назад к чистому Antigravity
Запусти **`restore_original.bat`** — он мгновенно восстановит оригинальный `app.asar.bak` и уберет кастомные надстройки.

---

## 📦 Как выложить этот форк на GitHub

1. Зайди на [оригинальный репозиторий](https://github.com/AsInsideOut/ag-custom) и нажми кнопку **Fork** (в правом верхнем углу).
2. Назови форк (например, `Agy-Custom-Design`).
3. В терминале на твоем ПК выполни:
```powershell
cd "C:\Users\User\Desktop\Agy-Custom-Design"

# 1. Зафиксировать все изменения
git add .
git commit -m "feat: MCP chat control, live hot-reload, swiss & neon presets"

# 2. Привязать к твоему новому форку на GitHub
git remote set-url origin https://github.com/ТВОЙ_НИКНЕЙМ/Agy-Custom-Design.git

# 3. Отправить изменения
git push -u origin main
```

---

## Лицензия
Распространяется под лицензией **GNU General Public License v3.0 (GPL-3.0)**, как и оригинальный проект `AsInsideOut/ag-custom`.
