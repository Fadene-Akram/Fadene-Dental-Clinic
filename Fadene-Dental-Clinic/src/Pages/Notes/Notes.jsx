import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "./Notes.module.css";
import {
  fetchAllTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
} from "../../api/api";

const TaskBoard = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add", "edit", or "dueDate"
  const [currentTask, setCurrentTask] = useState(null);
  const [currentColumn, setCurrentColumn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState({
    New: [],
    Scheduled: [],
    In_Progress: [],
    Completed: [],
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
    },
  });

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    const { data, error } = await fetchAllTasks();

    if (error) {
      setError(error);
    } else {
      setTasks(data);
      setError(null);
    }

    setIsLoading(false);
  };

  const handleDragStart = (e, task, fromColumn) => {
    e.dataTransfer.setData("task", JSON.stringify({ task, fromColumn }));
  };

  const handleDrop = async (e, toColumn) => {
    e.preventDefault();
    const { task, fromColumn } = JSON.parse(e.dataTransfer.getData("task"));

    const columnOrder = ["New", "Scheduled", "In_Progress", "Completed"];
    const fromIndex = columnOrder.indexOf(fromColumn);
    const toIndex = columnOrder.indexOf(toColumn);

    // Only allow moving to the next column in the workflow
    if (toIndex !== fromIndex + 1) {
      return;
    }

    // Handle special case when moving from New to Scheduled
    if (fromColumn === "New" && toColumn === "Scheduled" && !task.due_date) {
      setModalMode("dueDate");
      setCurrentTask(task);
      setShowModal(true);
      return;
    }

    const { success, error } = await moveTask(task.id, toColumn);

    if (success) {
      // Optimistically update UI
      setTasks((prev) => {
        const newTasks = { ...prev };
        newTasks[fromColumn] = newTasks[fromColumn].filter(
          (t) => t.id !== task.id
        );
        const updatedTask = { ...task, status: toColumn };
        newTasks[toColumn] = [...(newTasks[toColumn] || []), updatedTask];
        return newTasks;
      });
    } else {
      // Revert to original state on error
      setError(error);
      fetchTasks();
    }
  };

  const handleEditTask = (task, column) => {
    setModalMode("edit");
    setCurrentTask(task);
    setCurrentColumn(column);

    // Set form values with current task data
    setValue("title", task.title);
    setValue("description", task.description);
    setValue("dueDate", task.due_date || "");

    setShowModal(true);
  };

  const handleDeleteTask = async (taskId, column) => {
    const { success, error } = await deleteTask(taskId);

    if (success) {
      // Update UI after successful deletion
      setTasks((prev) => {
        const newTasks = { ...prev };
        newTasks[column] = newTasks[column].filter((t) => t.id !== taskId);
        return newTasks;
      });
    } else {
      setError(error);
      // Refresh tasks on error
      fetchTasks();
    }
  };

  const onAddTaskSubmit = async (data) => {
    const { data: newTask, error } = await createTask(data);

    if (error) {
      setError(error);
    } else {
      const column = newTask.status;

      // Update UI after successful addition
      setTasks((prev) => {
        const newTasks = { ...prev };
        if (!Array.isArray(newTasks[column])) {
          newTasks[column] = [];
        }
        newTasks[column] = [...newTasks[column], newTask];
        return newTasks;
      });

      setShowModal(false);
      reset();
    }
  };

  const onEditTaskSubmit = async (data) => {
    const taskData = {
      title: data.title,
      description: data.description,
      due_date: data.dueDate || null,
      status: currentTask.status,
    };

    const { data: updatedTask, error } = await updateTask(
      currentTask.id,
      taskData
    );

    if (error) {
      setError(error);
    } else {
      // Check if the status changed due to adding a due date
      const newStatus = updatedTask.status;

      // Update UI based on the server response
      setTasks((prev) => {
        const newTasks = { ...prev };

        // If status changed, remove from old column and add to new column
        if (currentColumn !== newStatus) {
          newTasks[currentColumn] = newTasks[currentColumn].filter(
            (t) => t.id !== currentTask.id
          );
          if (!Array.isArray(newTasks[newStatus])) {
            newTasks[newStatus] = [];
          }
          newTasks[newStatus] = [...newTasks[newStatus], updatedTask];
        } else {
          // Just update in current column
          newTasks[currentColumn] = newTasks[currentColumn].map((t) =>
            t.id === currentTask.id ? updatedTask : t
          );
        }

        return newTasks;
      });

      setShowModal(false);
      setCurrentTask(null);
      setCurrentColumn(null);
      reset();
    }
  };

  const onSetDueDateSubmit = async (data) => {
    const taskData = {
      ...currentTask,
      due_date: data.dueDate,
      status: "Scheduled",
    };

    const { data: updatedTask, error } = await updateTask(
      currentTask.id,
      taskData
    );

    if (error) {
      setError(error);
    } else {
      // Update UI
      setTasks((prev) => {
        const newTasks = { ...prev };
        newTasks["New"] = newTasks["New"].filter(
          (t) => t.id !== currentTask.id
        );
        if (!Array.isArray(newTasks["Scheduled"])) {
          newTasks["Scheduled"] = [];
        }
        newTasks["Scheduled"] = [...newTasks["Scheduled"], updatedTask];
        return newTasks;
      });

      setShowModal(false);
      setCurrentTask(null);
      reset();
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={fetchTasks}>Try Again</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tasks and Notes</h1>
        <button
          className={styles.addButton}
          onClick={() => {
            setModalMode("add");
            setShowModal(true);
            reset();
          }}
        >
          + Add Task
        </button>
      </div>
      <div className={styles.board}>
        {Object.keys(tasks).map((column) => (
          <div
            key={column}
            className={styles.column}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, column)}
          >
            <h2 className={styles.columnHeader}>{column.replace("_", " ")}</h2>
            <div className={styles.taskList}>
              {Array.isArray(tasks[column]) &&
                tasks[column].map((task) => (
                  <div
                    key={task.id}
                    className={styles.task}
                    style={{ backgroundColor: task.color }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task, column)}
                  >
                    <h3 className={styles.taskContent}>{task.title}</h3>
                    <p className={styles.taskContentP}>{task.description}</p>
                    {task.due_date && (
                      <p className={styles.dueDate}>Due: {task.due_date}</p>
                    )}
                    <div className={styles.taskActions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleEditTask(task, column)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleDeleteTask(task.id, column)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>
              {modalMode === "add"
                ? "Add New Task"
                : modalMode === "edit"
                ? "Edit Task"
                : "Set Due Date"}
            </h2>

            {modalMode === "add" ? (
              <form onSubmit={handleSubmit(onAddTaskSubmit)}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Title"
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && (
                    <p className={styles.errorText}>{errors.title.message}</p>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <textarea
                    placeholder="Description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                  ></textarea>
                  {errors.description && (
                    <p className={styles.errorText}>
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="date"
                    {...register("dueDate", {
                      validate: (value) => {
                        if (!value) return true; // Allow empty due dates for "New" tasks
                        const today = new Date().toISOString().split("T")[0];
                        return (
                          value >= today || "Due date must be in the future"
                        );
                      },
                    })}
                  />
                  {errors.dueDate && (
                    <p className={styles.errorText}>{errors.dueDate.message}</p>
                  )}
                </div>

                <button type="submit">Add Task</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </form>
            ) : modalMode === "edit" ? (
              <form onSubmit={handleSubmit(onEditTaskSubmit)}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Title"
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && (
                    <p className={styles.errorText}>{errors.title.message}</p>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <textarea
                    placeholder="Description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                  ></textarea>
                  {errors.description && (
                    <p className={styles.errorText}>
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="date"
                    {...register("dueDate", {
                      validate: (value) => {
                        if (!value) return true;
                        const today = new Date().toISOString().split("T")[0];
                        return (
                          value >= today || "Due date must be in the future"
                        );
                      },
                    })}
                  />
                  {errors.dueDate && (
                    <p className={styles.errorText}>{errors.dueDate.message}</p>
                  )}
                </div>

                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit(onSetDueDateSubmit)}>
                <div className={styles.inputGroup}>
                  <input
                    type="date"
                    {...register("dueDate", {
                      required: "Due date is required",
                      validate: (value) => {
                        const today = new Date().toISOString().split("T")[0];
                        return (
                          value >= today || "Due date must be in the future"
                        );
                      },
                    })}
                  />
                  {errors.dueDate && (
                    <p className={styles.errorText}>{errors.dueDate.message}</p>
                  )}
                </div>

                <button type="submit">Set Due Date</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
