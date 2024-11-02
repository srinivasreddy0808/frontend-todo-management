export function formatDateToMonthDay(date) {
  const monthOptions = { month: "short" }; // Short month (e.g., Feb)
  const month = date.toLocaleDateString("en-US", monthOptions);

  const day = date.getDate();

  // Function to get the correct suffix for the day
  function getDaySuffix(day) {
    if (day > 3 && day < 21) return "th"; // 4th to 20th are always "th"
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  return `${month} ${day}${getDaySuffix(day)}`;
}

export function formatedDateToDayMonthYear() {
  const date = new Date();

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  // Add ordinal suffix to day
  const ordinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${ordinalSuffix(day)} ${month}, ${year}`;
}
