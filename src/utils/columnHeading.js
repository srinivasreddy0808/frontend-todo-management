export function columnHeading(status) {
  switch (status) {
    case "backlog":
      return "Backlog";
    case "todo":
      return "To Do";
    case "inprogress":
      return "In Progress";
    case "done":
      return "Done";
    default:
      return status;
  }
}
