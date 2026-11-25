
from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, field_validator, ConfigDict


GENDERS = ["Male", "Female", "Other"]

WARDS = [
    "General Ward",
    "ICU",
    "Private Ward",
    "Emergency"
]

DEPARTMENTS = [
    "General Medicine",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics"
]

DOCTORS = [
    "Dr. Sharma",
    "Dr. Reddy",
    "Dr. Patel",
    "Dr. Kumar",
    "Dr. Rao"
]


class PatientBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=0, le=120, strict=True)
    gender: str
    ward: str
    department: str
    doctor: str
    admission_date: date
    status: Literal["Admitted", "Discharged"] = "Admitted"

    @field_validator("name", mode="before")
    @classmethod
    def validate_name(cls, value):
        if not isinstance(value, str):
            raise ValueError("Name must be text")

        value = value.strip()

        if not value or not all(
            char.isalpha() or char == " " for char in value
        ):
            raise ValueError("Name must contain only letters and spaces")

        return value

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, value):
        if value not in GENDERS:
            raise ValueError("Please select a valid gender")
        return value

    @field_validator("ward")
    @classmethod
    def validate_ward(cls, value):
        if value not in WARDS:
            raise ValueError("Please select a valid ward")
        return value

    @field_validator("department")
    @classmethod
    def validate_department(cls, value):
        if value not in DEPARTMENTS:
            raise ValueError("Please select a valid department")
        return value

    @field_validator("doctor")
    @classmethod
    def validate_doctor(cls, value):
        if value not in DOCTORS:
            raise ValueError("Please select a valid doctor")
        return value

    @field_validator("admission_date")
    @classmethod
    def validate_admission_date(cls, value):
        if value > date.today():
            raise ValueError("Admission date cannot be in the future")
        return value


class PatientCreate(PatientBase):
    pass


class PatientUpdate(PatientBase):
    pass


class PatientResponse(PatientBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
