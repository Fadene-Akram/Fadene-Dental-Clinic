import styles from "./ExpenseTableRow.module.css";

function ExpenseTableRow({ index, name, id, amount, date }) {
  return (
    <div className={styles.rowContainer}>
      <p className={styles.rowColumn}>{id}</p>
      <p className={styles.rowColumn}>{name}</p>
      <p className={styles.rowColumn}>{amount}</p>
      <p className={styles.rowColumn}>{date}</p>
    </div>
  );
}

export default ExpenseTableRow;
