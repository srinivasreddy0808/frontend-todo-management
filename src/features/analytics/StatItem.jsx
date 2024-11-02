import PropTypes from "prop-types";
import styles from "./Analytics.module.css";

const StatItem = ({ label, value }) => {
  return (
    <div className={styles.statItem}>
      <div className={styles.statLabel}>
        <span className={styles.dot}></span>
        <span>{label}</span>
      </div>
      <div className={styles.statValue}>{String(value).padStart(2, "0")}</div>
    </div>
  );
};

StatItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export default StatItem;
