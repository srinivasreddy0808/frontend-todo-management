import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import styles from "./AppLayout.module.css";
function AppLayout() {
  return (
    <>
      <div className={styles.appContainer}>
        <div className={styles.sidebarContainer}>
          <Sidebar />
        </div>
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default AppLayout;
