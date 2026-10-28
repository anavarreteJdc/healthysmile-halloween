@echo off
chcp 65001 > nul
set LOG=%~dp0_diagnostico.log
echo === HealthySmile Halloween - Diagnostico === > "%LOG%"
echo Fecha: %date% %time% >> "%LOG%"
echo. >> "%LOG%"
echo === Entorno === >> "%LOG%"
echo CD: %~dp0 >> "%LOG%"
where node >> "%LOG%" 2>&1
node --version >> "%LOG%" 2>&1
where npm >> "%LOG%" 2>&1
call npm --version >> "%LOG%" 2>&1
where cargo >> "%LOG%" 2>&1
cargo --version >> "%LOG%" 2>&1
where rustc >> "%LOG%" 2>&1
rustc --version >> "%LOG%" 2>&1
where git >> "%LOG%" 2>&1
git --version >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo === Archivos del proyecto === >> "%LOG%"
cd /d "%~dp0"
dir /b >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo === src/ === >> "%LOG%"
dir /b src >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo === src-tauri/ === >> "%LOG%"
dir /b src-tauri >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo === node_modules existe? === >> "%LOG%"
if exist node_modules (echo SI >> "%LOG%") else (echo NO >> "%LOG%")
echo. >> "%LOG%"
echo === Instalando dependencias (puede tardar) === >> "%LOG%"
call npm install --no-audit --no-fund >> "%LOG%" 2>&1
echo EXITCODE: %ERRORLEVEL% >> "%LOG%"
echo. >> "%LOG%"
echo === Fin === >> "%LOG%"
echo. >> "%LOG%"
echo LOG escrito en %LOG%
echo.
echo Pulsa cualquier tecla para cerrar.
pause > nul
