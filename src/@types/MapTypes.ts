import { DirectionType } from "../enums";
import { Coordinates } from "./CoordinatesType";

export type foodType = "FBa" | "FBi";
export type obstacleType = "OBa" | "ODi";
export type gameObjectType = foodType | obstacleType;

export interface SnakeMapData {
    options: {
        width: number,
        height: number,
        cellSize: number
    },
    snake: {
        startPosition: Coordinates,
        direction: DirectionType,
        bodyParts: Coordinates[]
    },
    gameObject: {
        x: number,
        y: number,
        type: gameObjectType
    }[]
}

export interface NextFrameInfo {
    snakeHasMoved: boolean;
}