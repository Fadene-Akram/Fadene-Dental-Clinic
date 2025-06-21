import axios from "axios";

const baseURL = "http://localhost:8000/api/";

//---------------------Authentication and User Management---------------------//
export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${baseURL}register/`, {
      username: data.username,
      password: data.password,
      security_question: data.security_question,
      security_answer: data.security_answer,
      role: data.role, // Send the selected role
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || "Registration failed. Please try again."
    );
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${baseURL}login/`, {
      username: data.username,
      password: data.password,
    });

    const token = response.data.token;
    const expiryTime = Date.now() + 86400000; //  Token valid for 24 hours (1 day)

    //  Store token & expiry time
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiry", expiryTime);
    localStorage.setItem("isRegistered", "true"); //  Mark as registered
    localStorage.setItem("userRole", response.data.role);

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed. Please try again.";
  }
};

export const fetchSecurityQuestion = async (username) => {
  try {
    const response = await axios.post(`${baseURL}get_security_question/`, {
      username,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "User not found";
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await axios.post(`${baseURL}reset_password/`, {
      username: data.username,
      security_answer: data.security_answer,
      new_password: data.new_password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.security_answer || "Incorrect security answer";
  }
};

//---------------------Patient Management---------------------//

export async function addPatient(patientData) {
  try {
    const response = await fetch(`${baseURL}patients/add/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      throw new Error("Failed to add patient");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding patient:", error);
    throw error;
  }
}

export async function fetchPatients(filters = {}) {
  try {
    // Construct query parameters
    const params = new URLSearchParams();

    // Add filters to query parameters
    Object.keys(filters).forEach((key) => {
      if (filters[key] != null && filters[key] !== "") {
        params.append(key, filters[key]);
      }
    });

    const response = await fetch(
      `${baseURL}patients/get_patients/?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch patients");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
}

export async function deletePatient(patientId) {
  try {
    const response = await fetch(`${baseURL}patients/delete/${patientId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Try to parse error message from response
      const errorData = await response.text().catch(() => "");
      throw new Error(
        errorData || `Failed to delete patient. Status: ${response.status}`
      );
    }

    // Return true for successful deletion, instead of trying to parse JSON
    return true;
  } catch (error) {
    console.error("Error deleting patient:", error);
    throw error;
  }
}

export async function updatePatient(patientId, updatedData) {
  try {
    const response = await fetch(`${baseURL}patients/edit/${patientId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.text().catch(() => "");
      throw new Error(
        errorData || `Failed to update patient. Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating patient:", error);
    throw error;
  }
}

export async function fetchPatientSummary(patientId) {
  try {
    const response = await fetch(`${baseURL}patients/summary/${patientId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch patient summary");
    }

    return await response.json(); // Only call json() once
  } catch (error) {
    console.error("Error fetching patient summary:", error);
    throw error;
  }
}

export async function fetchPatientConsultations(patientId) {
  try {
    const response = await fetch(
      `${baseURL}patients/consultations/${patientId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch patient consultations");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching patient consultations:", error);
    throw error;
  }
}

//---------------------Appointment Management---------------------//

export async function fetchAppointments(
  currentDate,
  currentView,
  setAppointments,
  setLoading,
  setError
) {
  setLoading(true);
  setError(null);

  try {
    // Format date to YYYY-MM-DD using local time zone
    const formattedDate = currentDate.toLocaleDateString("en-CA"); // "en-CA" ensures YYYY-MM-DD format

    const response = await axios.get(`${baseURL}appointments/`, {
      params: {
        view: currentView,
        date: formattedDate,
      },
    });

    let appointmentsData = [];

    if (Array.isArray(response.data)) {
      appointmentsData = response.data;
    } else if (response.data && typeof response.data === "object") {
      if (response.data.results && Array.isArray(response.data.results)) {
        appointmentsData = response.data.results;
        console.log("Data has results array");
      } else if (Object.keys(response.data).length > 0) {
        appointmentsData = [response.data];
        console.log("Data appears to be a single object");
      } else {
        console.log("Data is an empty object");
      }
    }

    // Transform data for the component
    const formattedAppointments = appointmentsData.map((apt) => ({
      id: apt.id || Math.random().toString(36).substr(2, 9),
      date: apt.date ? new Date(apt.date) : new Date(),
      time: apt.start_time || "12:00 PM",
      patient: apt.patient || "Unknown Patient",
      description: apt.description || "",
      paid: parseFloat(apt.paid_amount || 0),
      remaining: parseFloat(apt.remaining_amount || 0),
      duration: apt.duration || 0,
    }));
    // console.log("Formatted appointments:", formattedAppointments);
    setAppointments(formattedAppointments);
  } catch (err) {
    setError("Failed to fetch appointments. Please try again.");
    console.error("Error fetching appointments:", err);
    console.error(
      "Error details:",
      err.response ? err.response.data : "No response data"
    );
  } finally {
    setLoading(false);
  }
}

export async function fetchAppointmentPatients(setPatients) {
  try {
    const response = await axios.get(
      `${baseURL}patients/appointment_patient_list`
    );
    setPatients(response.data.patients);
  } catch (err) {
    console.error("Error fetching patients:", err);
  }
}

export async function createAppointment(
  appointmentData,
  selectedDate,
  setAppointments,
  setShowModal,
  setError
) {
  try {
    console.log(
      "Creating appointment with data:",
      appointmentData,
      selectedDate.toLocaleDateString("en-CA")
    );

    const response = await axios.post(`${baseURL}appointments/create/`, {
      ...appointmentData,
      date: selectedDate.toISOString().split("T")[0], // Avoid time shifting
      start_time: appointmentData.time,
    });

    console.log("Response from create appointment:", response.data);
    // Convert API response to frontend format
    const newAppointment = {
      ...response.data,
      date: new Date(response.data.date),
      time: response.data.start_time,
      patient: response.data.patient,
      paid: parseFloat(response.data.paid_amount),
      remaining: parseFloat(response.data.remaining_amount),
    };

    setAppointments((prevAppointments) => [
      ...prevAppointments,
      newAppointment,
    ]);
    setShowModal(false);
  } catch (error) {
    console.error("Error creating appointment:", error);
    setError("Failed to create appointment. Please try again.");
  }
}

export async function updateAppointment(
  appointmentData,
  setAppointments,
  setShowModal,
  setError
) {
  try {
    console.log("date", appointmentData.date);
    const formattedDate = new Date(appointmentData.date)
      .toISOString()
      .split("T")[0];

    const formattedData = {
      date: formattedDate,
      start_time: appointmentData.start_time,
      description: appointmentData.description,
      paid_amount: appointmentData.paid_amount,
      remaining_amount: appointmentData.remaining_amount,
      duration: appointmentData.duration,
      id: appointmentData.id,
      patient: appointmentData.patient_fullname,
    };

    console.log("Sending formatted data:", formattedData);

    const response = await axios.put(
      `${baseURL}appointments/update/`,
      formattedData
    );

    // console.log("Response from update:", response.data);

    const updatedAppointment = {
      ...response.data,
      date: new Date(response.data.date),
      time: response.data.start_time,
      patient: response.data.patient,
      paid: parseFloat(response.data.paid_amount),
      remaining: parseFloat(response.data.remaining_amount),
    };

    setAppointments((prevAppointments) =>
      prevAppointments.map((apt) =>
        apt.id === updatedAppointment.id ? updatedAppointment : apt
      )
    );

    setShowModal(false);
  } catch (error) {
    console.error("Error updating appointment:", error.response?.data || error);
    setError("Failed to update appointment. Please try again.");
  }
}

export async function deleteAppointment(
  appointmentId,
  setAppointments,
  setShowModal,
  setError
) {
  try {
    console.log("Deleting appointment with ID:", appointmentId);
    await axios.delete(`${baseURL}appointments/delete/${appointmentId}/`);

    // Update local state
    setAppointments((appointments) =>
      appointments.filter((apt) => apt.id !== appointmentId)
    );
    setShowModal(false);
  } catch (error) {
    console.error("Error deleting appointment:", error);
    setError("Failed to delete appointment. Please try again.");
  }
}

//---------------------Expenses Management---------------------//

export const fetchLaboratoryExpenses = async (
  page = 1,
  labItemsPerPage,
  setLaboratoryExpenses,
  setLabTotalItems,
  setLabTotalPages
) => {
  try {
    const response = await axios.get(
      `${baseURL}expenses/laboratory-expenses/`,
      {
        params: { page, itemsPerPage: labItemsPerPage },
      }
    );

    setLaboratoryExpenses(response.data.results.laboratory_expenses);
    setLabTotalItems(response.data.count);
    setLabTotalPages(Math.ceil(response.data.count / labItemsPerPage));
  } catch (error) {
    console.error("Error fetching laboratory expenses:", error);
  }
};

export const fetchConsumablesExpenses = async (
  page = 1,
  consumablesItemsPerPage,
  setConsumablesExpenses,
  setConsumablesTotalItems,
  setConsumablesTotalPages
) => {
  try {
    const response = await axios.get(
      `${baseURL}expenses/consumables-expenses/`,
      {
        params: { page, itemsPerPage: consumablesItemsPerPage },
      }
    );

    setConsumablesExpenses(response.data.results.consumable_expenses);
    setConsumablesTotalItems(response.data.count);
    setConsumablesTotalPages(
      Math.ceil(response.data.count / consumablesItemsPerPage)
    );
  } catch (error) {
    console.error("Error fetching consumables expenses:", error);
  }
};

export const fetchSummaryData = async (setSummaryData) => {
  try {
    const response = await axios.get(`${baseURL}expenses/summary/`);
    setSummaryData(response.data);
  } catch (error) {
    console.error("Error fetching expense summary data:", error);
  }
};

export const createExpense = async (expenseData, setShowModal) => {
  try {
    const response = await axios.post(
      `${baseURL}expenses/create/`,
      expenseData
    );

    if (response.status === 201) {
      console.log("Expense successfully added:", response.data);
      setShowModal(false);
    }
  } catch (error) {
    console.error("Error adding expense:", error);
  }
};

//---------------------Notes Management---------------------//

export const fetchAllTasks = async () => {
  try {
    const response = await axios.get(`${baseURL}tasks/`);
    return { data: response.data, error: null };
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return {
      data: null,
      error: "Failed to load tasks. Please try again later.",
    };
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${baseURL}tasks/create/`, {
      title: taskData.title,
      description: taskData.description,
      due_date: taskData.dueDate || null,
    });
    return { data: response.data, error: null };
  } catch (err) {
    console.error("Error adding task:", err);
    return { data: null, error: "Failed to add task. Please try again." };
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await axios.put(`${baseURL}tasks/${taskId}/`, taskData);
    return { data: response.data, error: null };
  } catch (err) {
    console.error("Error updating task:", err);
    return { data: null, error: "Failed to update task. Please try again." };
  }
};

export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${baseURL}tasks/delete/${taskId}/`);
    return { success: true, error: null };
  } catch (err) {
    console.error("Error deleting task:", err);
    return {
      success: false,
      error: "Failed to delete task. Please try again.",
    };
  }
};

export const moveTask = async (taskId, newStatus) => {
  try {
    await axios.post(`${baseURL}tasks/move/${taskId}/`, {
      status: newStatus,
    });
    return { success: true, error: null };
  } catch (err) {
    console.error("Error moving task:", err);
    return { success: false, error: "Failed to move task. Please try again." };
  }
};

//---------------------Dashboard Management---------------------//

export const fetchMonthlyReport = async () => {
  try {
    const response = await axios.get(`${baseURL}dashboard/monthly_report/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to load data. Please try again.");
  }
};

export const fetchPatientPopulation = async (period) => {
  try {
    const response = await axios.get(
      `${baseURL}dashboard/patient_population/?period=${period.toLowerCase()}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data. Using fallback data.");
  }
};

export const fetchRevenueExpenses = async (period) => {
  try {
    const response = await axios.get(
      `${baseURL}dashboard/revenue_expenses/${period}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching revenue and expenses:", error);
    throw error;
  }
};

export const fetchPatientGenderData = async () => {
  try {
    const response = await axios.get(
      `${baseURL}dashboard/get_patient_gender_count`
    );
    if (
      response.data &&
      typeof response.data.male_count === "number" &&
      typeof response.data.female_count === "number"
    ) {
      return [
        { label: "Male", value: response.data.male_count, color: "#243956" },
        {
          label: "Female",
          value: response.data.female_count,
          color: "#d3feff",
        },
      ];
    } else {
      throw new Error("Unexpected API response format");
    }
  } catch (error) {
    console.error("Error fetching gender data:", error);
    throw error;
  }
};

export const fetchAppointmentsDashboard = async (currentDate, currentView) => {
  try {
    const formattedDate = currentDate.toLocaleDateString("en-CA");
    const response = await axios.get(`${baseURL}appointments/`, {
      params: { view: currentView, date: formattedDate },
    });

    let appointmentsData = response.data.results || response.data || [];
    if (!Array.isArray(appointmentsData)) {
      appointmentsData = [appointmentsData];
    }

    return appointmentsData.map((apt) => ({
      id: apt.id || Math.random().toString(36).substr(2, 9),
      date: apt.date ? new Date(apt.date) : new Date(),
      time: apt.start_time || "12:00 PM",
      patient: apt.patient || "Unknown Patient",
      description: apt.description || "",
      paid: parseFloat(apt.paid_amount || 0),
      remaining: parseFloat(apt.remaining_amount || 0),
      duration: apt.duration || 0,
    }));
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Failed to fetch appointments. Please try again.");
  }
};

export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${baseURL}tasks/`);
    return Object.values(response.data).flat();
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return [];
  }
};
