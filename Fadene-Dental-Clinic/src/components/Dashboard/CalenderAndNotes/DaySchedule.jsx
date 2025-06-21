import { useNavigate } from "react-router-dom";
import styles from "./DaySchedule.module.css";
import { useEffect, useState } from "react";
import { fetchTasks } from "../../../api/api";

function DaySchedule() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
      setIsLoading(false);
    };

    loadTasks();
  }, []);

  const getStatusLabel = (status) => {
    switch (status) {
      case "Completed":
        return "✅ Completed";
      case "New":
        return "🆕 New";
      case "Scheduled":
        return "📅 Scheduled";
      case "In_Progress":
        return "🚀 In Progress";
      default:
        return "❓ Unknown";
    }
  };

  function handleAddNote() {
    navigate("/notes");
  }

  return (
    <div className={styles.dashboardNotesContainer}>
      <div className={styles.dashboardNotesHeader}>
        <p className={styles.dashboardNotesHeaderP}>Tasks:</p>
        <button
          className={styles.dashboardNotesHeaderBtn}
          onClick={handleAddNote}
        >
          +
        </button>
      </div>
      <div className={styles.dashboardNotes}>
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={styles.Notes}
            style={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#aff2fb" }}
          >
            <p className={styles.title}>{task.title}</p>
            <p className={styles.content}>{task.description}</p>
            {task.status !== "New" && task.due_date && (
              <p className={styles.duration}>Due: {task.due_date}</p>
            )}
            <p className={styles.status}>{getStatusLabel(task.status)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DaySchedule;
