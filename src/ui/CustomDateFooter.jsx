import PropTypes from "prop-types";
import styles from "./DatePicker.module.css";

const CustomDateFooter = ({ date, setDate }) => (
  <div className={styles.footer}>
    <button onClick={() => setDate(null)} className={styles.footerButton}>
      Clear
    </button>
    {console.log(date)}
    <button onClick={() => setDate(new Date())} className={styles.footerButton}>
      Today
    </button>
  </div>
);

CustomDateFooter.propTypes = {
  date: PropTypes.instanceOf(Date),
  setDate: PropTypes.func,
};

export default CustomDateFooter;
