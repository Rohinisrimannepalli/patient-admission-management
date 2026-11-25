
const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const message = Array.isArray(data.detail)
      ? data.detail.map((error) => error.msg).join(", ")
      : data.detail || "Something went wrong";

    throw new Error(message);
  }

  return data;
}

export function getOptions() {
  return request("/patients/options");
}

export function getPatients(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  return request(`/patients/?${params.toString()}`);
}

export function createPatient(patient) {
  return request("/patients/", {
    method: "POST",
    body: JSON.stringify(patient),
  });
}

export function updatePatient(id, patient) {
  return request(`/patients/${id}`, {
    method: "PUT",
    body: JSON.stringify(patient),
  });
}

export function deletePatient(id) {
  return request(`/patients/${id}`, {
    method: "DELETE",
  });
}

export function dischargePatient(id) {
  return request(`/patients/${id}/discharge`, {
    method: "PATCH",
  });
}
