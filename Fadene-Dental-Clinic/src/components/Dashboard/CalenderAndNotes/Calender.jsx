import { useState, useEffect } from "react";
import styles from "./Calendar.module.css";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (
        now.getDate() !== currentDate.getDate() ||
        now.getMonth() !== currentDate.getMonth() ||
        now.getFullYear() !== currentDate.getFullYear()
      ) {
        setCurrentDate(new Date());
      }
    }, 60000); // check every minute

    return () => clearInterval(timer);
  }, [currentDate]);

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day) => {
    const newSelected = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newSelected);
  };

  const renderCalendarDays = () => {
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);
    const days = [];

    const today = new Date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= totalDays; day++) {
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      const isToday =
        today.getDate() === day &&
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear();

      let dayClassName = styles.calendarDay;
      if (isSelected) dayClassName += ` ${styles.selected}`;
      if (isToday && !isSelected) dayClassName += ` ${styles.today}`;

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={dayClassName}
          aria-selected={isSelected}
          role="gridcell"
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // Format the selected date in a more user-friendly way
  const formatSelectedDate = (date) => {
    if (!date) return "";

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button
          onClick={handlePrevMonth}
          className={styles.navButton}
          aria-label="Previous month"
        >
          &lt;
        </button>
        <h2 className={styles.calendarTitle}>
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={handleNextMonth}
          className={styles.navButton}
          aria-label="Next month"
        >
          &gt;
        </button>
      </div>

      <div className={styles.weekdaysGrid} role="row">
        {weekdays.map((day) => (
          <div key={day} className={styles.weekday} role="columnheader">
            {day}
          </div>
        ))}
      </div>

      <div className={styles.daysGrid} role="grid">
        {renderCalendarDays()}
      </div>

      {selectedDate && (
        <div className={styles.selectedDateInfo}>
          {formatSelectedDate(selectedDate)}
        </div>
      )}
    </div>
  );
};

export default Calendar;
