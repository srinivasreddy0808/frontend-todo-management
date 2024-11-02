import { useState, useEffect } from "react";
import styles from "./Analytics.module.css";
import StatItem from "./StatItem";

const Analytics = () => {
  const [taskStats, setTaskStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusItems = [
    { key: "backlog", label: "Backlog Tasks" },
    { key: "todo", label: "To-do Tasks" },
    { key: "inProgress", label: "In-Progress Tasks" },
    { key: "completed", label: "Completed Tasks" },
  ];

  const priorityItems = [
    { key: "low", label: "Low Priority" },
    { key: "moderate", label: "Moderate Priority" },
    { key: "high", label: "High Priority" },
    { key: "dueDate", label: "Due Date Tasks" },
  ];

  useEffect(() => {
    fetchTaskStats();
  }, []);

  const fetchTaskStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/tasks/analytics`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch task statistics");
      }
      const data = await response.json();

      setTaskStats({
        status: data.data.status,
        priority: data.data.priority,
      }); // Remove this mock data when connecting to real API
    } catch (err) {
      setError("Failed to fetch task statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loadingSpinner}></div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!taskStats) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Analytics</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statsColumn}>
          {statusItems.map((item) => (
            <StatItem
              key={item.key}
              label={item.label}
              value={taskStats.status[item.key]}
            />
          ))}
        </div>

        <div className={styles.statsColumn}>
          {priorityItems.map((item) => (
            <StatItem
              key={item.key}
              label={item.label}
              value={taskStats.priority[item.key]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
