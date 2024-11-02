import { format } from "date-fns";
import { ArrowUp, ArrowDown } from "lucide-react";
import PropTypes from "prop-types";
import styles from "./DatePicker.module.css";

// Custom header to match the design
const CustomDateHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => (
  <div className={styles.header}>
    <span className={styles.headerTitle}>{format(date, "MMMM, yyyy")}</span>
    <div className={styles.navigationButtons}>
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className={styles.navButton}
      >
        <ArrowUp color="#000000" />
      </button>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className={styles.navButton}
      >
        <ArrowDown color="#000000" />
      </button>
    </div>
  </div>
);

CustomDateHeader.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  decreaseMonth: PropTypes.func.isRequired,
  increaseMonth: PropTypes.func.isRequired,
  prevMonthButtonDisabled: PropTypes.bool,
  nextMonthButtonDisabled: PropTypes.bool,
};

export default CustomDateHeader;
