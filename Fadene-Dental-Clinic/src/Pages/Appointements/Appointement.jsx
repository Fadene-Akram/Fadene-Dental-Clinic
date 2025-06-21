import { useState, useEffect } from "react";
import styles from "./Appointement.module.css";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import AppointmentModal from "../../components/Appointement/AppointmentModal";
import FailedAppointmentModal from "../../components/Appointement/FailedAppointmentModal";
import colors from "../../utils/Colors";
import { formatDate, formatTime, navigateDate } from "../../utils/Time";
import {
  createAppointment,
  deleteAppointment,
  fetchAppointments,
  fetchAppointmentPatients,
  updateAppointment,
} from "../../api/api";

function Appointment() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("day");
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // console.log("appointments", appointments);
  useEffect(() => {
    const handleFetchAppointments = async () => {
      await fetchAppointments(
        currentDate,
        currentView,
        setAppointments,
        setLoading,
        setError
      );
    };
    // Fetch patients for the modal
    const handleFetchPatients = async () => {
      await fetchAppointmentPatients(setPatients);
    };

    handleFetchAppointments();
    handleFetchPatients();
  }, [currentDate, currentView]);

  const handleCreateAppointment = async (appointmentData) => {
    await createAppointment(
      appointmentData,
      selectedDate,
      setAppointments,
      setShowModal,
      setError
    );
  };

  const handleUpdate = async (appointmentData) => {
    await updateAppointment(
      appointmentData,
      setAppointments,
      setShowModal,
      setError
    );
  };

  const handleDelete = async (appointmentId) => {
    await deleteAppointment(
      appointmentId,
      setAppointments,
      setShowModal,
      setError
    );
  };

  const handleAppointmentClick = (appointment, e) => {
    e.stopPropagation();
    setEditingAppointment(appointment);
    setSelectedDate(appointment.date);
    setShowModal(true);
  };

  // Render time slots (same as before)
  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = (7 + i) % 24;
    const period = hour < 12 ? "AM" : "PM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${period}`;
  });

  // Render views (day, week, month) - similar to previous implementation
  const renderMonthView = () => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const getDaysInMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    return (
      <div className={styles.calendarGrid}>
        {daysOfWeek.map((day) => (
          <div key={day} className={styles.weekdayHeader}>
            {day}
          </div>
        ))}

        {Array.from({ length: 42 }, (_, i) => {
          const dayNumber = i - getFirstDayOfMonth(currentDate) + 1;
          const isValidDay =
            dayNumber > 0 && dayNumber <= getDaysInMonth(currentDate);
          const currentDateObj = new Date(
            Date.UTC(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              dayNumber
            )
          );

          return (
            <div
              key={i}
              className={`${styles.calendarDay} ${
                !isValidDay ? styles.outsideMonth : ""
              }`}
              onClick={() => {
                if (isValidDay) {
                  setEditingAppointment(null);
                  setSelectedDate(currentDateObj);
                  setShowModal(true);
                }
              }}
            >
              {isValidDay && (
                <>
                  <div className={styles.dayNumber}>{dayNumber}</div>
                  {appointments
                    .filter(
                      (apt) =>
                        apt.date.getDate() === dayNumber &&
                        apt.date.getMonth() === currentDate.getMonth()
                    )
                    .map((apt, index) => {
                      const color = colors[index % colors.length]; // Select color from the array
                      return (
                        <div
                          key={apt.id}
                          className={styles.appointment}
                          style={{ backgroundColor: color }}
                          onClick={(e) => handleAppointmentClick(apt, e)}
                        >
                          <div className={styles.patientName}>
                            - Patient: {apt.patient}
                          </div>
                          <div className={styles.patientName}>
                            - Description: {apt.description}
                          </div>
                          <div className={styles.patientName}>
                            - Time: {apt.time}
                          </div>
                          <div className={styles.patientName}>
                            - Duration: {apt.duration} min
                          </div>
                          <div className={styles.patientName}>
                            - Paid: {apt.paid} DA
                          </div>
                          <div className={styles.patientName}>
                            - Remaining: {apt.remaining} DA
                          </div>
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    return (
      <div className={styles.weekView}>
        <div className={styles.weekViewHeader}>
          <div className={styles.timeColumn}>Time</div>
          {Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return (
              <div key={i} className={styles.weekViewDay}>
                {day.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "numeric",
                  day: "numeric",
                })}
              </div>
            );
          })}
        </div>
        <div className={styles.weekViewBody}>
          {timeSlots.map((time, i) => (
            <div key={i} className={styles.weekViewRow}>
              <div className={styles.timeSlot}>{time}</div>
              {Array.from({ length: 7 }, (_, j) => {
                const day = new Date(startOfWeek);
                day.setDate(startOfWeek.getDate() + j);

                return (
                  <div
                    key={j}
                    className={styles.weekViewCell}
                    onClick={() => {
                      setEditingAppointment(null);
                      setSelectedDate(day);
                      setShowModal(true);
                    }}
                  >
                    {appointments
                      .filter(
                        (apt) =>
                          apt.date.getDate() === day.getDate() &&
                          apt.date.getMonth() === day.getMonth() &&
                          formatTime(apt.time) === time
                      )
                      .map((apt, index) => {
                        const color = colors[i % colors.length]; // Select color from the array
                        return (
                          <div
                            key={apt.id}
                            className={styles.weekViewAppointment}
                            style={{ backgroundColor: color }}
                            onClick={(e) => handleAppointmentClick(apt, e)}
                          >
                            <p className={styles.weekViewAppointmentP}>
                              Patient : {apt.patient}
                            </p>
                            <p className={styles.weekViewAppointmentP}>
                              Description : {apt.description}
                            </p>
                            <p className={styles.weekViewAppointmentP}>
                              Paid : {apt.paid} DA
                            </p>
                            <p className={styles.weekViewAppointmentP}>
                              Remaining : {apt.remaining} DA
                            </p>
                            <p className={styles.weekViewAppointmentP}>
                              Duration: {apt.duration} min
                            </p>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    return (
      <div className={styles.dayView}>
        <div className={styles.dayViewHeader}>
          <div className={styles.timeColumn}>Time</div>
          <div className={styles.dayViewDate}>
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <div className={styles.dayViewBody}>
          {timeSlots.map((time, i) => (
            <div key={i} className={styles.dayViewRow}>
              <div className={styles.timeSlot}>{time}</div>
              <div
                className={styles.dayViewCell}
                onClick={() => {
                  setEditingAppointment(null);
                  setSelectedDate(currentDate);
                  setShowModal(true);
                }}
              >
                {appointments
                  .filter(
                    (apt) =>
                      apt.date.getDate() === currentDate.getDate() &&
                      apt.date.getMonth() === currentDate.getMonth() &&
                      formatTime(apt.time) === time
                  )
                  .map((apt, index) => {
                    const color = colors[i % colors.length]; // Select color from the array
                    // console.log("apt", apt);
                    return (
                      <div
                        key={index}
                        className={styles.dayViewAppointment}
                        style={{ backgroundColor: color }}
                        onClick={(e) => handleAppointmentClick(apt, e)}
                      >
                        Patient : {apt.patient} <br /> Description :{" "}
                        {apt.description}
                        <br />
                        Duration: {apt.duration} min
                        <br /> Time : {apt.time}
                        <br /> Paid : {apt.paid} DA
                        <br /> Remaining : {apt.remaining} DA
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className={styles.container}>
      {error && (
        <FailedAppointmentModal
          title={"Failure"}
          description={error}
          onClose={() => setError(null)}
        />
      )}

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.currentDate}>
            {formatDate(currentDate, currentView)}
          </h2>
          <div className={styles.navigationButtons}>
            <button
              className={styles.navButton}
              onClick={() =>
                navigateDate(-1, currentDate, currentView, setCurrentDate)
              }
            >
              <ChevronLeft className={styles.icon} />
            </button>
            <button
              className={styles.navButton}
              onClick={() =>
                navigateDate(1, currentDate, currentView, setCurrentDate)
              }
            >
              <ChevronRight className={styles.icon} />
            </button>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButtonLeft} ${
                currentView === "day" ? styles.activeView : ""
              }`}
              onClick={() => setCurrentView("day")}
            >
              Day
            </button>
            <button
              className={`${styles.viewButtonMiddle} ${
                currentView === "week" ? styles.activeView : ""
              }`}
              onClick={() => setCurrentView("week")}
            >
              Week
            </button>
            <button
              className={`${styles.viewButtonRight} ${
                currentView === "month" ? styles.activeView : ""
              }`}
              onClick={() => setCurrentView("month")}
            >
              Month
            </button>
          </div>
          <button
            className={styles.addButton}
            onClick={() => {
              setSelectedDate(new Date());
              setEditingAppointment(null);
              setShowModal(true);
            }}
          >
            <Plus className={styles.icon} />
            Add Appointment
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}>Loading...</div>
        </div>
      ) : (
        <>
          {currentView === "month" && renderMonthView()}
          {currentView === "week" && renderWeekView()}
          {currentView === "day" && renderDayView()}
        </>
      )}

      <AppointmentModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedDate={selectedDate}
        editingAppointment={editingAppointment}
        patients={patients}
        onCreateAppointment={handleCreateAppointment}
        onUpdateAppointment={handleUpdate}
        onDeleteAppointment={handleDelete}
      />
    </div>
  );
}

export default Appointment;
