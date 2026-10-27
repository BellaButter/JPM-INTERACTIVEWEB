@echo off
cd /d "%~dp0"
set PORT=4174
echo Starting the NEW JPM Media Space website (OneDrive) at http://127.0.0.1:4174/th/index.html ...
echo Keep this window open while you view the site. Close it to stop the preview.
start "" "http://127.0.0.1:4174/th/index.html"
npm start
pause
