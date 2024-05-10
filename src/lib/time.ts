import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token: string): boolean {
  const decoded = jwtDecode(token);

  if (decoded === null || decoded === undefined) return false;
  if (decoded.exp === undefined) return false;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}

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
