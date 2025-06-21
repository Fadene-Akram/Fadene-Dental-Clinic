import { useLocation, useNavigate } from "react-router-dom";
import styles from "./PatientHistory.module.css";
import maleIcon from "../../assets/icons/male-user.svg";
import femaleIcon from "../../assets/icons/female-user.svg";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import EditablePatientInfo from "./EditablePatientInfo";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useEffect, useState } from "react";
import {
  deletePatient,
  fetchPatientSummary,
  updatePatient,
  fetchPatientConsultations,
} from "../../api/api";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function PatientHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const [patientHistory, setPatientHistory] = useState(
    location.state?.patient || null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalRemainingAmount, setTotalRemainingAmount] = useState(0);
  const [totalConsultaion, setTotalConsultaion] = useState(0);
  const [consultations, setConsultations] = useState([]);

  function handleDeletePatient() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const confirmDelete = async () => {
    try {
      await deletePatient(patientHistory.id);
      setIsModalOpen(false);
      navigate(-1);
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  const handlePatientInfoUpdate = async (patientId, updatedData) => {
    try {
      const updatedPatient = await updatePatient(patientId, updatedData);
      // Update the local state with the new patient information
      setPatientHistory((prevPatient) => ({
        ...prevPatient,
        ...updatedData,
      }));
      console.log("Patient updated successfully:", updatedPatient);
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  useEffect(() => {
    if (!patientHistory) return;

    const fetchSummary = async () => {
      try {
        const summary = await fetchPatientSummary(patientHistory.id);
        setTotalPaidAmount(summary.totalPaidAmount || 0);
        setTotalRemainingAmount(summary.totalRemainingAmount || 0);
        setTotalConsultaion(summary.totalConsultaion || 0);
      } catch (error) {
        console.error("Error fetching patient summary:", error);
      }
    };

    const fetchConsultations = async () => {
      try {
        setLoading(true);
        const patientConsultations = await fetchPatientConsultations(
          patientHistory.id
        );
        setConsultations(patientConsultations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patient consultations:", error);
        setLoading(false);
      }
    };

    fetchSummary();
    fetchConsultations();
  }, [patientHistory]);

  function handleGoBack() {
    navigate(location.state?.from || "/patients");
  }

  return (
    <div className={styles.patientHistoryContainer}>
      <div className={styles.patientHeader}>
        <p className={styles.goBackToPatients} onClick={handleGoBack}>
          &larr;
        </p>
        <div className={styles.patientHeaderText}>
          <p className={styles.goBackToPatientsText}>Back to Patients List</p>
          <p className={styles.patientDetails}>Patient Details</p>
        </div>
      </div>
      {patientHistory ? (
        <>
          <div className={styles.patientNameandId}>
            {patientHistory.gender.toLowerCase() === "male" ? (
              <img
                className={styles.patientLogo}
                src={maleIcon}
                alt="male-patient-logo"
              />
            ) : (
              <img
                className={styles.patientLogo}
                src={femaleIcon}
                alt="female-patient-logo"
              />
            )}
            <div className={styles.patientNameandIdDetails}>
              <p className={styles.patientName}>{patientHistory.full_name}</p>
              <p className={styles.patientid}>
                Patient id:{" "}
                <span className={styles.patientidid}>{patientHistory.id}</span>
              </p>
            </div>
            <img
              src={deleteIcon}
              alt="delete-patient-icon"
              className={styles.patientDelete}
              onClick={handleDeletePatient}
            />
          </div>
          <div className={styles.patientInformationContainer}>
            <div className={styles.patientInformations}>
              <EditablePatientInfo
                patientHistory={patientHistory}
                onUpdate={handlePatientInfoUpdate}
              />
              <div className={styles.patientInformation}>
                <p className={styles.patientInformationHeader}>
                  Payment Information
                </p>
                <div className={styles.patientInformationGroup}>
                  <p className={styles.patientInformationLabel}>
                    Total Paid Amount :
                  </p>
                  <p className={styles.patientInformationValue}>
                    {totalPaidAmount}
                  </p>
                </div>
                <div className={styles.patientInformationGroup}>
                  <p className={styles.patientInformationLabel}>
                    Total Remaining Amount :
                  </p>
                  <p className={styles.patientInformationValue}>
                    {totalRemainingAmount}
                  </p>
                </div>
                <div className={styles.patientInformationGroup}>
                  <p className={styles.patientInformationLabel}>
                    Total Consultations :
                  </p>
                  <p className={styles.patientInformationValue}>
                    {totalConsultaion}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.patientConsultationHistory}>
              <p className={styles.patientConsultationTitle}>
                Consultation History
              </p>
              {loading ? (
                <Box className={styles.loadingContainer}>
                  <CircularProgress size={70} />
                </Box>
              ) : (
                <div className={styles.consultationsListContainer}>
                  {consultations.length > 0 ? (
                    consultations.map((consultation, index) => {
                      const consultationClass =
                        index % 2 === 0
                          ? `${styles.consultation} ${styles.consultationEven}`
                          : `${styles.consultation} ${styles.consultationOdd}`;

                      return (
                        <div key={index} className={consultationClass}>
                          <div className={styles.consultationDetails}>
                            <p className={styles.consultationDate}>
                              <span className={styles.consultationLabel}>
                                Date :
                              </span>{" "}
                              {consultation.date}
                            </p>
                            <p className={styles.consultationTime}>
                              <span className={styles.consultationLabel}>
                                Time :
                              </span>{" "}
                              {consultation.time}
                            </p>
                            <p className={styles.consultationCost}>
                              <span className={styles.consultationLabel}>
                                Cost :
                              </span>{" "}
                              {consultation.cost}
                            </p>
                            <p className={styles.consultationDescription}>
                              <span className={styles.consultationLabel}>
                                Description :
                              </span>{" "}
                              {consultation.description}
                            </p>
                          </div>
                          <div className={styles.consultationPayment}>
                            <p className={styles.consultationPaid}>
                              <span className={styles.consultationLabel}>
                                Paid :
                              </span>{" "}
                              {consultation.paid}
                            </p>
                            <p className={styles.consultationRemaining}>
                              <span className={styles.consultationLabel}>
                                Remaining :
                              </span>{" "}
                              {consultation.remaining}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className={styles.noConsultations}>
                      No consultations found
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>No patient data found.</p>
      )}
      {isModalOpen && (
        <DeleteConfirmationModal
          patient={patientHistory}
          onClose={closeModal}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default PatientHistory;
