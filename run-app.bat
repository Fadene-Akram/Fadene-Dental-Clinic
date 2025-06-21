@echo off
echo Starting Fadene Dental Clinic...

:: Start the Django backend without showing a window
start /min "" cmd /c "cd /d "%~dp0Backend" && call backend-env\Scripts\activate && cd fadeneDentalClinic && python manage.py runserver"

:: Wait for the Django server to start
timeout /t 5 /nobreak >nul

:: Start the Electron app without showing a terminal
cd /d "%~dp0Fadene-Dental-Clinic"
start /min "" cmd /c "npm run dev"

:: Exit this batch file
exit