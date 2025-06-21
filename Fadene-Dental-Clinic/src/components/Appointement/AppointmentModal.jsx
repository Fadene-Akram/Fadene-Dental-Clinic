// import { useState, useEffect } from "react";
// import { X, Search } from "lucide-react";
// import styles from "./AppointmentModal.module.css";

// function AppointmentModal({
//   showModal,
//   setShowModal,
//   selectedDate,
//   editingAppointment,
//   patients = [],
//   onCreateAppointment,
//   onUpdateAppointment,
//   onDeleteAppointment,
// }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredPatients, setFilteredPatients] = useState([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [newAppointment, setNewAppointment] = useState({
//     patient: "",
//     patient_id: "",
//     description: "",
//     time: "",
//     date: selectedDate || new Date(),
//     duration: 30,
//     paid_amount: 0,
//     remaining_amount: 0,
//   });

//   useEffect(() => {
//     if (editingAppointment) {
//       const formattedTime = formatTimeForInput(editingAppointment.time);
//       setNewAppointment({
//         ...editingAppointment,
//         time: formattedTime,
//       });
//       setSearchTerm(editingAppointment.patient || "");
//     } else {
//       resetForm();
//     }
//   }, [editingAppointment, selectedDate, showModal]);

//   useEffect(() => {
//     if (!Array.isArray(patients)) return;
//     setFilteredPatients(
//       searchTerm.trim()
//         ? patients.filter((p) =>
//             p.full_name.toLowerCase().includes(searchTerm.toLowerCase())
//           )
//         : patients
//     );
//   }, [searchTerm, patients]);

//   const resetForm = () => {
//     setNewAppointment({
//       patient: "",
//       patient_id: "",
//       description: "",
//       time: "",
//       date: selectedDate || new Date(),
//       duration: 30,
//       paid_amount: 0,
//       remaining_amount: 0,
//     });
//     setSearchTerm("");
//   };

