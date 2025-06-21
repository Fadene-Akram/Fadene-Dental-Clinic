import { useState, useEffect } from "react";
import {
  fetchLaboratoryExpenses,
  fetchConsumablesExpenses,
  fetchSummaryData,
} from "../../api/api";
import AddExpense from "../../components/Payments/AddExpense";
import ConsumablesExpenses from "../../components/Payments/ConsumablesExpenses";
import LaboratoryExpenses from "../../components/Payments/LaboratoryExpenses";
import PaymentCards from "../../components/Payments/PaymentCards";
import styles from "./Payments.module.css";

function Payments() {
  const [laboratoryExpenses, setLaboratoryExpenses] = useState([]);
  const [labCurrentPage, setLabCurrentPage] = useState(1);
  const [labTotalPages, setLabTotalPages] = useState(1);
  const [labTotalItems, setLabTotalItems] = useState(0);
  const labItemsPerPage = 6;

  const [consumablesExpenses, setConsumablesExpenses] = useState([]);
  const [consumablesCurrentPage, setConsumablesCurrentPage] = useState(1);
  const [consumablesTotalPages, setConsumablesTotalPages] = useState(1);
  const [consumablesTotalItems, setConsumablesTotalItems] = useState(0);
  const consumablesItemsPerPage = 6;

  const [summaryData, setSummaryData] = useState({
    total_expenses: 0,
    total_count: 0,
    laboratory_expenses: 0,
    consumable_expenses: 0,
  });

  useEffect(() => {
    fetchLaboratoryExpenses(
      labCurrentPage,
      labItemsPerPage,
      setLaboratoryExpenses,
      setLabTotalItems,
      setLabTotalPages
    );
  }, [labCurrentPage]);

  useEffect(() => {
    fetchConsumablesExpenses(
      consumablesCurrentPage,
      consumablesItemsPerPage,
      setConsumablesExpenses,
      setConsumablesTotalItems,
      setConsumablesTotalPages
    );
  }, [consumablesCurrentPage]);

  useEffect(() => {
    fetchSummaryData(setSummaryData);
  }, []);

  return (
    <div className={styles.paymentContainer}>
      <p className={styles.paymentTitle}>Payment</p>
      <PaymentCards summaryData={summaryData} />
      <AddExpense />
      <div className={styles.tablesContainer}>
        <LaboratoryExpenses
          expenseData={laboratoryExpenses}
          totalItems={labTotalItems}
          totalPages={labTotalPages}
          currentPage={labCurrentPage}
          setCurrentPage={setLabCurrentPage}
        />
        <ConsumablesExpenses
          expenseData={consumablesExpenses}
          totalItems={consumablesTotalItems}
          totalPages={consumablesTotalPages}
          currentPage={consumablesCurrentPage}
          setCurrentPage={setConsumablesCurrentPage}
        />
      </div>
    </div>
  );
}

export default Payments;
