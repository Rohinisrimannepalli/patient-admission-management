
# MediCare - Patient Admission Management System

A full-stack web application designed to simplify hospital
patient admission and record management through a responsive
and user-friendly dashboard.

Developed as part of the DScribe Software Engineer Intern
Round 1 assignment.

## Features

- Patient admission and registration
- View and manage patient records
- Edit patient information
- Delete patient records with confirmation
- Discharge patient management
- Search patients by name
- Filter by ward, department and doctor
- Dashboard with patient statistics
- Frontend and backend input validation
- Persistent PostgreSQL database
- Responsive user interface
- Error handling and success notifications

## Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- Lucide React

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

### Database
- PostgreSQL
- Neon Cloud Database

## Architecture

React Frontend → FastAPI REST API → PostgreSQL Database

## Local Installation

### 1. Clone the repository

    git clone <repository-url>
    cd patient-admission-management

### 2. Backend Setup

    cd backend
    python -m venv venv

Activate the virtual environment on Windows:

    .\venv\Scripts\Activate.ps1

Install dependencies:

    pip install -r requirements.txt

Create a .env file using .env.example as a reference.

    DATABASE_URL=your_postgresql_connection_string

Start the backend:

    python -m uvicorn main:app --reload

Backend URL: http://127.0.0.1:8000

API Documentation: http://127.0.0.1:8000/docs

### 3. Frontend Setup

Open a separate terminal:

    cd frontend
    npm install

Create a .env file:

    VITE_API_URL=http://127.0.0.1:8000

Start the frontend:

    npm run dev

Frontend URL: http://localhost:5173

## Validation and Error Handling

- Required field validation
- Patient name validation
- Age validation
- Admission date validation
- Dropdown field validation
- API error handling
- Confirmation dialogs for destructive actions

## Deployment

- Frontend: Vercel (planned)
- Backend: Render (planned)
- Database: Neon PostgreSQL

## Disclaimer

This application is developed for demonstration and
technical assessment purposes. Only fictional patient
records should be used.

## Author

Rohini Sri Mannepalli

Developed for the DScribe Software Engineer Intern Assessment.
