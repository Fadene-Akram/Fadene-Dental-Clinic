# 🦷 Fadene Dental Clinic

**Fadene Dental Clinic** is a desktop application designed to streamline the management of a private dental clinic. It offers a modern, user-friendly interface with essential tools to simplify clinical workflows.

## ✨ Features

- 🧑‍⚕️ **Patient Management** – Add, edit, and view patient records.
- 🗓️ **Appointment Scheduling** – Organize and track daily appointments.
- 💰 **Expense Tracking** – Monitor clinic-related expenses.
- 📝 **Note-Taking** – Save important notes related to patients or operations.
- 📊 **Interactive Dashboard** – Get insights from data in a clean visual format.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev) + [Electron](https://www.electronjs.org)
- **Backend**: [Django](https://www.djangoproject.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)

---

## 📸 Screenshots

| Dashboard | Patient Records |
|----------|-----------------|
| ![Dashboard](assets/dashboard.png) | ![Patients](assets/patients.png) |

| Appointments | Expenses |
|-------------|----------|
| ![Appointments](assets/appointments.png) | ![Expenses](assets/expenses.png) |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Fadene-Akram/Fadene-Dental-Clinic.git
```
### 2. Run with Bash Script (Windows)
Simply double-click on: run_app.bat

### 3. Manual Setup
Backend (Django)
```bash
cd backend
backend-env\Scripts\activate
cd fadeneDentalClinic
python manage.py runserver
```
Frontend (React + Electron)
```bash

cd frontend
npm install
npm run dev
```

## ⚙️ Requirements
Before running the app, make sure you have the following installed on your machine:

- PostgreSQL
- Python 3.x
- Django
- Node.js and npm
