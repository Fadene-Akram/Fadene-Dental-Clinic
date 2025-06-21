import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SplashScreen.module.css";

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const isRegistered = localStorage.getItem("isRegistered");
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const userRole = localStorage.getItem("userRole");
    const currentTime = Date.now();

    const timer = setTimeout(() => {
      if (!isRegistered) {
        // First-time user → Go to SignUp
        navigate("/signup", { replace: true });
      } else if (token && tokenExpiry && currentTime < parseInt(tokenExpiry)) {
        // Token is valid → Redirect based on user role
        if (userRole === "doctor") {
          navigate("/dashboard", { replace: true });
        } else if (userRole === "nurse") {
          navigate("/patients", { replace: true });
        } else {
          // Default fallback for unknown role
          navigate("/login", { replace: true });
        }
      } else {
        // Token expired or missing → Go to Login
        navigate("/login", { replace: true });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.splashScreenContainer}>
      <div className={styles.splashScreen}>
        <img
          src="src/assets/images/clinic-logo.png"
          alt="clinic-logo"
          className={styles.logo}
        />
        <div className={styles.textContent}>
          <p className={styles.splashScreenTitle}>Fadene Dental Clinic</p>
          <p className={styles.splashScreenDescription}>
            Fadene Dental Clinic is a medical management system that helps you
            manage your patients, appointments, notes, and payments.
          </p>
          <ul className={styles.mainFeatureList}>
            <li className={styles.mainFeatureListItem}>
              <img
                src="src/assets/icons/checked-icon.png"
                alt="checked-icon"
                className={styles.mainFeatureListIcon}
              />
              Appointments
            </li>
            <li className={styles.mainFeatureListItem}>
              <img
                src="src/assets/icons/checked-icon.png"
                alt="checked-icon"
                className={styles.mainFeatureListIcon}
              />
              Patients
            </li>
            <li className={styles.mainFeatureListItem}>
              <img
                src="src/assets/icons/checked-icon.png"
                alt="checked-icon"
                className={styles.mainFeatureListIcon}
              />
              Dashboard
            </li>
            <li className={styles.mainFeatureListItem}>
              <img
                src="src/assets/icons/checked-icon.png"
                alt="checked-icon"
                className={styles.mainFeatureListIcon}
              />
              Payments
            </li>
            <li className={styles.mainFeatureListItem}>
              <img
                src="src/assets/icons/checked-icon.png"
                alt="checked-icon"
                className={styles.mainFeatureListIcon}
              />
              Notes
            </li>
          </ul>
        </div>
        <footer className={styles.footer}>
          <p>
            &copy; {new Date().getFullYear()} Fadene Dental Clinic. All rights
            reserved.
          </p>
        </footer>
      </div>
      <div className={styles.splashScreenbackground}></div>
    </div>
  );
}

export default SplashScreen;
