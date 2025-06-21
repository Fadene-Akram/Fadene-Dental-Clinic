import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./AddPaymentModal.module.css";
import { createExpense } from "../../api/api";

function AddPaymentModal({ setShowModal }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const expenseData = {
      ...data,
      type:
        data.expenseType === "Laboratory Expense"
          ? "laboratory"
          : "consumables",
    };

    try {
      await createExpense(expenseData);
      window.location.reload(); // Refresh after successful submission
    } catch (error) {
      alert("Failed to add expense. Please try again.");
      console.error("Error adding expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p className={styles.modalTitle}>New Expense</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className={styles.modalLabel}>Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className={styles.modalInput}
            autoFocus
          />
          {errors.name && (
            <p className={styles.errorText}>{errors.name.message}</p>
          )}

          <label className={styles.modalLabel}>Amount</label>
          <input
            type="number"
            {...register("amount", {
              required: "Amount is required",
              min: { value: 1, message: "Amount must be at least 1" },
            })}
            className={styles.modalInput}
          />
          {errors.amount && (
            <p className={styles.errorText}>{errors.amount.message}</p>
          )}

          <label className={styles.modalLabel}>Date</label>
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className={styles.modalInput}
          />
          {errors.date && (
            <p className={styles.errorText}>{errors.date.message}</p>
          )}

          <label className={styles.modalLabel}>Expense Type</label>
          <select
            {...register("expenseType", {
              required: "Expense type is required",
            })}
            className={styles.modalInput}
          >
            <option value="">Select Expense Type</option>
            <option value="Laboratory Expense">Laboratory Expense</option>
            <option value="Consumable Expense">Consumable Expense</option>
          </select>
          {errors.expenseType && (
            <p className={styles.errorText}>{errors.expenseType.message}</p>
          )}

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setShowModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPaymentModal;
