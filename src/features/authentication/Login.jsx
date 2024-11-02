import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoginSuccessful) {
      navigate("/app/board", { replace: true });
    }
  }, [isLoginSuccessful, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.data.user.userName);
        setIsLoginSuccessful(true);
        toast.success("Login successful");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed. Please try again.");
        toast.error(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      toast.error("An error occurred. Please try again later.");
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
        <h2 className={styles.title}>Login</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className={styles.icon}>
              <Mail
                style={{ color: " #828282", width: "28px", height: "28px" }}
              />
            </span>
          </div>
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.loginButton}>
            Log in
          </button>
        </form>
        <p className={styles.registerText}>Have no account yet?</p>
        <button
          className={styles.registerButton}
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
