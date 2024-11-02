import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { MdDelete } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateHeader from "../ui/CustomDateHeader";
import CustomDateFooter from "../ui/CustomDateFooter";
import DatePicker from "react-datepicker";
import styles1 from "../ui/DatePicker.module.css";
import styles from "./CreateTaskModal.module.css";
import PropTypes from "prop-types";

const ButtonInput = React.forwardRef(({ value, onClick }, ref) => (
  <button className={styles.datePickerInput} onClick={onClick} ref={ref}>
    {value || "Select Date"}
  </button>
));
ButtonInput.displayName = "ButtonInput";

const CreateTaskModal = ({
  onClose,
  onTaskAdded,
  editingTask,
  userIds,
  emailIds,
}) => {
  const [title, setTitle] = useState(editingTask?.title || "");
  const [assignee, setAssignee] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [priority, setPriority] = useState(
    (editingTask?.priority || "high").toUpperCase() + " PRIORITY"
  );
  const [dueDate, setDueDate] = useState(
    editingTask?.dueDate
      ? new Date(parseInt(editingTask.dueDate)).toISOString().slice(0, 16)
      : null
  );
  const [checklist, setChecklist] = useState(
    editingTask?.checkList.map((item, index) => ({
      id: index + 1,
      text: item.checkListValue || "",
      done: item.isDone || false,
    })) || [{ id: 1, text: "Task to be done", done: false }]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTask) {
      setAssignee(() => emailIds[userIds.indexOf(editingTask?.assignTo)]);
    }
  }, [emailIds, editingTask, userIds]);

  const handleAddChecklist = () => {
    const newId = checklist.length + 1;
    setChecklist([...checklist, { id: newId, text: "", done: false }]);
  };

  const handleChecklistChange = (id, done) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, done } : item))
    );
  };

  const handleChecklistTextChange = (id, text) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, text } : item))
    );
  };

  const handleDeleteChecklist = (e, id) => {
    e.stopPropagation();
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  const handleAddTask = async () => {
    setLoading(true);
    setError("");

    try {
      if (!title) {
        throw new Error("Title is required");
      }

      if (checklist.length === 0) {
        throw new Error("Checklist is required");
      }
      const taskPayload = {
        title: title,
        priority: priority.toLowerCase().split(" ")[0], // Converting 'HIGH PRIORITY' to 'high'
        checkList: checklist.map((item) => ({
          isDone: item.done,
          checkListValue: item.text,
        })),
        status: "todo", // by default it is going to set to todo
        assignTo: userIds[emailIds.indexOf(assignee)], // here we are sending the userid of corresponding email
      };
      if (dueDate) {
        taskPayload.dueDate = dueDate.toISOString().slice(0, 16);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/tasks${
          editingTask ? `/${editingTask._id}` : ""
        }`,
        {
          method: `${editingTask ? "PUT" : "POST"}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(taskPayload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const createdTask = await response.json();
      onTaskAdded(createdTask.data.task);
      onClose();
    } catch (error) {
      setError(`${error.message || "Failed to create task"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAssigneeChange = (e) => {
    setAssignee(e.target.value);
  };

  const handleSelectAssignee = (email) => {
    setAssignee(email);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const filteredEmails =
    emailIds.length > 0
      ? emailIds.filter((email) =>
          (email?.toLowerCase() || "").includes(assignee?.toLowerCase() || "")
        )
      : [];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.formGroup}>
          <label htmlFor="title">
            Title <span className={styles.required}>*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <div className={styles.priorityGroup}>
            <label>
              Select Priority <span className={styles.required}>*</span>
            </label>
            <div className={styles.priorityOptions}>
              {["HIGH PRIORITY", "MODERATE PRIORITY", "LOW PRIORITY"].map(
                (option) => (
                  <button
                    key={option}
                    className={`${styles.priorityButton} ${
                      priority === option ? styles.active : ""
                    }`}
                    onClick={() => setPriority(option)}
                  >
                    <span
                      className={`${styles.priorityDot} ${
                        styles[option.toLowerCase().replace(" ", "-")]
                      }`}
                    ></span>
                    {option}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.assigneeGroup}>
            <label htmlFor="assignee" className={styles.assigneeLabel}>
              Assign to
            </label>
            <div className={styles.assigneeInputWrapper}>
              <input
                id="assignee"
                type="text"
                placeholder="Add an assignee"
                value={assignee}
                onChange={handleAssigneeChange}
                className={styles.input}
              />
              <button
                className={styles.dropdownToggle}
                onClick={toggleDropdown}
                aria-label="Toggle assignee dropdown"
              >
                {showDropdown ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>
            {showDropdown && (
              <div className={styles.dropdown}>
                {filteredEmails.map((email, index) => (
                  <div
                    key={index}
                    className={styles.dropdownItem}
                    onClick={() => handleSelectAssignee(email)}
                  >
                    <div className={styles.avatarInitials}>
                      {email.substring(0, 2).toUpperCase()}
                    </div>
                    <span>{email}</span>
                    <button className={styles.assignButton}>Assign</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={`${styles.formGroup} ${styles.checklistGroup}`}>
          <label>
            Checklist <span className={styles.required}>*</span>
          </label>
          {checklist.map((item) => (
            <div key={item.id} className={styles.checklistItem}>
              <input
                type="checkbox"
                checked={item.done}
                onChange={(e) =>
                  handleChecklistChange(item.id, e.target.checked)
                }
                className={styles.checklistCheckbox}
              />
              <input
                type="text"
                value={item.text || ""}
                onChange={(e) =>
                  handleChecklistTextChange(item.id, e.target.value)
                }
                className={styles.checklistInput}
                placeholder="Task to be done"
              />
              <button
                onClick={(e) => handleDeleteChecklist(e, item.id)}
                className={styles.deleteButton}
              >
                <MdDelete
                  style={{
                    color: "#CF3636",
                    fontSize: "24px",
                  }}
                />
              </button>
            </div>
          ))}
          <button onClick={handleAddChecklist} className={styles.addNewButton}>
            <span className={styles.addNewButtonItem}>
              <Plus />
            </span>
            <span className={styles.addNewButtonItem}> Add New</span>
          </button>
        </div>

        <div className={styles.modalActions}>
          <div className={styles.modalActionsLeft}>
            <div className={styles1.container}>
              <div className={styles1.wrapper}>
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  dateFormat="MM/dd/yyyy"
                  renderCustomHeader={CustomDateHeader}
                  formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 2)}
                  showPopperArrow={false}
                  calendarStartDay={1} // Start week on Monday
                  customInput={<ButtonInput />}
                  calendarContainer={({ children }) => (
                    <div>
                      {children}
                      <CustomDateFooter date={dueDate} setDate={setDueDate} />
                    </div>
                  )}
                  portal
                />
              </div>
            </div>
          </div>

          <div className={styles.modalActionsRight}>
            <button onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button
              onClick={handleAddTask}
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
};

CreateTaskModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onTaskAdded: PropTypes.func.isRequired,
  editingTask: PropTypes.shape({
    title: PropTypes.string,
    priority: PropTypes.string,
    checkList: PropTypes.arrayOf(
      PropTypes.shape({
        checkListValue: PropTypes.string.isRequired,
        isDone: PropTypes.bool.isRequired,
      })
    ),
    dueDate: PropTypes.string,
    assignTo: PropTypes.string,
    _id: PropTypes.string,
  }),
  emailIds: PropTypes.arrayOf(PropTypes.string),
  userIds: PropTypes.arrayOf(PropTypes.string),
};

ButtonInput.propTypes = {
  value: PropTypes.string, // or PropTypes.any, depending on the expected type
  onClick: PropTypes.func,
};
export default CreateTaskModal;
