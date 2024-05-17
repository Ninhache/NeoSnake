import { Coordinates } from "./CoordinatesType";
import { DirectionType } from "./DirectionType";
import { Nullable } from "./NullableType";

export type foodType = "FBa" | "FBi" | "FDe";
export type obstacleType = "OBa" | "ODi";
export type gameObjectType = foodType | obstacleType;

const colorMap: Record<gameObjectType, string> = {
  FBa: "red",
  FBi: "orange",
  FDe: "purple",
  OBa: "black",
  ODi: "blue",
};

export function getColorFromType(type: Nullable<gameObjectType>): string {
  if (type === null) {
    return "white";
  }

  const color = colorMap[type];
  if (color !== undefined) {
    return color;
  } else {
    throw new Error(`Color not found for type: ${type}`);
  }
}

export interface GameObject {
  x: number;
  y: number;
  type: gameObjectType;
}

export interface SnakeMapData {
  options: {
    width: 800;
    height: 800;
    cellSize: number;
    name: string;
  };
  snake: {
    startPosition: Coordinates;
    direction: DirectionType;
    length: number | 3;
  };
  gameObject: GameObject[];
}
export interface NextFrameInfo {
  snakeHasMoved: boolean;
}

export type SnakeMapType = "LOADED" | "LOADING" | "ERROR";