//   const formatTimeForInput = (timeString) => {
//     if (!timeString) return "";
//     const [timePart, period] = timeString.split(" ");
//     let [hours, minutes] = timePart.split(":").map(Number);
//     if (period === "PM" && hours < 12) hours += 12;
//     if (period === "AM" && hours === 12) hours = 0;
//     return `${hours.toString().padStart(2, "0")}:${minutes
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewAppointment((prev) => ({
//       ...prev,
//       [name]:
//         name === "duration" ||
//         name === "paid_amount" ||
//         name === "remaining_amount"
//           ? parseFloat(value) || 0
//           : value,
//     }));
//   };

//   const handlePatientSelect = (patient) => {
//     setNewAppointment((prev) => ({
//       ...prev,
//       patient: patient.full_name,
//       patient_id: patient.id,
//     }));
//     setSearchTerm(patient.full_name);
//     setIsDropdownOpen(false);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (editingAppointment) {
//       if (!editingAppointment.id) {
//         console.error("Error: Missing appointment ID for update.");
//         return;
//       }

//       const appointmentData = {
//         id: editingAppointment.id, // Ensure ID is sent
//         patient_fullname: newAppointment.patient, // Backend expects ID
//         description: newAppointment.description,
//         start_time: newAppointment.time,
//         date: newAppointment.date,
//         duration: newAppointment.duration,
//         paid_amount: newAppointment.paid,
//         remaining_amount: newAppointment.remaining,
//       };

//       console.log("Sending update request:", appointmentData);
//       onUpdateAppointment(appointmentData);
//     } else {
//       onCreateAppointment(newAppointment);
//     }

//     resetForm();
//     setShowModal(false);
//   };

//   if (!showModal) return null;

//   return (
//     <div className={styles.modal}>
//       <div className={styles.modalContent}>
//         <div className={styles.modalHeader}>
//           <h3>{editingAppointment ? "Edit Appointment" : "New Appointment"}</h3>
//           <button
//             className={styles.closeButton}
//             onClick={() => setShowModal(false)}
//           >
//             <X className={styles.icon} />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className={styles.modalBody}>
//           <div className={styles.formGroup}>
//             <label>Patient</label>
//             <div className={styles.searchableSelect}>
//               <div className={styles.searchInputContainer}>
//                 <Search className={styles.searchIcon} />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onFocus={() => setIsDropdownOpen(true)}
//                   onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Delay to allow click selection
//                   placeholder="Search patients..."
//                   className={styles.searchInput}
//                   required
//                 />
//               </div>
//               {isDropdownOpen && filteredPatients.length > 0 && (
//                 <div className={styles.dropdownMenu}>
//                   {filteredPatients.map((patient) => (
//                     <div
//                       key={patient.id}
//                       className={styles.dropdownItem}
//                       onMouseDown={() => handlePatientSelect(patient)} // Prevents losing focus before selection
//                     >
//                       {patient.full_name}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className={styles.formGroup}>
//             <label>Description</label>
//             <textarea
//               name="description"
//               value={newAppointment.description}
//               onChange={handleChange}
//               className={styles.textarea}
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Time</label>
//             <input
//               type="time"
//               name="time"
//               value={newAppointment.time}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Duration (minutes)</label>
//             <input
//               type="number"
//               name="duration"
//               value={newAppointment.duration}
//               onChange={handleChange}
//               // min="15"
//               // step="15"
//               required
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Paid Amount</label>
//             <input
//               type="number"
//               name="paid_amount"
//               value={newAppointment.paid}
//               onChange={handleChange}
//               min="0"
//               step="5"
//               required
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label>Remainig Amount</label>
//             <input
//               type="number"
//               name="remaining_amount"
//               value={newAppointment.remaining}
//               onChange={handleChange}
//               min="0"
//               step="5"
//               required
//             />
//           </div>
//           <div className={styles.modalFooter}>
//             <button
//               type="button"
//               className={styles.cancelButton}
//               onClick={() => setShowModal(false)}
//             >
//               Cancel
//             </button>
//             <button type="submit" className={styles.submitButton}>
//               {editingAppointment ? "Update Appointment" : "Save Appointment"}
//             </button>
//           </div>
//           {editingAppointment && (
//             <button
//               type="button"
//               className={styles.deleteButton}
//               onClick={() => onDeleteAppointment(editingAppointment.id)}
//             >
//               Delete
//             </button>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AppointmentModal;

import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import styles from "./AppointmentModal.module.css";

function AppointmentModal({
  showModal,
  setShowModal,
  selectedDate,
  editingAppointment,
  patients = [],
  onCreateAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patient: "",
    patient_id: "",
    description: "",
    time: "",
    date: selectedDate || new Date(),
    duration: 30,
    paid_amount: 0,
    remaining_amount: 0,
  });

  useEffect(() => {
    if (editingAppointment) {
      const formattedTime = formatTimeForInput(editingAppointment.time);
      setNewAppointment({
        ...editingAppointment,
        time: formattedTime,
        // Map backend fields to frontend fields
        paid_amount:
          editingAppointment.paid_amount || editingAppointment.paid || 0,
        remaining_amount:
          editingAppointment.remaining_amount ||
          editingAppointment.remaining ||
          0,
      });
      setSearchTerm(editingAppointment.patient || "");
    } else {
      resetForm();
    }
  }, [editingAppointment, selectedDate, showModal]);

  useEffect(() => {
    if (!Array.isArray(patients)) return;
    setFilteredPatients(
      searchTerm.trim()
        ? patients.filter((p) =>
            p.full_name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : patients
    );
  }, [searchTerm, patients]);

  const resetForm = () => {
    setNewAppointment({
      patient: "",
      patient_id: "",
      description: "",
      time: "",
      date: selectedDate || new Date(),
      duration: 30,
      paid_amount: 0,
      remaining_amount: 0,
    });
    setSearchTerm("");
  };

  const formatTimeForInput = (timeString) => {
    if (!timeString) return "";
    const [timePart, period] = timeString.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({
      ...prev,
      [name]:
        name === "duration" ||
        name === "paid_amount" ||
        name === "remaining_amount"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handlePatientSelect = (patient) => {
    setNewAppointment((prev) => ({
      ...prev,
      patient: patient.full_name,
      patient_id: patient.id,
    }));
    setSearchTerm(patient.full_name);
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingAppointment) {
      if (!editingAppointment.id) {
        console.error("Error: Missing appointment ID for update.");
        return;
      }

      const appointmentData = {
        id: editingAppointment.id,
        patient_fullname: newAppointment.patient,
        description: newAppointment.description,
        start_time: newAppointment.time,
        date: newAppointment.date,
        duration: newAppointment.duration,
        paid_amount: newAppointment.paid_amount, // Fixed: use paid_amount
        remaining_amount: newAppointment.remaining_amount, // Fixed: use remaining_amount
      };

      console.log("Sending update request:", appointmentData);
      onUpdateAppointment(appointmentData);
    } else {
      onCreateAppointment(newAppointment);
    }

    resetForm();
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{editingAppointment ? "Edit Appointment" : "New Appointment"}</h3>
          <button
            className={styles.closeButton}
            onClick={() => setShowModal(false)}
          >
            <X className={styles.icon} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>Patient</label>
            <div className={styles.searchableSelect}>
              <div className={styles.searchInputContainer}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  placeholder="Search patients..."
                  className={styles.searchInput}
                  required
                />
              </div>
              {isDropdownOpen && filteredPatients.length > 0 && (
                <div className={styles.dropdownMenu}>
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={styles.dropdownItem}
                      onMouseDown={() => handlePatientSelect(patient)}
                    >
                      {patient.full_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={newAppointment.description}
              onChange={handleChange}
              className={styles.textarea}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={newAppointment.time}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={newAppointment.duration}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Paid Amount</label>
            <input
              type="number"
              name="paid_amount"
              value={newAppointment.paid_amount}
              onChange={handleChange}
              min="0"
              step="5"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Remaining Amount</label>
            <input
              type="number"
              name="remaining_amount"
              value={newAppointment.remaining_amount}
              onChange={handleChange}
              min="0"
              step="5"
              required
            />
          </div>
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {editingAppointment ? "Update Appointment" : "Save Appointment"}
            </button>
          </div>
          {editingAppointment && (
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => onDeleteAppointment(editingAppointment.id)}
            >
              Delete
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default AppointmentModal;
