import styles from "./StatCard.module.css";

function StatCard({ icon, title, value }) {
  return (
    <div className={styles.StatCardContainer}>
      <div className={styles.StatCardHeader}>
        <img
          className={styles.StatCardHeaderIcon}
          src={icon}
          alt={`${title}-icon`}
        />
        <p className={styles.StatCardHeaderP}>{title}</p>
      </div>

      <p className={styles.StatCardValueP}>{value}</p>
    </div>
  );
}

export default StatCard;
