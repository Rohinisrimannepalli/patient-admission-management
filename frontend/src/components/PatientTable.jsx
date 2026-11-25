
import {
  Pencil,
  Trash2,
  LogOut,
  Users,
} from "lucide-react";

export default function PatientTable({
  patients,
  onEdit,
  onDelete,
  onDischarge,
  busy,
}) {
  if (patients.length === 0) {
    return (
      <div className="empty-state">
        <Users size={48} />
        <h3>No patients found</h3>
        <p>Add a new patient or change your search filters.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="patient-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Ward</th>
            <th>Department</th>
            <th>Doctor</th>
            <th>Admission Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>
                <div className="patient-info">
                  <div className="avatar">
                    {patient.name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>{patient.name}</strong>
                    <small>
                      PT-{String(patient.id).padStart(4, "0")}
                    </small>
                  </div>
                </div>
              </td>

              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.ward}</td>
              <td>{patient.department}</td>
              <td>{patient.doctor}</td>

              <td>
                {new Date(
                  `${patient.admission_date}T00:00:00`
                ).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              <td>
                <span
                  className={`status-badge ${
                    patient.status === "Admitted"
                      ? "admitted"
                      : "discharged"
                  }`}
                >
                  <span className="status-dot" />
                  {patient.status}
                </span>
              </td>

              <td>
                <div className="action-buttons">
                  <button
                    className="action-button edit"
                    title="Edit patient"
                    aria-label={`Edit ${patient.name}`}
                    onClick={() => onEdit(patient)}
                    disabled={busy}
                  >
                    <Pencil size={16} />
                  </button>

                  {patient.status === "Admitted" && (
                    <button
                      className="action-button discharge"
                      title="Discharge patient"
                      aria-label={`Discharge ${patient.name}`}
                      onClick={() => onDischarge(patient)}
                      disabled={busy}
                    >
                      <LogOut size={16} />
                    </button>
                  )}

                  <button
                    className="action-button delete"
                    title="Delete patient"
                    aria-label={`Delete ${patient.name}`}
                    onClick={() => onDelete(patient)}
                    disabled={busy}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
