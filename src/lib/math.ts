export function clamp<T extends number>(value: T, min: T, max: T): T {
  if (min > max) {
    throw new Error("Minimum value cannot be greater than maximum value.");
  }
  return Math.max(min, Math.min(max, value)) as T;
}
