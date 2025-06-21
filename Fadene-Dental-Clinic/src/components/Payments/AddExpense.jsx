import { useState } from "react";
import styles from "./AddExpense.module.css";
import AddPaymentModal from "./AddPaymentModal";

function AddExpense({}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles.addExpenseContainer}>
      <p className={styles.addExpenseTitle}>Add Expenses</p>
      <button
        className={styles.addExpenseBtn}
        onClick={() => setShowModal(true)}
      >
        New Expense
      </button>

      {showModal && <AddPaymentModal setShowModal={setShowModal} />}
    </div>
  );
}

export default AddExpense;
