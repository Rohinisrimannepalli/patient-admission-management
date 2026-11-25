
import { useState } from "react";
import { X, Save } from "lucide-react";

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function PatientForm({
  patient,
  options,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState({
    name: patient?.name || "",
    age: patient?.age ?? "",
    gender: patient?.gender || "",
    ward: patient?.ward || "",
    department: patient?.department || "",
    doctor: patient?.doctor || "",
    admission_date: patient?.admission_date || getToday(),
    status: patient?.status || "Admitted",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      general: "",
    }));
  }

  function validate() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Patient name is required";
    } else if (!/^[\p{L} ]+$/u.test(form.name.trim())) {
      newErrors.name = "Name must contain only letters and spaces";
    } else if (form.name.trim().length > 100) {
      newErrors.name = "Name cannot exceed 100 characters";
    }

    if (
      String(form.age).trim() === "" ||
      !Number.isInteger(Number(form.age)) ||
      Number(form.age) < 0 ||
      Number(form.age) > 120
    ) {
      newErrors.age = "Enter a valid age between 0 and 120";
    }

    const dropdowns = {
      gender: options.genders,
      ward: options.wards,
      department: options.departments,
      doctor: options.doctors,
    };

    Object.entries(dropdowns).forEach(([field, values]) => {
      if (!values?.includes(form[field])) {
        newErrors[field] = `Please select a valid ${field}`;
      }
    });

    if (!form.admission_date) {
      newErrors.admission_date = "Admission date is required";
    } else if (form.admission_date > getToday()) {
      newErrors.admission_date = "Admission date cannot be in the future";
    }

    if (!["Admitted", "Discharged"].includes(form.status)) {
      newErrors.status = "Please select a valid status";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate() || saving) return;

    setSaving(true);

    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        age: Number(form.age),
      });
    } catch (error) {
      setErrors((previous) => ({
        ...previous,
        general: error.message,
      }));
    } finally {
      setSaving(false);
    }
  }

  function renderSelect(label, name, values) {
    return (
      <div className="form-group">
        <label htmlFor={name}>{label} *</label>

        <select
          id={name}
          name={name}
          value={form[name]}
          onChange={handleChange}
        >
          <option value="">Select {label}</option>

          {(values || []).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        {errors[name] && (
          <small className="field-error">{errors[name]}</small>
        )}
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="form-title">
              {patient ? "Edit Patient" : "Add New Patient"}
            </h2>

            <p>Enter the patient admission details.</p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close form"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div className="error-alert">{errors.general}</div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter patient name"
                value={form.name}
                onChange={handleChange}
              />

              {errors.name && (
                <small className="field-error">
                  {errors.name}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="age">Age *</label>

              <input
                id="age"
                name="age"
                type="number"
                min="0"
                max="120"
                step="1"
                placeholder="Enter age"
                value={form.age}
                onChange={handleChange}
              />

              {errors.age && (
                <small className="field-error">
                  {errors.age}
                </small>
              )}
            </div>

            {renderSelect("Gender", "gender", options.genders)}
            {renderSelect("Ward", "ward", options.wards)}

            {renderSelect(
              "Department",
              "department",
              options.departments
            )}

            {renderSelect("Doctor", "doctor", options.doctors)}

            <div className="form-group">
              <label htmlFor="admission_date">
                Admission Date *
              </label>

              <input
                id="admission_date"
                name="admission_date"
                type="date"
                max={getToday()}
                value={form.admission_date}
                onChange={handleChange}
              />

              {errors.admission_date && (
                <small className="field-error">
                  {errors.admission_date}
                </small>
              )}
            </div>

            {renderSelect("Status", "status", [
              "Admitted",
              "Discharged",
            ])}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              <Save size={17} />

              {saving
                ? "Saving..."
                : patient
                  ? "Update Patient"
                  : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
