import { ScenarioData, ScenarioMapData } from "../@types/Scenario";

export interface Coordinates {
  x: number;
  y: number;
}

interface ReturnMessage {
  message: string;
  success: boolean;
}

function validateOptions(options: ScenarioData["options"]): ReturnMessage {
  if (typeof options.width !== "number" || options.width !== 800) {
    return { message: "Invalid or missing width in options", success: false };
  }
  if (typeof options.height !== "number" || options.height !== 800) {
    return { message: "Invalid or missing height in options", success: false };
  }
  if (typeof options.cellSize !== "number" || options.cellSize <= 0) {
    return {
      message: "Invalid or missing cellSize in options",
      success: false,
    };
  }
  if (typeof options.name !== "string" || options.name.trim() === "") {
    return { message: "Invalid or missing name in options", success: false };
  }
  return { message: "Options are valid", success: true };
}

function validateSnake(snake: ScenarioData["snake"]): ReturnMessage {
  if (
    !snake.startPosition ||
    typeof snake.startPosition.x !== "number" ||
    typeof snake.startPosition.y !== "number"
  ) {
    return {
      message: "Invalid or missing startPosition in snake",
      success: false,
    };
  }
  if (
    typeof snake.direction !== "string" ||
    !["Up", "Down", "Left", "Right"].includes(snake.direction)
  ) {
    return { message: "Invalid or missing direction in snake", success: false };
  }
  if (typeof snake.length !== "number" || snake.length <= 0) {
    return { message: "Invalid or missing length in snake", success: false };
  }
  return { message: "Snake is valid", success: true };
}

export interface OverlapDetail {
  mapIndex: number;
  fruitIndex?: number;
  obstacleIndex?: number;
  position: Coordinates;
  type: "current" | "future";
}

export function checkForOverlapWithDetails(
  data: ScenarioData
): OverlapDetail[] {
  const overlaps: OverlapDetail[] = [];

  data.maps.forEach((map, mapIndex) => {
    const obstaclePositions: Coordinates[] = map.obstacles.map((obstacle) => ({
      x: obstacle.x,
      y: obstacle.y,
    }));

    map.fruits.forEach((fruit, fruitIndex) => {
      obstaclePositions.forEach((obstacle) => {
        if (
          obstacle.x === fruit.actualPosition.x &&
          obstacle.y === fruit.actualPosition.y
        ) {
          overlaps.push({
            mapIndex,
            fruitIndex,

            position: fruit.actualPosition,
            type: "current",
          });
        }
      });

      fruit.futurePosition.forEach((futurePos) => {
        obstaclePositions.forEach((obstacle) => {
          if (obstacle.x === futurePos.x && obstacle.y === futurePos.y) {
            overlaps.push({
              mapIndex,
              fruitIndex,

              position: futurePos,
              type: "future",
            });
          }
        });
      });
    });
  });

  return overlaps;
}

function validateMapData(
  mapData: ScenarioMapData,
  index: number
): ReturnMessage {
  if (!Array.isArray(mapData.fruits) || mapData.fruits.length === 0) {
    return {
      message: `Fruits array for step n°${index + 1} is empty`,
      success: false,
    };
  }

  if (
    !Array.isArray(mapData.obstacles) ||
    mapData.obstacles.some(
      (ob) =>
        typeof ob.x !== "number" ||
        typeof ob.y !== "number" ||
        typeof ob.type !== "string"
    )
  ) {
    return {
      message: `Invalid data in obstacles for step n°${index}`,
      success: false,
    };
  }

  return { message: "Map data is valid", success: true };
}

export function isValidData(data: ScenarioData): ReturnMessage {
  if (!data) {
    return { message: "Data is undefined", success: false };
  }

  const optionsValidation = validateOptions(data.options);
  if (!optionsValidation.success) {
    return optionsValidation;
  }

  const snakeValidation = validateSnake(data.snake);
  if (!snakeValidation.success) {
    return snakeValidation;
  }

  for (let index = 0; index < data.maps.length; index++) {
    const map = data.maps[index];
    const mapValidation = validateMapData(map, index);
    if (!mapValidation.success) {
      return mapValidation;
    }

    const overlapDetails = checkForOverlapWithDetails(data);
    if (overlapDetails.length > 0) {
      const details = overlapDetails.shift();

      if (!details) {
        return { message: "Data is invalid", success: false };
      }

      if (details.type === "current") {
        return {
          message: `Overlap between objects in step n°${
            index + 1
          }, first overlap at Fruit n°${
            Number(details.obstacleIndex) + 1
          } at position (${details.position.x}, ${details.position.y})`,
          success: false,
        };
      } else if (details.type === "future") {
        return {
          message: `Overlap between objects in step n°${
            index + 1
          }, first overlap at Fruit n°${
            Number(details.fruitIndex) + 1
          }, for Future Position at position (${details.position.x}, ${
            details.position.y
          })`,
          success: false,
        };
      }
    }
  }

  return { message: "Data is valid", success: true };
}