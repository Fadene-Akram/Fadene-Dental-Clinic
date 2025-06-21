import { useState, useEffect } from "react";
import styles from "./AppointementsTable.module.css";
import AppointmentRow from "./AppointmentRow";
import { useNavigate } from "react-router-dom";
import { fetchAppointmentsDashboard } from "../../../../api/api";

function AppointementsTable() {
  const navigate = useNavigate();
  const today = new Date();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  );

  // Use the imported API function
  async function loadAppointments() {
    setLoading(true);
    try {
      const appointmentsData = await fetchAppointmentsDashboard(
        new Date(selectedDate),
        "day"
      );
      setAppointments(appointmentsData);
      setError(null);
    } catch (err) {
      setError(
        err.message || "Failed to fetch appointments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  const rowsPerPage = 5;
  const filteredAppointments = appointments.filter(
    (apt) => apt.date.toISOString().split("T")[0] === selectedDate
  );
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedAppointments = filteredAppointments.slice(
    startIndex,
    endIndex
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedDate]);

  const nextPage = () => {
    if (endIndex < filteredAppointments.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  function handleViewMore() {
    navigate("/appointments");
  }

  return (
    <div className={styles.appointementsTableContainer}>
      <div className={styles.appointementsTableP}>
        <p className={styles.appointementsTabletitle}>Appointments</p>
        <div className={styles.appointementsTableplus} onClick={handleViewMore}>
          View More
        </div>
      </div>

      <div className={styles.appointementsTableFilter}>
        {Array.from({ length: 10 }, (_, i) => {
          const date = new Date();
          date.setDate(today.getDate() - 5 + i);
          const dateStr = date.toISOString().split("T")[0];
          return (
            <button
              key={i}
              className={`${styles.dayButton} ${
                dateStr === selectedDate ? styles.selectedDay : ""
              }`}
              onClick={() => setSelectedDate(dateStr)}
            >
              <p
                className={`${styles.dayButtonDay} ${
                  dateStr === selectedDate ? styles.dayButtonDaySelected : ""
                }`}
              >
                {date.toString().split(" ")[0]}
              </p>
              <p
                className={`${styles.dayButtonnumber} ${
                  dateStr === selectedDate ? styles.dayButtonnumberSelected : ""
                }`}
              >
                {date.getDate()}
              </p>
            </button>
          );
        })}
      </div>

      <div className={styles.appointementsTableHeader}>
        <p className={styles.appointementsTableHeaderColumn}>Name</p>
        <p className={styles.appointementsTableHeaderColumn}>Time</p>
        <p className={styles.appointementsTableHeaderColumn}>Description</p>
      </div>

      <div className={styles.appointementsRows}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : paginatedAppointments.length > 0 ? (
          paginatedAppointments.map((apt, index) => (
            <AppointmentRow
              key={apt.id}
              name={apt.patient}
              time={apt.time}
              symptoms={apt.description}
              isFirst={index === 0}
              isLast={index === paginatedAppointments.length - 1}
            />
          ))
        ) : (
          <p className={styles.noAppointments}>No appointments found.</p>
        )}
      </div>

      <div className={styles.paginationButtons}>
        <button
          className={
            currentPage === 0 ? styles.disabledPrevBtn : styles.prevBtn
          }
          onClick={prevPage}
          disabled={currentPage === 0}
        >
          &lt; Previous
        </button>
        <p className={styles.currentPage}>{currentPage + 1}</p>
        <button
          className={
            endIndex >= filteredAppointments.length
              ? styles.disabledNextBtn
              : styles.nextBtn
          }
          onClick={nextPage}
          disabled={endIndex >= filteredAppointments.length}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}

export default AppointementsTable;
