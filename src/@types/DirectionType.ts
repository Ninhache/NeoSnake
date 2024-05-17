export type DirectionType = "Up" | "Down" | "Left" | "Right";

export enum Direction {
  Up,
  Left,
  Down,
  Right,
}

export function stringToDirectionType(direction: string): Direction {
  if (direction in Direction) {
    return Direction[direction as keyof typeof Direction];
  }
  throw new Error(`Invalid direction ${direction}`);
}
