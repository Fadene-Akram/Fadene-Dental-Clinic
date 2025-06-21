import styles from "./CalenderAndNotes.module.css";
import SimpleCalendar from "./Calender";
import DaySchedule from "./DaySchedule";

function CalendarAndNotes() {
  return (
    <div className={styles.calendarContainer}>
      <SimpleCalendar />
      <DaySchedule />
    </div>
  );
}

export default CalendarAndNotes;
