import styles from "./AppointmentRow.module.css";

function AppointmentRow({ name, time, symptoms }) {
  return (
    <div className={styles.appointmentRowContainer}>
      <p className={styles.patientName}>{name} </p>
      <p className={styles.patientDate}>{time} </p>
      <p className={styles.patientSymptom}>{symptoms} </p>
    </div>
  );
}

export default AppointmentRow;
