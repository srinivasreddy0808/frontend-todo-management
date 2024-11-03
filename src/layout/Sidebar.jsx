import { Settings, LogOut, Database, PanelsTopLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => {
    localStorage.clear();
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2000);
  };

  const isActive = (path) => location.pathname === path;
  return (
    <div className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <img
              src="/images/codesandbox2.png"
              alt="box"
              className={styles.appLogo}
            />
            <span className={styles.appName}>Pro Manage</span>
          </li>
          <li
            className={`${styles.navItem} ${
              isActive("/app/board") ? styles.active : ""
            }`}
            onClick={() => navigate("/app/board")}
          >
            <PanelsTopLeft className={styles.icon} />
            <span className={styles.navText}>Board</span>
          </li>
          <li
            className={`${styles.navItem} ${
              isActive("/app/analytics") ? styles.active : ""
            }`}
            onClick={() => navigate("/app/analytics")}
          >
            <Database className={styles.icon} />
            <span className={styles.navText}>Analytics</span>
          </li>
          <li
            className={`${styles.navItem} ${
              isActive("/app/settings") ? styles.active : ""
            }`}
            onClick={() => navigate("/app/settings")}
          >
            <Settings className={styles.icon} />
            <span className={styles.navText}>Settings</span>
          </li>
        </ul>
      </nav>
      <div className={styles.logoutContainer}>
        <button className={styles.logoutButton} onClick={logout}>
          <LogOut className={styles.logoutIcon} />
          <span className={styles.logoutText}>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
