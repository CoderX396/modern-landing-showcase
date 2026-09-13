@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ============================================================
echo   ARREGLAR EL CORREO DE LOS COMMITS
echo   Repo: modern-landing-showcase
echo ============================================================
echo.

REM --- Comprobar que estamos en un repo de git -----------------
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Esta carpeta no es un repositorio de git.
  echo Mueve este archivo a la carpeta modern-landing-showcase.
  echo.
  pause
  exit /b 1
)

REM --- Comprobar que no haya cambios sin guardar ----------------
REM  Un rebase con cambios sueltos se puede complicar; mejor parar.
for /f %%i in ('git status --porcelain 2^>nul ^| find /c /v ""') do set SUELTOS=%%i
if not "!SUELTOS!"=="0" (
  echo [ALTO] Tienes !SUELTOS! archivo^(s^) con cambios sin commitear.
  echo.
  git status --short
  echo.
  echo Haz commit de eso en GitHub Desktop primero, y vuelve a
  echo ejecutar este archivo. No toco nada.
  echo.
  pause
  exit /b 1
)

echo --- ANTES -------------------------------------------------
echo Correo configurado ahora:
set "CORREOACTUAL=(ninguno)"
for /f "delims=" %%e in ('git config user.email 2^>nul') do set "CORREOACTUAL=%%e"
echo    !CORREOACTUAL!
echo.
REM  Averiguar contra que rama remota comparar, sin asumir "main".
set "BASE="
for /f "delims=" %%b in ('git rev-parse --abbrev-ref --symbolic-full-name @{u} 2^>nul') do set "BASE=%%b"
if "!BASE!"=="" (
  echo [ERROR] Esta rama no esta conectada a ninguna rama remota.
  echo Haz un push normal desde GitHub Desktop una vez y reintenta.
  echo.
  pause
  exit /b 1
)
echo Comparando contra: !BASE!
echo.
echo Commits sin subir a GitHub:
git log !BASE!..HEAD --pretty=format:"   %%h  %%an  %%ae"
echo.
echo.

REM --- 1. Poner el correo correcto -----------------------------
REM  Este es tu correo de GitHub que NO revela tu direccion real.
REM  Se pone global para que no vuelva a pasar en otros repos.
git config --global user.name  "CoderX396"
git config --global user.email "269278808+CoderX396@users.noreply.github.com"
echo [1/3] Correo de git actualizado a:
echo       269278808+CoderX396@users.noreply.github.com
echo.

REM --- 2. Reescribir los commits que aun no estan en GitHub -----
REM  --reset-author vuelve a firmar cada commit con el correo de
REM  arriba. Solo toca los commits que NO se han subido, asi que
REM  no rompe nada del historial que ya esta publicado.
echo [2/3] Reescribiendo los commits sin subir...
git rebase --exec "git commit --amend --reset-author --no-edit" !BASE!
if errorlevel 1 (
  echo.
  echo [ERROR] El rebase se detuvo. Nada se ha subido.
  echo Para dejar todo como estaba: git rebase --abort
  echo.
  pause
  exit /b 1
)
echo.

REM --- 3. Verificar ---------------------------------------------
echo [3/3] Comprobando que no quede ningun correo privado...
echo.
echo --- DESPUES -----------------------------------------------
git log !BASE!..HEAD --pretty=format:"   %%h  %%an  %%ae"
echo.
echo.

git log !BASE!..HEAD --pretty=format:"%%ae %%ce" | find "dwstrabajo969" >nul
if errorlevel 1 (
  echo ============================================================
  echo   LISTO. Ya no queda ningun correo privado.
  echo.
  echo   Ahora abre GitHub Desktop y dale a Push origin.
  echo   Deberia pasar sin el error.
  echo.
  echo   NO destildes "Keep my email address private" en GitHub.
  echo   Ya no hace falta, y hacerlo publicaria tu correo para
  echo   siempre en el historial del repo.
  echo ============================================================
) else (
  echo ============================================================
  echo   [OJO] Todavia aparece el correo privado en algun commit.
  echo   Mandale una captura de esta ventana a Claude.
  echo ============================================================
)

echo.
echo Puedes borrar este archivo .bat cuando termines.
echo.
pause
