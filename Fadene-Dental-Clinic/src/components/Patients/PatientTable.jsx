import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PatientTable.module.css";
import PatientTableRow from "./PatientTableRow";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

function PatientTable({ patients, onDeletePatient }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  function handleViewPatient(patient, id) {
    navigate(`/patients/patient-history/${id}`, { state: { patient } });
  }

  function handleDeletePatient(patient) {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  }

  function confirmDelete() {
    onDeletePatient(selectedPatient.id);
    setIsModalOpen(false);
    setSelectedPatient(null);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedPatient(null);
  }

  return (
    <div className={styles.patientsTableContainer}>
      <div className={styles.patientsTableaheader}>
        <p className={styles.headerColumn}>Full Name</p>
        <p className={styles.headerColumn}>Id</p>
        <p className={styles.headerColumn}>Age</p>
        <p className={styles.headerColumn}>Date Of Birth</p>
        <p className={styles.headerColumn}>Phone Number</p>
        <p className={styles.headerColumn}>Gender</p>
        <p className={styles.headerColumn}>Registration Date</p>
        <p className={styles.headerColumn}>Actions</p>
      </div>
      <div className={styles.patientsTableBody}>
        {patients.map((patient, index) => (
          <PatientTableRow
            key={patient.id}
            index={index}
            {...patient}
            onHandleViewPatient={handleViewPatient}
            onHandleDeletePatient={() => handleDeletePatient(patient)}
          />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <DeleteConfirmationModal
          patient={selectedPatient}
          onClose={closeModal}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default PatientTable;
