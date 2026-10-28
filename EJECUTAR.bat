@echo off
chcp 65001 > nul
title HealthySmile Halloween
cd /d "%~dp0"
set LOG=%~dp0_ejecucion.log

echo === HealthySmile === > "%LOG%"
echo Fecha: %date% %time% >> "%LOG%"
echo CD: %cd% >> "%LOG%"
echo. >> "%LOG%"

echo [1] Comprobando http-server local... >> "%LOG%"
if exist node_modules\.bin\http-server.cmd (
    echo    OK: existe >> "%LOG%"
) else (
    echo    FALTA: instalando >> "%LOG%"
    call npm install http-server --save-dev --no-audit --no-fund >> "%LOG%" 2>&1
)
echo. >> "%LOG%"

echo [2] Lanzando servidor en segundo plano... >> "%LOG%"
start "HealthySmile Server" /MIN cmd /c "node_modules\.bin\http-server.cmd src -p 5173 -c-1 > _server.log 2>&1"

echo [3] Esperando 5 seg... >> "%LOG%"
timeout /t 5 /nobreak > nul

echo [4] Probando puerto 5173... >> "%LOG%"
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 3; Write-Output ('OK: Status ' + $r.StatusCode) } catch { Write-Output ('FAIL: ' + $_.Exception.Message) }" >> "%LOG%" 2>&1

echo [5] Abriendo navegador... >> "%LOG%"
start http://localhost:5173

echo. >> "%LOG%"
echo === FIN === >> "%LOG%"
echo. >> "%LOG%"

echo.
echo Resultado:
type "%LOG%"
echo.
echo Esta ventana se puede cerrar. El servidor sigue en segundo plano.
echo Para pararlo, cierra la ventana minimizada "HealthySmile Server"
echo o reinicia el PC.
echo.
timeout /t 15 /nobreak > nul
