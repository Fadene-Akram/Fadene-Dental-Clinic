import styles from "./DeleteConfirmationModal.module.css";

function DeleteConfirmationModal({ patient, onClose, onConfirm }) {
  const handleDelete = () => {
    onConfirm(); // This will trigger the delete in the parent component
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalContentTitle}>Confirm Deletion</h2>
        <p className={styles.modalContentP}>
          Are you sure you want to delete{" "}
          <strong style={{ color: "black", fontWeight: "200" }}>
            {patient.full_name}
          </strong>{" "}
          ?
        </p>
        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
