import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import styles from "./Settings.module.css";

const Settings = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Count how many fields are filled

    const filledFields = Object.entries(formData).filter(
      ([, value]) => value.trim() !== ""
    );

    const changedData = Object.fromEntries(filledFields);

    // Check if both password fields are filled (counts as one update)
    const passwordsFilled = formData.oldPassword && formData.newPassword;
    const effectiveUpdates = filledFields.length - (passwordsFilled ? 1 : 0);

    if (effectiveUpdates > 1) {
      setError(
        "Please update only one field at a time (password change counts as one update)"
      );
      return;
    }

    // Validate password fields - either both or none
    if (
      (formData.oldPassword && !formData.newPassword) ||
      (!formData.oldPassword && formData.newPassword)
    ) {
      setError("Both old and new password are required for password change");
      return;
    }

    if (effectiveUpdates === 0) {
      setError("No changes detected");
      return;
    }

    // Handle successful submission here
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/update`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(changedData),
      }
    );

    if (response.ok) {
      // Handle success here
      const data = await response.json();
      localStorage.setItem("userName", data.data.user.userName);

      toast.success("Update successful");
    } else {
      // Handle error here
      toast.error("Update failed");

      setError("Update failed", response.statusText);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputWrapper}>
          <User className={styles.icon} />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.inputWrapper}>
          <Mail className={styles.icon} />
          <input
            type="email"
            name="email"
            placeholder="Update Email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.inputWrapper}>
          <Lock className={styles.icon} />
          <input
            type={showOldPassword ? "text" : "password"}
            name="oldPassword"
            placeholder="Old Password"
            value={formData.oldPassword}
            onChange={handleChange}
            className={`${styles.input} ${styles.passwordInput}`}
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className={styles.eyeIcon}
          >
            {showOldPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <div className={styles.inputWrapper}>
          <Lock className={styles.icon} />
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            className={`${styles.input} ${styles.passwordInput}`}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className={styles.eyeIcon}
          >
            {showNewPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <button type="submit" className={styles.updateButton}>
          Update
        </button>
      </form>
    </div>
  );
};

export default Settings;
