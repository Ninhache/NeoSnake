import { Coordinates } from "../@types/CoordinatesType";

export function clamp<T extends number>(value: T, min: T, max: T): T {
  if (min > max) {
    throw new Error("Minimum value cannot be greater than maximum value.");
  }
  return Math.max(min, Math.min(max, value)) as T;
}

export function bresenhamsLineAlgorithm(
  x0: number,
  y0: number,
  x1: number,
  y1: number
) {
  let points = [];
  let dx = Math.abs(x1 - x0);
  let sx = x0 < x1 ? 1 : -1;
  let dy = -Math.abs(y1 - y0);
  let sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  let e2;

  while (true) {
    points.push({ x: x0, y: y0 });
    if (x0 === x1 && y0 === y1) break;
    e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
  return points;
}

export function generateCirclePoints(
  cx: number,
  cy: number,
  radius: number
): Coordinates[] {
  let points: Coordinates[] = [];
  let x: number = radius;
  let y: number = 0;
  let p: number = 1 - radius;

  addCirclePoints(points, cx, cy, x, y);

  while (x > y) {
    y++;
    if (p <= 0) {
      p = p + 2 * y + 1;
    } else {
      x--;
      p = p + 2 * y - 2 * x + 1;
    }
    addCirclePoints(points, cx, cy, x, y);
  }

  return points;
}

function addCirclePoints(
  points: Coordinates[],
  cx: number,
  cy: number,
  x: number,
  y: number
): void {
  points.push({ x: cx + x, y: cy + y });
  points.push({ x: cx - x, y: cy + y });
  points.push({ x: cx + x, y: cy - y });
  points.push({ x: cx - x, y: cy - y });
  points.push({ x: cx + y, y: cy + x });
  points.push({ x: cx - y, y: cy + x });
  points.push({ x: cx + y, y: cy - x });
  points.push({ x: cx - y, y: cy - x });
}

export function rectangleAlgorithm(
  x0: number,
  y0: number,
  x1: number,
  y1: number
) {
  const xMin = Math.min(x0, x1);
  const xMax = Math.max(x0, x1);
  const yMin = Math.min(y0, y1);
  const yMax = Math.max(y0, y1);

  let points = [];
  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      points.push({ x, y });
    }
  }

  return points;
}
