@echo off
chcp 65001 >nul
echo ========================================================
echo   Agy-Custom-Design: Откат к 100%% оригинальному UI
echo ========================================================
echo.
echo [1/2] Завершаем Antigravity...
taskkill /f /im Antigravity.exe >nul 2>&1
timeout /t 2 /nobreak >nul

set "RES=%LOCALAPPDATA%\Programs\antigravity\resources"
set "EXE=%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe"
set "TARGET=%RES%\app.asar"
set "BAK=%RES%\app.asar.bak"

if exist "%BAK%" (
    echo [2/2] Восстанавливаем оригинальный app.asar из бэкапа...
    copy /y "%BAK%" "%TARGET%" >nul
    echo [OK] Оригинал восстановлен!
) else (
    echo [ERROR] Бэкап app.asar.bak не найден!
    pause
    exit /b 1
)

echo Запускаем чистый Antigravity...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0launch_medium.ps1" "%EXE%"
echo [ГОТОВО]
timeout /t 3 >nul
