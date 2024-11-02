import styles from "./TaskSkeletonLoading.module.css";

const TaskSkeletonLoading = () => {
  return (
    <div className={styles.skeletonTask}>
      <div className={styles.skeletonHeader}>
        <div
          className={`${styles.skeletonTitle} ${styles.skeletonPulse}`}
        ></div>
        <div className={`${styles.skeletonIcon} ${styles.skeletonPulse}`}></div>
      </div>
      <div className={styles.skeletonContent}>
        <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`}></div>
        <div
          className={`${styles.skeletonLine} ${styles.skeletonLineShort} ${styles.skeletonPulse}`}
        ></div>
      </div>
      <div className={styles.skeletonFooter}>
        <div className={`${styles.skeletonDate} ${styles.skeletonPulse}`}></div>
        <div
          className={`${styles.skeletonPriority} ${styles.skeletonPulse}`}
        ></div>
      </div>
    </div>
  );
};

export default TaskSkeletonLoading;
