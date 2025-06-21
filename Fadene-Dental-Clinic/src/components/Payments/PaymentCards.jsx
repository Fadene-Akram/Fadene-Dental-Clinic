import PaymentCard from "./PaymentCard";
import styles from "./PaymentCards.module.css";

function PaymentCards({ summaryData }) {
  return (
    <div className={styles.paymentCardsContainer}>
      <PaymentCard
        icon={"src/assets/icons/payment.svg"}
        title={"Total Number of Expenses"}
        value={summaryData.total_count}
      />
      <PaymentCard
        icon={"src/assets/icons/payment.svg"}
        title={"Total Expenses"}
        value={summaryData.total_expenses}
      />
      <PaymentCard
        icon={"src/assets/icons/payment.svg"}
        title={"Total Laboratory Expenses"}
        value={summaryData.laboratory_expenses}
      />
      <PaymentCard
        icon={"src/assets/icons/payment.svg"}
        title={"Total Consumable Expenses"}
        value={summaryData.consumable_expenses}
      />
    </div>
  );
}

export default PaymentCards;
