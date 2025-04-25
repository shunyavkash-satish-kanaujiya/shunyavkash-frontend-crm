export const formatDate = (input, format) => {
  if (!input) return "";

  const date = new Date(input);
  if (isNaN(date)) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  switch (format) {
    case "yyyy-MM-dd":
      return `${year}-${month}-${day}`;
    case "dd-MM-yyyy":
      return `${day}-${month}-${year}`;
    default:
      return `${year}-${month}-${day}`; // fallback
  }
};
