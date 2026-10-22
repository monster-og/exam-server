@echo off
title Online Exam Server - 50+ Computers (Any Network / Internet)
color 0b
cls
echo ================================================================
echo    🏫 OXFORD CONVENT SCHOOL SASARAM - ONLINE EXAM SERVER
echo    Configured for Multi-Computer & Public Internet Access
echo ================================================================
echo.
echo  Starting Exam Server Engine with Public Internet Tunnel...
cd /d "%~dp0"
node server.js
pause
