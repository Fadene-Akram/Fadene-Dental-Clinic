import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Unauthorized.module.css";

function Unauthorized() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/appointments");
    }, 3000); // Redirect after 3 seconds
    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [navigate]); // Only run this effect on mount

  return (
    <div className={styles.unauthorizedContainer}>
      {/* <img src="src/assets/icons/unauthorized.svg" alt="unauthorized-icon" /> */}
    </div>
  );
}

export default Unauthorized;
