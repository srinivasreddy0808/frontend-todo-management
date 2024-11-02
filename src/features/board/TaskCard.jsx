import { useState, useEffect } from "react";
import { ChevronDown, MoreHorizontal, ChevronUp, Check } from "lucide-react";
import { columnHeading } from "../../utils/columnHeading";
import { formatDateToMonthDay } from "../../utils/formatDate";
import { toast } from "sonner";
import DeleteTaskModal from "../../modals/DeleteTaskModal";
import PropTypes from "prop-types";
import styles from "./TaskCard.module.css";

const TaskCard = ({
  title,
  checklist,
  priority,
  date,
  status,
  statuses,
  onUpdateStatus,
  taskId,
  onEdit,
  isCollapsed,
  collapseAllClicked,
  onDeleteConfirm,
  assignTo,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMoreClicked, setIsMoreClicked] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const currentStatus = status;

  const priorityColors = {
    high: "red",
    moderate: "blue",
    low: "green",
  };

  const isPending = Date.now() > new Date(date).getTime();

  useEffect(() => {
    if (isCollapsed) {
      setIsExpanded(false); // Collapse the task card if column is collapsed
    }
  }, [isCollapsed, collapseAllClicked]);

  const deleteHandler = () => {
    setIsDeleteModalOpen(true);
    setIsMoreClicked(false);
  };

  const shareHandler = () => {
    const link = `${import.meta.env.VITE_FRONTEND_URL}/task/${taskId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast("Link Copied", {
          duration: 3000,
        });
      })
      .catch((error) => {
        toast.error("Failed to copy link", error.message);
      });
  };

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const editHandler = () => {
    onEdit();
    setIsMoreClicked(false);
  };
  const completedItems = checklist.filter((item) => item.isDone).length;
  const maxTitleLength = 55;
  const truncatedTitle =
    title.length > maxTitleLength
      ? `${title.slice(0, maxTitleLength)}...`
      : title;

  return (
    <div className={styles.taskCard}>
      <div className={styles.header}>
        <div className={styles.priorityIndicator}>
          <div
            className={`${styles.priorityDot} ${
              styles[priorityColors[priority]]
            }`}
          ></div>
          <span className={styles.priorityText}>
            {priority.toUpperCase()} PRIORITY
          </span>
          {assignTo && (
            <div className={styles.avatarInitials}>
              {assignTo ? assignTo.substring(0, 2).toUpperCase() : null}
            </div>
          )}
        </div>
        <button
          className={styles.moreButton}
          onClick={() => setIsMoreClicked(!isMoreClicked)}
        >
          <MoreHorizontal size={26} style={{ color: "#000000" }} />
        </button>
        {isMoreClicked && (
          <div className={styles.moreButtonDropdownContainer}>
            <button onClick={editHandler}>Edit</button>
            <button onClick={shareHandler}>share</button>
            <button onClick={deleteHandler}>delete</button>
          </div>
        )}
      </div>

      <h3
        className={styles.title}
        title={title.length > maxTitleLength ? title : null}
      >
        {truncatedTitle}
      </h3>

      <div className={styles.checklistStatus}>
        <span className={styles.checklistText}>
          Checklist ({completedItems}/{checklist.length})
        </span>
        <button className={styles.expandButton} onClick={toggleExpand}>
          {isExpanded ? (
            <ChevronUp size={16} style={{ color: "#767575" }} />
          ) : (
            <ChevronDown size={16} style={{ color: "#767575" }} />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.checklistItems}>
          {checklist.map((item, index) => (
            <div key={index} className={styles.checklistItem}>
              <div
                className={`${
                  item.isDone
                    ? styles.checklistChecked
                    : styles.checklistUnchecked
                }`}
              >
                <Check size={16} style={{ color: "#ffffff" }} />
              </div>
              <span className={styles.checklistItemText}>
                {item.checkListValue}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <div>
          <span
            className={`${styles.date} ${
              isPending || priority === "high" ? styles.dateColor : ""
            }  ${date ? "" : styles.hidden}  ${
              status === "done" ? styles.done : ""
            }`}
          >
            {console.log(date, "date")}
            {date ? formatDateToMonthDay(new Date(date)) : null}
          </span>
        </div>
        <div className={styles.statusContainer}>
          {statuses.map(
            (status, index) =>
              currentStatus !== status && (
                <span
                  key={index}
                  className={`${styles.status}  `}
                  onClick={() => onUpdateStatus(taskId, status)}
                >
                  {columnHeading(status).toUpperCase()}
                </span>
              )
          )}
        </div>
      </div>
      {console.log(taskId, "taskId")}
      {isDeleteModalOpen && (
        <DeleteTaskModal
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={onDeleteConfirm}
          taskId={taskId}
        />
      )}
    </div>
  );
};

TaskCard.propTypes = {
  title: PropTypes.string.isRequired,
  checklist: PropTypes.arrayOf(
    PropTypes.shape({
      isDone: PropTypes.bool.isRequired,
      checkListValue: PropTypes.string.isRequired,
    })
  ).isRequired,
  priority: PropTypes.oneOf(["high", "moderate", "low"]).isRequired,
  date: PropTypes.instanceOf(Date),
  status: PropTypes.string.isRequired,
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  taskId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  collapseAllClicked: PropTypes.bool.isRequired,
  onDeleteConfirm: PropTypes.func.isRequired,
  assignTo: PropTypes.string.isRequired,
};

export default TaskCard;
