
import { useEffect, useState, useMemo } from "react";

import {
  Activity,
  LayoutDashboard,
  Users,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Hospital,
  CheckCircle2,
  AlertCircle,
  X,
  Menu,
  Trash2,
  LogOut,
} from "lucide-react";

import Dashboard from "./components/Dashboard";
import PatientForm from "./components/PatientForm";
import PatientTable from "./components/PatientTable";

import {
  getOptions,
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
  dischargePatient,
} from "./services/api";

import "./App.css";

const EMPTY_FILTERS = {
  search: "",
  ward: "",
  department: "",
  doctor: "",
};

function App() {
  const [patients, setPatients] = useState([]);

  const [options, setOptions] = useState({
    genders: [],
    wards: [],
    departments: [],
    doctors: [],
  });

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [patientData, optionData] = await Promise.all([
        getPatients(),
        getOptions(),
      ]);

      setPatients(patientData);
      setOptions(optionData);
    } catch (err) {
      setError(
        `Unable to load patient data. ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification]);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch = patient.name
        .toLowerCase()
        .includes(filters.search.trim().toLowerCase());

      const matchesWard =
        !filters.ward || patient.ward === filters.ward;

      const matchesDepartment =
        !filters.department ||
        patient.department === filters.department;

      const matchesDoctor =
        !filters.doctor || patient.doctor === filters.doctor;

      return (
        matchesSearch &&
        matchesWard &&
        matchesDepartment &&
        matchesDoctor
      );
    });
  }, [patients, filters]);

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openAddForm() {
    setEditingPatient(null);
    setShowForm(true);
    setSidebarOpen(false);
  }

  function openEditForm(patient) {
    setEditingPatient(patient);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingPatient(null);
  }

  async function handleSave(patientData) {
    if (editingPatient) {
      const updated = await updatePatient(
        editingPatient.id,
        patientData
      );

      setPatients((previous) =>
        previous.map((patient) =>
          patient.id === updated.id ? updated : patient
        )
      );

      setNotification("Patient updated successfully.");
    } else {
      const created = await createPatient(patientData);

      setPatients((previous) => [created, ...previous]);

      setFilters(EMPTY_FILTERS);
      setNotification("Patient added successfully.");
    }

    closeForm();
  }

  async function handleConfirm() {
    if (!confirmation || busy) return;

    setBusy(true);
    setError("");

    const { type, patient } = confirmation;

    try {
      if (type === "delete") {
        await deletePatient(patient.id);

        setPatients((previous) =>
          previous.filter((item) => item.id !== patient.id)
        );

        setNotification("Patient deleted successfully.");
      } else {
        const updated = await dischargePatient(patient.id);

        setPatients((previous) =>
          previous.map((item) =>
            item.id === updated.id ? updated : item
          )
        );

        setNotification("Patient discharged successfully.");
      }

      setConfirmation(null);
    } catch (err) {
      setError(err.message);
      setConfirmation(null);
    } finally {
      setBusy(false);
    }
  }

  function navigateTo(section) {
    document.getElementById(section)?.scrollIntoView({
      behavior: "smooth",
    });

    setSidebarOpen(false);
  }

  function renderFilter(name, label, values) {
    return (
      <select
        name={name}
        value={filters[name]}
        onChange={handleFilterChange}
        aria-label={`Filter by ${label}`}
      >
        <option value="">All {label}</option>

        {values.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
      >
        <div className="brand">
          <div className="brand-icon">
            <Activity size={26} />
          </div>

          <div>
            <h2>MediCare</h2>
            <span>Hospital Management</span>
          </div>
        </div>

        <div className="navigation-label">WORKSPACE</div>

        <nav className="navigation">
          <button
            className="nav-item"
            onClick={() => navigateTo("overview")}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            className="nav-item active"
            onClick={() => navigateTo("patient-records")}
          >
            <Users size={20} />
            Patients
          </button>

          <button
            className="nav-item"
            onClick={openAddForm}
            disabled={loading || !!error && !options.genders.length}
          >
            <Plus size={20} />
            Add Patient
          </button>
        </nav>

        <div className="sidebar-bottom">
          <Hospital size={24} />

          <div>
            <strong>Hospital Administration</strong>
            <small>Patient Admission System</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Open navigation"
            >
              <Menu size={24} />
            </button>

            <span>Hospital Administration / Patients</span>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">HA</div>
            <div>
              <strong>Hospital Staff</strong>
              <small>Administration</small>
            </div>
          </div>
        </header>

        <div className="page-content">
          <section id="overview">
            <div className="page-heading">
              <div>
                <div className="eyebrow">
                  PATIENT MANAGEMENT
                </div>

                <h1>Patient Admissions</h1>

                <p>
                  Manage hospital admissions and patient records.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={openAddForm}
                disabled={loading || !options.genders.length}
              >
                <Plus size={20} />
                Add Patient
              </button>
            </div>

            <Dashboard patients={patients} />
          </section>

          {error && (
            <div className="error-alert" role="alert">
              <AlertCircle size={20} />
              <span>{error}</span>

              <button
                className="icon-button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <section
            className="records-panel"
            id="patient-records"
          >
            <div className="panel-header">
              <div>
                <h2>Patient Records</h2>
                <p>View and manage all patient admissions.</p>
              </div>

              <button
                className="secondary-button"
                onClick={loadData}
                disabled={loading || busy}
              >
                <RefreshCw
                  size={17}
                  className={loading ? "spinning" : ""}
                />
                Refresh
              </button>
            </div>

            <div className="filters">
              <div className="search-box">
                <Search size={19} />

                <input
                  type="search"
                  name="search"
                  placeholder="Search by patient name..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  aria-label="Search patients by name"
                />
              </div>

              {renderFilter("ward", "Wards", options.wards)}

              {renderFilter(
                "department",
                "Departments",
                options.departments
              )}

              {renderFilter(
                "doctor",
                "Doctors",
                options.doctors
              )}

              <button
                className="secondary-button"
                onClick={() => setFilters(EMPTY_FILTERS)}
              >
                <Filter size={16} />
                Reset
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <RefreshCw
                  size={30}
                  className="spinning"
                />
                <p>Loading patient records...</p>
              </div>
            ) : (
              <PatientTable
                patients={filteredPatients}
                onEdit={openEditForm}
                onDelete={(patient) =>
                  setConfirmation({
                    type: "delete",
                    patient,
                  })
                }
                onDischarge={(patient) =>
                  setConfirmation({
                    type: "discharge",
                    patient,
                  })
                }
                busy={busy}
              />
            )}

            <div className="table-footer">
              Showing {filteredPatients.length} of{" "}
              {patients.length} patients
            </div>
          </section>

          <footer className="page-footer">
            MediCare Patient Admission Management System
            <span>Demo application · Fictional records only</span>
          </footer>
        </div>
      </main>

      {showForm && (
        <PatientForm
          patient={editingPatient}
          options={options}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {confirmation && (
        <div className="modal-overlay">
          <div
            className="confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
          >
            <div
              className={`confirmation-icon ${
                confirmation.type === "delete"
                  ? "danger"
                  : "success"
              }`}
            >
              {confirmation.type === "delete" ? (
                <Trash2 size={28} />
              ) : (
                <LogOut size={28} />
              )}
            </div>

            <h2 id="confirmation-title">
              {confirmation.type === "delete"
                ? "Delete Patient?"
                : "Discharge Patient?"}
            </h2>

            <p>
              {confirmation.type === "delete"
                ? `Are you sure you want to delete ${confirmation.patient.name}? This action cannot be undone.`
                : `Are you sure you want to discharge ${confirmation.patient.name}?`}
            </p>

            <div className="confirmation-actions">
              <button
                className="secondary-button"
                onClick={() => setConfirmation(null)}
                disabled={busy}
              >
                Cancel
              </button>

              <button
                className={
                  confirmation.type === "delete"
                    ? "danger-button"
                    : "primary-button"
                }
                onClick={handleConfirm}
                disabled={busy}
              >
                {busy
                  ? "Processing..."
                  : confirmation.type === "delete"
                    ? "Delete Patient"
                    : "Confirm Discharge"}
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="toast" role="status">
          <CheckCircle2 size={22} />
          <span>{notification}</span>

          <button
            className="icon-button"
            onClick={() => setNotification("")}
            aria-label="Dismiss notification"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
