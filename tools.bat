@echo off
title Sheikh Ibrahim Ashraf

:menu
cls
echo =========================
echo  Quraniat Mobile Tools
echo =========================
echo.
echo 1. Start Expo
echo 2. Start Dev Client
echo 3. Android Build Dev
echo 4. Android Build Preview
echo 5. Android Build Production
echo 6. Lint + TypeCheck
echo 7. Submit To Play Store
echo 8. Exit
echo.

set /p choice=Choose:

if "%choice%"=="1" npm run start:expo
if "%choice%"=="2" npm run start:dev
if "%choice%"=="3" npm run build:dev
if "%choice%"=="4" npm run build:preview
if "%choice%"=="5" npm run build:prod
if "%choice%"=="6" npm run check
if "%choice%"=="7" npm run submit
if "%choice%"=="8" exit

pause
goto menu