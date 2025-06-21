@echo off
cd /d "%~dp0"
call backend-env\Scripts\activate
cd fadeneDentalClinic
python manage.py runserver