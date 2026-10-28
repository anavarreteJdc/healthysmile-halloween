@echo off
chcp 65001 > nul
title HealthySmile - Tauri (ya compilado)
cd /d "%~dp0"
set LOG=%~dp0_tauri.log

echo === Ejecutando Tauri existente === > "%LOG%"
echo Fecha: %date% %time% >> "%LOG%"
echo. >> "%LOG%"

if exist "src-tauri\target\debug\healthysmile-halloween.exe" (
    echo Lanzando: src-tauri\target\debug\healthysmile-halloween.exe
    echo Lanzando exe debug >> "%LOG%"
    "src-tauri\target\debug\healthysmile-halloween.exe" >> "%LOG%" 2>&1
) else (
    echo No existe el .exe. Compilalo primero con: npm run tauri:dev
    echo .exe no existe >> "%LOG%"
)
echo. >> "%LOG%"
echo EXITCODE: %ERRORLEVEL% >> "%LOG%"
echo.
pause
