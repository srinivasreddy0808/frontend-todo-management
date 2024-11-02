import { toast } from "sonner";
import styles from "./DeleteTaskModal.module.css";
import PropTypes from "prop-types";

const DeleteTaskModal = ({ onConfirm, onCancel, taskId }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      onConfirm();
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p className={styles.modalText}>Are you sure you want to Delete?</p>
        <button className={styles.deleteButton} onClick={handleDelete}>
          Yes, Delete
        </button>
        <button className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

DeleteTaskModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  taskId: PropTypes.string.isRequired,
};
export default DeleteTaskModal;
