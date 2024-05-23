import {
  BaseScenarioData,
  BaseScenarioMapData,
} from "../@types/scenario/Scenario";

export interface Coordinates {
  x: number;
  y: number;
}

interface ReturnMessage {
  message: string;
  success: boolean;
}

function validateOptions(options: BaseScenarioData["options"]): ReturnMessage {
  if (options.width !== 800) {
    return { message: "Invalid or missing width in options", success: false };
  }
  if (options.height !== 800) {
    return { message: "Invalid or missing height in options", success: false };
  }
  if (options.cellSize <= 0) {
    return {
      message: "Invalid or missing cellSize in options",
      success: false,
    };
  }
  if (options.name.trim() === "") {
    return { message: "Invalid or missing name in options", success: false };
  }
  return { message: "Options are valid", success: true };
}

function validateSnake(snake: BaseScenarioData["snake"]): ReturnMessage {
  if (!snake.startPosition) {
    return {
      message: "Invalid or missing startPosition in snake",
      success: false,
    };
  }
  if (!["Up", "Down", "Left", "Right"].includes(snake.direction)) {
    return { message: "Invalid or missing direction in snake", success: false };
  }
  if (snake.length <= 0) {
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
  data: BaseScenarioData
): OverlapDetail[] {
  const overlaps: OverlapDetail[] = [];

  data.maps.forEach((map, mapIndex) => {
    const obstaclePositions: Coordinates[] = map.obstacles.map((obstacle) => ({
      x: obstacle.x,
      y: obstacle.y,
    }));

    map.fruits.forEach((fruit, fruitIndex) => {
      obstaclePositions.forEach((obstacle, obstacleIndex) => {
        if (
          obstacle.x === fruit.actualPosition.x &&
          obstacle.y === fruit.actualPosition.y
        ) {
          overlaps.push({
            mapIndex,
            fruitIndex,
            obstacleIndex,

            position: fruit.actualPosition,
            type: "current",
          });
        }
      });

      fruit.futurePosition.forEach((futurePos) => {
        obstaclePositions.forEach((obstacle, obstacleIndex) => {
          if (obstacle.x === futurePos.x && obstacle.y === futurePos.y) {
            overlaps.push({
              mapIndex,
              fruitIndex,
              obstacleIndex,

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
  mapData: BaseScenarioMapData,
  index: number
): ReturnMessage {
  if (!Array.isArray(mapData.fruits) || mapData.fruits.length === 0) {
    return {
      message: `Fruits array for step n°${index + 1} is empty`,
      success: false,
    };
  }

  // check if there's fruits with the same position
  const fruitPositions: Coordinates[] = [];
  for (let i = 0; i < mapData.fruits.length; i++) {
    const fruit = mapData.fruits[i];
    const fruitPosition = {
      x: fruit.actualPosition.x,
      y: fruit.actualPosition.y,
    };

    if (
      fruitPositions.some(
        (pos) => pos.x === fruitPosition.x && pos.y === fruitPosition.y
      )
    ) {
      return {
        message: `Fruits with the same position in step n°${index + 1}`,
        success: false,
      };
    }

    fruitPositions.push(fruitPosition);
  }

  if (!Array.isArray(mapData.obstacles)) {
    return {
      message: `Invalid data in obstacles for step n°${index}`,
      success: false,
    };
  }

  return { message: "Map data is valid", success: true };
}

export function isValidData(data: BaseScenarioData): ReturnMessage {
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
          message: `Overlap between objects for Scene n°${
            details.mapIndex + 1
          }, with fruit n°${
            Number(details.fruitIndex) + 1
          } : first overlap with an obstacle at position (${
            details.position.x
          }, ${details.position.y})`,
          success: false,
        };
      } else if (details.type === "future") {
        return {
          message: `Overlap between objects for Fruit n°${
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
