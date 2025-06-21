import styles from "./PatientTableRow.module.css";
import maleIcon from "../../assets/icons/male-user.svg";
import femaleIcon from "../../assets/icons/female-user.svg";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import viewIcon from "../../assets/icons/view-icon.svg";

function PatientTableRow({
  index,
  full_name,
  id,
  date_of_birth,
  phone_number,
  gender,
  registration_date,
  age,
  onHandleViewPatient,
  onHandleDeletePatient,
}) {
  return (
    <div
      className={`${styles.patientTableRowContainer} ${
        index % 2 === 0 ? styles.evenRow : styles.oddRow
      }`}
    >
      <p className={styles.rowColumn}>
        {gender.toLowerCase() === "m" ? (
          <img
            className={styles.patientIcon}
            src={maleIcon}
            alt="patient-icon"
          />
        ) : (
          <img
            className={styles.patientIcon}
            src={femaleIcon}
            alt="patient-icon"
          />
        )}
        {full_name}
      </p>
      <p className={styles.rowColumn}>{id}</p>
      <p className={styles.rowColumn}>{age}</p>
      <p className={styles.rowColumn}>{date_of_birth}</p>
      <p className={styles.rowColumn}>{phone_number}</p>
      <p className={styles.rowColumn}>{gender == "M" ? "Male" : "Female"}</p>
      <p className={styles.rowColumn}>
        {new Date(registration_date).toLocaleDateString()}
      </p>
      <div className={styles.rowColumn}>
        <img
          className={styles.iconColumn}
          src={viewIcon}
          alt="view-icon"
          onClick={() =>
            onHandleViewPatient(
              {
                full_name,
                id,
                date_of_birth,
                phone_number,
                gender: gender === "M" ? "Male" : "Female",
                registration_date: new Date(
                  registration_date
                ).toLocaleDateString(),
                age,
              },
              id
            )
          }
        />
        <img
          className={styles.iconColumn}
          src={deleteIcon}
          alt="delete-icon"
          onClick={onHandleDeletePatient}
        />
      </div>
    </div>
  );
}

export default PatientTableRow;
