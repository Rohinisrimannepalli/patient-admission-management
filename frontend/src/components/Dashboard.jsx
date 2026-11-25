
import {
  Users,
  BedDouble,
  UserCheck,
  Building2,
} from "lucide-react";

export default function Dashboard({ patients = [] }) {
  const total = patients.length;

  const admitted = patients.filter(
    (patient) => patient.status === "Admitted"
  ).length;

  const discharged = patients.filter(
    (patient) => patient.status === "Discharged"
  ).length;

  const activeWards = new Set(
    patients
      .filter((patient) => patient.status === "Admitted")
      .map((patient) => patient.ward)
  ).size;

  const stats = [
    {
      title: "Total Patients",
      value: total,
      icon: Users,
      color: "blue",
      description: "All registered patients",
    },
    {
      title: "Currently Admitted",
      value: admitted,
      icon: BedDouble,
      color: "green",
      description: "Patients receiving care",
    },
    {
      title: "Discharged",
      value: discharged,
      icon: UserCheck,
      color: "orange",
      description: "Completed admissions",
    },
    {
      title: "Active Wards",
      value: activeWards,
      icon: Building2,
      color: "purple",
      description: "Wards with admitted patients",
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div className="stat-card" key={stat.title}>
            <div className="stat-header">
              <span>{stat.title}</span>

              <div className={`stat-icon ${stat.color}`}>
                <Icon size={22} />
              </div>
            </div>

            <h2>{stat.value}</h2>
            <p>{stat.description}</p>
          </div>
        );
      })}
    </div>
  );
}
