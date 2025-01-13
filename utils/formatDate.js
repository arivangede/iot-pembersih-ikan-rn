import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const formatDate = (date, format = null) => {
  if (!date) return "Null";

  const now = dayjs();
  const inputDate = dayjs(date);

  if (format == "date") {
    return inputDate.format("MMM, DD YYYY | HH:mm:ss");
  }

  if (now.diff(inputDate, "day") >= 1) {
    return inputDate.format("MMM, DD YYYY | HH:mm:ss");
  } else {
    return inputDate.fromNow();
  }
};

export default formatDate;
