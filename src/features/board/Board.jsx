import { useState, useEffect, useMemo } from "react";
import { columnHeading } from "../../utils/columnHeading";
import { formatedDateToDayMonthYear } from "../../utils/formatDate";
import { UsersRound, Plus } from "lucide-react";
import { VscCollapseAll } from "react-icons/vsc";
import CreateTaskModal from "../../modals/CreateTaskModal";
import TaskSkeletonLoading from "./TaskSkeletonLoading";
import AddPeopleModal from "../../modals/AddPeopleModal";
import TaskCard from "./TaskCard";
import styles from "./Board.module.css";
import { toast } from "sonner";

const fetchTasksByTimeframeAndStatus = async (timeframe, status) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/api/v1/tasks?filter=${timeframe}&status=${status}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    return data?.data?.tasks || [];
  } catch (error) {
    return [];
  }
};

const Board = () => {
  const [tasksByStatus, setTasksByStatus] = useState({});
  const [timeframe, setTimeframe] = useState("today");
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [collapsedColumns, setCollapsedColumns] = useState({});
  const [collapseAllClicked, setCollapseAllClicked] = useState(false);
  const [addPeopleModalOpen, setAddPeopleModalOpen] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [emailIds, setEmailIds] = useState([]);
  const [isEmailLoading, setIsEmailLoading] = useState(true);
  const [userIds, setUserIds] = useState([]);

  const statuses = useMemo(() => ["backlog", "todo", "inprogress", "done"], []);

  useEffect(() => {
    const fetchEmailIds = async () => {
      setIsEmailLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/emails`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch email IDs");
        }
        const data = await response.json();
        setEmailIds(data.data.users.map((user) => user.email));
        setUserIds(data.data.users.map((user) => user._id));
      } catch (error) {
        toast.error("Failed to fetch email IDs", error.message);
      } finally {
        setIsEmailLoading(false);
      }
    };
    fetchEmailIds();
  }, []);

  useEffect(() => {
    const loadAllTasks = async () => {
      setLoading(true);
      try {
        const tasksPromises = statuses.map((status) =>
          fetchTasksByTimeframeAndStatus(timeframe, status)
        );
        const tasksResults = await Promise.all(tasksPromises);

        const newTasksByStatus = {};
        statuses.forEach((status, index) => {
          newTasksByStatus[status] = tasksResults[index];
        });

        setTasksByStatus(newTasksByStatus);
      } catch (error) {
        toast.error("Failed to fetch tasks", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadAllTasks();
  }, [timeframe, statuses, refresh]);

  const handleCollapseAll = (e, status) => {
    e.stopPropagation();
    setCollapsedColumns((prev) => ({
      ...prev,
      [status]: true, // Set the column to collapsed state (true for all tasks in that column)
    }));
    setCollapseAllClicked((prev) => !prev);
  };

  const handleTimeframeChange = (e) => {
    setTimeframe(e.target.value);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
      setRefresh(!refresh);
    } catch (error) {
      toast.error("Failed to update task status", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setCreateTaskModalOpen(true);
  };

  const handleTaskAdded = () => {
    setRefresh((refresh) => !refresh);
    setEditingTask(null);
  };

  const handleDeleteTask = () => {
    setRefresh((refresh) => !refresh);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome! {localStorage.getItem("userName")}</h1>
        <span className={styles.date}>{formatedDateToDayMonthYear()}</span>
      </header>
      <div className={styles.boardHeader}>
        <div className={styles.boardTitle}>
          <h2>Board</h2>
          <button
            className={styles.addPeople}
            onClick={() => setAddPeopleModalOpen(true)}
          >
            <span className={styles.icon}>
              <UsersRound size={15} />
            </span>
            Add People
          </button>
        </div>
        <select className={styles.timeframe} onChange={handleTimeframeChange}>
          <option value="today">today</option>
          <option value="this-week">This week</option>
          <option value="this-month">This month</option>
        </select>
      </div>
      <div className={styles.columns}>
        {statuses.map((status, index) => (
          <div key={index} className={styles.column}>
            <div className={styles.columnHeader}>
              <h3>{columnHeading(status)}</h3>
              <div className={styles.columnButtons}>
                {status === "todo" && (
                  <button
                    className={styles.addButton}
                    onClick={() => setCreateTaskModalOpen(true)}
                  >
                    <Plus size={22} />
                  </button>
                )}
                <button
                  className={styles.copyButton}
                  onClick={(e) => handleCollapseAll(e, status)}
                >
                  <span className={styles.collapseAllImage}>
                    <VscCollapseAll size={22} style={{ color: "#767575" }} />
                  </span>
                </button>
              </div>
            </div>

            <div className={styles.taskList}>
              {loading || isEmailLoading
                ? [...Array(3)].map((_, index) => (
                    <TaskSkeletonLoading key={`skeleton-${index}`} />
                  ))
                : tasksByStatus[status]?.map((task) => (
                    <TaskCard
                      key={task._id}
                      taskId={task._id}
                      title={task.title}
                      checklist={task.checkList}
                      priority={task.priority}
                      date={task.dueDate ? new Date(task.dueDate) : null}
                      status={task.status}
                      statuses={statuses}
                      onUpdateStatus={updateTaskStatus}
                      onEdit={() => {
                        handleEditTask(task);
                      }}
                      isCollapsed={!!collapsedColumns[status]}
                      collapseAllClicked={collapseAllClicked}
                      onDeleteConfirm={handleDeleteTask}
                      assignTo={
                        task.assignTo
                          ? emailIds[userIds.indexOf(task.assignTo)]
                          : ""
                      }
                    />
                  ))}
            </div>
          </div>
        ))}
      </div>
      {createTaskModalOpen && (
        <CreateTaskModal
          onClose={() => {
            setEditingTask(null);
            setCreateTaskModalOpen(false);
          }}
          onTaskAdded={handleTaskAdded}
          editingTask={editingTask}
          emailIds={emailIds}
          userIds={userIds}
        />
      )}
      {addPeopleModalOpen && (
        <AddPeopleModal onClose={() => setAddPeopleModalOpen(false)} />
      )}
    </div>
  );
};

export default Board;
