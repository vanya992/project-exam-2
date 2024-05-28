export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export function daysSince(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const timeDiff = today - date;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
}

export function totalDays(firstDate, lastDate) {
  const start = new Date(firstDate);
  const end = new Date(lastDate);
  const timeDiff = end - start;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
}
