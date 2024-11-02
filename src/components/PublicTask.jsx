import { formatDateToMonthDay } from "../utils/formatDate";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./PublicTask.module.css";

const fetchTaskData = async (taskId) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/tasks/public/${taskId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch task data");
  }
  const data = await response.json();
  return data.data.task;
};

const PublicTask = () => {
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { taskId } = useParams();

  const priorityColors = {
    high: "red",
    moderate: "blue",
    low: "green",
  };

  useEffect(() => {
    const getTaskData = async () => {
      try {
        const data = await fetchTaskData(taskId);
        setTaskData(data);
      } catch (error) {
        setError("Failed to fetch task data", error.message);
      } finally {
        setLoading(false);
      }
    };

    getTaskData();
  }, [taskId]);

  if (loading) {
    return <div className={styles.loadingSpinner}></div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!taskData) {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <img
              src="/images/codesandbox2.png"
              alt="box"
              className={styles.appLogo}
            />
          </div>
          <span className={styles.appName}>Pro Manage</span>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.priorityTag}>
            <span
              className={`${styles[priorityColors[taskData.priority]]} ${
                styles.dot
              }`}
            />
            {taskData.priority.toUpperCase()} PRIORITY
          </div>

          <h2 className={styles.title}>{taskData.title}</h2>

          <div className={styles.checklistHeader}>
            Checklist ({taskData.checkList.filter((item) => item.isDone).length}
            /{taskData.checkList.length})
          </div>

          <div className={styles.checklistContainer}>
            {taskData.checkList.map((item, index) => (
              <div key={index} className={styles.checklistItem}>
                <div
                  className={`${styles.checkbox} ${
                    item.isDone ? styles.checked : ""
                  }`}
                >
                  {item.isDone && (
                    <svg
                      viewBox="0 0 22 22"
                      fill="none"
                      className={styles.checkIcon}
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className={styles.checklistText}>
                  {item.checkListValue}
                </span>
              </div>
            ))}
          </div>

          {taskData.dueDate && (
            <div className={styles.dueDateContainer}>
              <span className={styles.dueLabel}>Due Date</span>
              <span
                className={`${styles.dueDate} ${
                  taskData.priority === "high" ? styles.highPriority : ""
                }`}
              >
                {formatDateToMonthDay(new Date(taskData.dueDate))}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicTask;
