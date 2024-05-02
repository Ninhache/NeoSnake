import { Coordinates } from "../@types/CoordinatesType";
import { Direction, stringToDirectionType } from "../@types/DirectionType";
import {
  NextFrameInfo,
  SnakeMapData,
  gameObjectType,
} from "../@types/MapTypes";
import { Nullable } from "../@types/NullableType";

import { BasicFood, BigFruit, Entity } from "./Entity";
import { BasicObstacle, DifferentObstacle } from "./Obstacles";
import { Snake, SnakeSegment } from "./Snake";

export class Tile {
  parent: SnakeMap;
  coordinates: Coordinates;
  private _data: Nullable<Entity>;

  constructor(
    parent: SnakeMap,
    coordinates: Coordinates,
    data: Nullable<Entity> = null
  ) {
    this.parent = parent;
    this.coordinates = coordinates;
    this._data = data;
  }

  get data(): Nullable<Entity> {
    return this._data;
  }

  set data(data: Nullable<Entity>) {
    this._data = data;
  }

  get x(): number {
    return this.coordinates.x;
  }

  get y(): number {
    return this.coordinates.y;
  }

  set x(x: number) {
    this.coordinates.x = x;
  }

  set y(y: number) {
    this.coordinates.y = y;
  }

  /**
   * Occupy the tile with an entity
   * @param entity
   */
  occupy(entity: Entity): void {
    this._data = entity;
  }

  /**
   * Vacate the tile
   */
  vacate(): void {
    this._data = null;
  }

  /**
   * Check if the tile is occupied
   * @returns
   */
  isOccupied(): boolean {
    return this._data !== null;
  }
}

export class SnakeMap {
  tiles: Tile[];
  snake: Snake;

  width_px: number;
  height_px: number;
  width_cell: number;
  height_cell: number;

  constructor(serializedMap: string) {
    this.tiles = [];

    const jsonObj = MapSerializer.deserialize(serializedMap) as SnakeMapData;

    this.width_px = jsonObj.options.width;
    this.height_px = jsonObj.options.height;

    this.width_cell = Math.floor(this.width_px / 20);
    this.height_cell = Math.floor(this.height_px / 20);

    // Create the map tiles
    for (let i = 0; i < this.width_cell; i++) {
      for (let j = 0; j < this.height_cell; j++) {
        this.tiles.push(new Tile(this, { x: i, y: j }));
      }
    }
    // Trash the old tiles
    this.tiles.push(new Tile(this, { x: -1, y: -1 }));

    // Create the snake
    const startTile = this.getTile(jsonObj.snake.startPosition as Coordinates);
    if (!startTile) {
      throw new Error(
        `Invalid start position for snake at ${jsonObj.snake.startPosition}`
      );
    }

    this.snake = new Snake(startTile);
    this.snake.body.push(
      ...jsonObj.snake.bodyParts.map((part) => {
        const tile = this.getTile(part);
        if (!tile) {
          throw new Error(`Invalid body part for snake at ${part}`);
        }
        return new SnakeSegment(tile);
      })
    );

    this.snake.directionQueue = [
      stringToDirectionType(jsonObj.snake.direction) || Direction.Right,
    ];

    // Create the game objects
    const objs = jsonObj.gameObject.map((obj) =>
      GameObjectFactory.createGameObject(this, obj)
    );
    objs.forEach((obj) => {
      const tile = this.getTile({
        x: obj.getLocationTile().x,
        y: obj.getLocationTile().y,
      });
      if (!tile) {
        throw new Error(
          `Invalid tile for object at ${obj.getLocationTile()} of type ${
            obj.constructor.name
          }`
        );
      }
      tile.data = obj;
    });
  }

  draw(ctx: CanvasRenderingContext2D, alpha: number = 0): void {
    this.tiles.forEach((tile) => {
      if (tile.data) {
        tile.data.draw(ctx);
      }
    });

    this.snake.draw(ctx, alpha);
  }

  playNextFrame(): NextFrameInfo {
    const snakeHasMoved = this.snake.processMovement(this);

    return { snakeHasMoved };
  }

  getTile(coordinates: Coordinates): Nullable<Tile> {
    return (
      this.tiles.find(
        (tile) => tile.x === coordinates.x && tile.y === coordinates.y
      ) || null
    );
  }
}

export class MapSerializer {
  static serialize(map: any): string {
    return JSON.stringify(map as SnakeMapData);
  }

  static deserialize(jsonString: string): SnakeMapData {
    return JSON.parse(jsonString);
  }
}

class GameObjectFactory {
  static createGameObject(
    map: SnakeMap,
    item: { x: number; y: number; type: gameObjectType }
  ): Entity {
    const tile = map.getTile({ x: item.x, y: item.y });

    if (tile === null) {
      throw new Error(
        `Invalid tile position for object of type ${item.type} at ${item.x}, ${item.y}`
      );
    }

    if (item.type.startsWith("F")) {
      const newFood = new BasicFood(tile);
      switch (item.type) {
        case "FBa":
          return newFood;
        case "FBi":
          return new BigFruit(newFood);
        default:
          throw new Error("Unsupported food type");
      }
    } else if (item.type.startsWith("O")) {
      const newObstacle = new BasicObstacle(tile);
      switch (item.type) {
        case "OBa":
          return newObstacle;
        case "ODi":
          return new DifferentObstacle(newObstacle);
        default:
          throw new Error("Unsupported obstacle type");
      }
    }

    throw new Error("Invalid game object type");
  }
}
