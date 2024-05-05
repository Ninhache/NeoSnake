export function parseDateTime(
  dateTimeString: string,
  intl: string = "fr-FR"
): string {
  return new Date(dateTimeString).toLocaleString(intl, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}
