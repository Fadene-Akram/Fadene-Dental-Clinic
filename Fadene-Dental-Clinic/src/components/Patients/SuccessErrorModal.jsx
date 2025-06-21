import styles from "./SuccessErrorModal.module.css";

const SuccessErrorModal = ({
  open,
  onClose,
  title,
  description,
  isSuccess,
}) => {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={isSuccess ? styles.successTitle : styles.errorTitle}>
          {title}
        </h2>
        <p>{description}</p>
        <button onClick={onClose} className={styles.closeButton}>
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessErrorModal;
