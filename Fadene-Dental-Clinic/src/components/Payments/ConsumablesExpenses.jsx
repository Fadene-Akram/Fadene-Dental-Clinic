import ExpenseTableRow from "./ExpenseTableRow";
import styles from "./ConsumablesExpenses.module.css";

function ConsumablesExpenses({
  expenseData,
  totalItems,
  totalPages,
  currentPage,
  setCurrentPage,
}) {
  const itemsPerPage = 6;

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const indexOfFirstItem =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={styles.consumablesTableContainer}>
      <p className={styles.consumablesTableTitle}>Consumables Expenses</p>
      <div className={styles.consumablesTable}>
        <div className={styles.consumablesTableHeader}>
          <p className={styles.consumablesTableHeaderItem}>ID</p>
          <p className={styles.consumablesTableHeaderItem}>Name</p>
          <p className={styles.consumablesTableHeaderItem}>Amount</p>
          <p className={styles.consumablesTableHeaderItem}>Date</p>
        </div>
        <div className={styles.consumablesTableBody}>
          {expenseData && expenseData.length > 0 ? (
            expenseData.map((expense) => (
              <ExpenseTableRow key={expense.id} {...expense} />
            ))
          ) : (
            <div className={styles.noData}>No expenses found</div>
          )}
        </div>
      </div>

      <div className={styles.paginationContainer}>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Previous
        </button>

        <div className={styles.currentPageDisplay}>{currentPage}</div>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>

      <div className={styles.paginationInfo}>
        {totalItems > 0
          ? `Page ${currentPage} of ${totalPages} | Showing ${indexOfFirstItem} - ${indexOfLastItem} of ${totalItems} items`
          : "No items to display"}
      </div>
    </div>
  );
}

export default ConsumablesExpenses;
