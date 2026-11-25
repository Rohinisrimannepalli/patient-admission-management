
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Patient
from schemas import (
    PatientCreate,
    PatientUpdate,
    PatientResponse,
    GENDERS,
    WARDS,
    DEPARTMENTS,
    DOCTORS
)

router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)


# Get dropdown options
@router.get("/options")
def get_options():
    return {
        "genders": GENDERS,
        "wards": WARDS,
        "departments": DEPARTMENTS,
        "doctors": DOCTORS
    }


# Add a patient
@router.post("/", response_model=PatientResponse, status_code=201)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db)
):
    new_patient = Patient(**patient.model_dump())

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient


# View, search and filter patients
@router.get("/", response_model=list[PatientResponse])
def get_patients(
    search: str | None = None,
    ward: str | None = None,
    department: str | None = None,
    doctor: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Patient)

    if search:
        query = query.filter(
            Patient.name.ilike(f"%{search.strip()}%")
        )

    if ward:
        query = query.filter(Patient.ward == ward)

    if department:
        query = query.filter(Patient.department == department)

    if doctor:
        query = query.filter(Patient.doctor == doctor)

    return query.order_by(Patient.id.desc()).all()


# Get a single patient
@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):
    patient = db.get(Patient, patient_id)

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


# Edit a patient
@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    updated_patient: PatientUpdate,
    db: Session = Depends(get_db)
):
    patient = db.get(Patient, patient_id)

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    for key, value in updated_patient.model_dump().items():
        setattr(patient, key, value)

    db.commit()
    db.refresh(patient)

    return patient


# Delete a patient
@router.delete("/{patient_id}")
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):
    patient = db.get(Patient, patient_id)

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    db.delete(patient)
    db.commit()

    return {"message": "Patient deleted successfully"}


# Discharge a patient
@router.patch(
    "/{patient_id}/discharge",
    response_model=PatientResponse
)
def discharge_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):
    patient = db.get(Patient, patient_id)

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    patient.status = "Discharged"

    db.commit()
    db.refresh(patient)

    return patient
