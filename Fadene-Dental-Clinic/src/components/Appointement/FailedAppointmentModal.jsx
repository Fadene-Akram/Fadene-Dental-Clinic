import styles from "./FailedAppointmentModal.module.css";

const FailedAppointmentModal = ({ onClose, title, description }) => {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p className={styles.errorTitle}>{title}</p>
        <p>{description}</p>
        <button onClick={onClose} className={styles.closeButton}>
          OK
        </button>
      </div>
    </div>
  );
};

export default FailedAppointmentModal;
