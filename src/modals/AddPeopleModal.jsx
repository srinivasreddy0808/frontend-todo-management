import { useState } from "react";
import { toast } from "sonner";
import PropTypes from "prop-types";
import styles from "./AddPeopleModal.module.css";

const AddPeopleModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [addPeopleSuccess, setAddPeopleSuccess] = useState(false);
  const [successMail, setSuccessMail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle email submission here
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/add-people`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add people");
      }
      setSuccessMail(email);
      setEmail("");
      setAddPeopleSuccess(true);
    } catch (error) {
      setSuccessMail("");
      toast.error(`${error.message || "Failed to add people"}`);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {addPeopleSuccess ? (
          <>
            <div className={styles.successModal}>
              <h2 className={styles.emailText}>
                {successMail} added to the board
              </h2>
              <button
                onClick={() => {
                  setAddPeopleSuccess(false);
                  onClose();
                }}
                className={styles.closeButton}
              >
                okay gotIt{" "}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className={styles.modalTitle}>Add people to the board</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                placeholder="Enter the email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.emailInput}
                required
              />

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.addButton}>
                  Add Email
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

AddPeopleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddPeopleModal;
