import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token: string): boolean {
  let decoded = null;

  try {
    decoded = jwtDecode(token);
  } catch (error) {
    return true;
  }

  if (decoded === null || decoded === undefined) return true;
  if (decoded.exp === undefined) return true;

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
