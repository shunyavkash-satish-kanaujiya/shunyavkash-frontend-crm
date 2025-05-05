export function safeLowerCase(value) {
  return typeof value === "string"
    ? value.toLowerCase()
    : value != null
    ? String(value).toLowerCase()
    : "";
}
