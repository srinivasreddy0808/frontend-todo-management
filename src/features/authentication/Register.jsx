import { User, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import styles from "./Login.module.css";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setApiError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userName: formData.userName,
              password: formData.password,
              email: formData.email,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Registration failed");
        }

        await response.json();

        // Reset form after successful submission
        setFormData({
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        toast.success("Registration successful now login");

        navigate("/login");

        // Here you might want to redirect the user or show a success message
      } catch (error) {
        setApiError("Registration failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("error registering");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.blueBackground}>
        <div className={styles.imageContainer}>
          <img
            className={styles.circle}
            src="/images/backcircle.png"
            alt="Logo"
          />
          <img
            className={styles.robot}
            src="/images/welcomeimage.png"
            alt="Login"
          />
        </div>
        <div className={styles.welcomeText}>
          <h1>Welcome aboard my friend</h1>
          <p>just a couple of clicks and we start</p>
        </div>
      </div>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Register</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="userName"
              placeholder="Username"
              className={styles.input}
              value={formData.userName}
              onChange={handleChange}
            />
            <span className={styles.icon}>
              <User
                style={{ color: "#828282", width: "28px", height: "28px" }}
              />
            </span>
          </div>
          {errors.userName && (
            <span className={styles.errorMessage}>{errors.userName}</span>
          )}
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
            />
            <span className={styles.icon}>
              <Mail
                style={{ color: " #828282", width: "28px", height: "28px" }}
              />
            </span>
          </div>
          {errors.email && (
            <span className={styles.errorMessage}>{errors.email}</span>
          )}
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
            />
            <span className={styles.icon}>
              <LockKeyhole
                style={{ color: " #828282", width: "28px", height: "28px" }}
              />
            </span>
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff
                  style={{ color: " #828282", width: "28px", height: "28px" }}
                />
              ) : (
                <Eye
                  style={{ color: " #828282", width: "28px", height: "28px" }}
                />
              )}
            </span>
          </div>
          {errors.password && (
            <span className={styles.errorMessage}>{errors.password}</span>
          )}
          <div className={styles.inputGroup}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className={styles.input}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <span className={styles.icon}>
              <LockKeyhole
                style={{ color: " #828282", width: "28px", height: "28px" }}
              />
            </span>
            <span
              className={styles.eyeIcon}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff
                  style={{ color: " #828282", width: "28px", height: "28px" }}
                />
              ) : (
                <Eye
                  style={{ color: " #828282", width: "28px", height: "28px" }}
                />
              )}
            </span>
          </div>
          {errors.confirmPassword && (
            <span className={styles.errorMessage}>
              {errors.confirmPassword}
            </span>
          )}
          {apiError && <div className={styles.errorMessage}>{apiError}</div>}
          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className={styles.registerText}>Have an account?</p>
        <button
          className={styles.registerButton}
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default Register;
