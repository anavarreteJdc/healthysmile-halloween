@echo off
chcp 65001 > nul
title HealthySmile Halloween - Lanzador
cd /d "%~dp0"
set LOG=%~dp0_ejecucion.log

echo === HealthySmile Halloween - Lanzador === > "%LOG%"
echo Fecha: %date% %time% >> "%LOG%"
echo CD: %cd% >> "%LOG%"
echo. >> "%LOG%"

echo [1/4] Comprobando node...
echo [1/4] Comprobando node... >> "%LOG%"
where node >> "%LOG%" 2>&1
node --version >> "%LOG%" 2>&1
if errorlevel 1 (
    echo ERROR: node no esta instalado. Instala Node.js desde https://nodejs.org
    echo ERROR: node no instalado >> "%LOG%"
    pause
    exit /b 1
)

echo [2/4] Instalando dependencias (puede tardar la primera vez)...
echo [2/4] npm install >> "%LOG%"
call npm install --no-audit --no-fund >> "%LOG%" 2>&1

echo.
echo [3/4] Iniciando servidor local en http://localhost:5173
echo [3/4] http-server :5173 >> "%LOG%"
start "" cmd /c "npx --yes http-server src -p 5173 -c-1 >> \"%LOG%\" 2>&1"

echo [4/4] Esperando 3s y abriendo en el navegador por defecto...
timeout /t 3 /nobreak > nul
start http://localhost:5173

echo.
echo === LANZADO ===
echo Si no se abre, prueba manualmente http://localhost:5173
echo El log esta en: _ejecucion.log
echo Para salir, cierra esta ventana y la de http-server.
echo.
pause
