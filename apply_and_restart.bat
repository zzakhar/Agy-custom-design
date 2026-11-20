@echo off
chcp 65001 >nul
echo ========================================================
echo   Agy-Custom-Design: Применение патча и перезапуск
echo ========================================================
echo.
echo [1/3] Завершаем Antigravity для разблокировки app.asar...
taskkill /f /im Antigravity.exe >nul 2>&1
timeout /t 2 /nobreak >nul

set "RES=%LOCALAPPDATA%\Programs\antigravity\resources"
set "EXE=%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe"
set "PATCHED=%RES%\app.tmp_patched"
set "TARGET=%RES%\app.asar"
set "BAK=%RES%\app.asar.bak"

if not exist "%BAK%" (
    echo [!] Создаем резервную копию оригинала app.asar.bak...
    copy /y "%TARGET%" "%BAK%" >nul
)

if not exist "%PATCHED%" (
    echo [2/3] Патчим app.asar через Python...
    python "%~dp0patch_asar.py" --patch "%TARGET%" --ui "%~dp0qusaCustomUI.js" --out "%PATCHED%" --force
)

if exist "%PATCHED%" (
    echo [2/3] Устанавливаем пропатченный app.asar...
    move /y "%PATCHED%" "%TARGET%" >nul
    echo [OK] Патч успешно внедрен!
) else (
    echo [ERROR] Не удалось создать пропатченный файл!
    pause
    exit /b 1
)

echo [3/3] Запускаем Antigravity с поддержкой Drag-and-Drop...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0launch_medium.ps1" "%EXE%"
echo.
echo [ГОТОВО] Antigravity запущен с новым кастомным интерфейсом!
timeout /t 3 >nul
