export function formatTime(timeString) {
  let [hours, minutes, seconds] = timeString.split(":").map(Number);
  let period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
  return `${hours}:00 ${period}`;
}

export function navigateDate(
  direction,
  currentDate,
  currentView,
  setCurrentDate
) {
  const newDate = new Date(currentDate);
  switch (currentView) {
    case "month":
      newDate.setMonth(currentDate.getMonth() + direction);
      break;
    case "week":
      newDate.setDate(currentDate.getDate() + 7 * direction);
      break;
    case "day":
      newDate.setDate(currentDate.getDate() + direction);
      break;
    default:
      break;
  }
  setCurrentDate(newDate);
}

export function formatDate(date, currentView) {
  const options = {
    month: "long",
    year: "numeric",
    ...(currentView !== "month" && { day: "numeric" }),
  };

  // Remove the comma by replacing it in the formatted string
  return new Intl.DateTimeFormat("en-US", options)
    .format(date)
    .replace(",", "");
}
