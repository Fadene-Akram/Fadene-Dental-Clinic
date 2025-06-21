import styles from "./PaymentCard.module.css";

function PaymentCard({ icon, title, value }) {
  return (
    <div className={styles.PaymentCardContainer}>
      <div className={styles.PaymentCardHeader}>
        <img
          className={styles.PaymentCardHeaderIcon}
          src={icon}
          alt={`${title}-icon`}
        />
        <p className={styles.PaymentCardHeaderP}>{title}</p>
      </div>

      <p className={styles.PaymentCardValueP}>
        {value} {title === "Total Number of Expenses" ? "" : "DA"}
      </p>
    </div>
  );
}

export default PaymentCard;
