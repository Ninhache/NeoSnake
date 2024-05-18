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

export function timestampToChrono(timestamp: number): string {
  const minutes = Math.floor(timestamp / 60000);
  const seconds = Math.floor((timestamp % 60000) / 1000);
  const milliseconds = timestamp % 1000;

  return `${padZero(minutes)}:${padZero(seconds)}.${padZero(milliseconds, 3)}`;
}

function padZero(num: number, length: number = 2): string {
  return num.toString().padStart(length, "0");
}

export function parseDateTime(
  dateTimeString: string,
  intl: string = "fr-FR"
): string {
  return new Date(dateTimeString).toLocaleString(intl, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
