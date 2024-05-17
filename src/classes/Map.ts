import { Coordinates } from "../@types/CoordinatesType";
import { Direction, stringToDirectionType } from "../@types/DirectionType";
import { NextFrameInfo } from "../@types/MapTypes";
import { Nullable } from "../@types/NullableType";
import {
  ScenarioData,
  ScenarioFruit,
  ScenarioMapData,
} from "../@types/Scenario";

import { Entity } from "./Entity";
import { BasicObstacle } from "./Obstacles";
import { Snake } from "./Snake";

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
  private readonly jsonObj: ScenarioData;
  private indexCurrentMap: number;
  private readonly scoreForEachMap: number[];
  private readonly _scoreToWin: number;

  /**
   * The width of the map in pixels (should be always 800)
   */
  width_px: number;

  /**
   * The height of the map in pixels (should be always 800)
   */
  height_px: number;

  /**
   * The size of each cell in the map
   */
  cellSize: number;

  /**
   * The width of the map in cells
   */
  width_cell: number;

  /**
   * The height of the map in cells
   */
  height_cell: number;

  constructor(serializedMap: string) {
    this.tiles = [];

    const jsonObj = MapSerializer.deserialize(serializedMap);

    this.width_px = jsonObj.options.width;
    this.height_px = jsonObj.options.height;
    this.cellSize = jsonObj.options.cellSize;

    this.width_cell = Math.floor(this.width_px / jsonObj.options.cellSize);
    this.height_cell = Math.floor(this.height_px / jsonObj.options.cellSize);

    // Create the map tiles
    for (let i = 0; this.cellSize * i < this.width_px; i++) {
      for (let j = 0; this.cellSize * j < this.height_px; j++) {
        this.tiles.push(new Tile(this, { x: i, y: j }));
      }
    }
    // Create the trash tile
    this.tiles.push(new Tile(this, { x: -1, y: -1 }));

    // Create the snake
    const startTile = this.getTile(jsonObj.snake.startPosition as Coordinates);
    if (!startTile) {
      throw new Error(
        `Invalid start position for snake at ${jsonObj.snake.startPosition}`
      );
    }

    this.snake = new Snake(startTile, this.cellSize);
    for (let i = 1; i < jsonObj.snake.length; i++) {
      this.snake.grow();
    }

    this.snake.directionQueue = [
      stringToDirectionType(jsonObj.snake.direction) || Direction.Right,
    ];

    this.indexCurrentMap = 0;
    this.scoreForEachMap = [];
    jsonObj.maps.forEach((map, index) => {
      let score = 0;
      map.fruits.forEach((fruit) => {
        score += 1 + fruit.futurePosition.length;
      });
      this.scoreForEachMap[index] = score;
    });
    this._scoreToWin = this.scoreForEachMap.reduce((a, b) => a + b, 0);
    this.loadMap(jsonObj.maps[this.indexCurrentMap]);

    this.jsonObj = JSON.parse(JSON.stringify(jsonObj));
  }

  loadMap(mapData: ScenarioMapData) {
    this.tiles.forEach((tile) => {
      tile.vacate();
    });
    mapData.fruits.forEach((fruit) => {
      const { x, y } = fruit.actualPosition;
      const cell = this.getTile({ x, y });
      if (!cell) {
        throw new Error(`Invalid fruit position at ${x}, ${y}`);
      }
      cell.occupy(new ScenarioFruit(cell, fruit.futurePosition));
    });

    mapData.obstacles.forEach((obstacle) => {
      const { x, y } = obstacle;
      const cell = this.getTile({ x, y });
      if (!cell) {
        throw new Error(`Invalid obstacle position at ${x}, ${y}`);
      }
      cell.occupy(new BasicObstacle(cell));
    });
  }

  scoreNeeded(): number {
    return this.scoreForEachMap[this.indexCurrentMap];
  }

  scoreToWin(): number {
    return this._scoreToWin;
  }

  next(): void {
    this.indexCurrentMap += 1;
    if (this.indexCurrentMap >= this.jsonObj.maps.length) {
      throw new Error("No more maps to load, apparently player wins!");
    } else {
      this.loadMap(this.jsonObj.maps[this.indexCurrentMap]);
    }
  }

  draw(ctx: CanvasRenderingContext2D, alpha: number = 0): void {
    this.tiles.forEach((tile) => {
      if (tile.data) {
        tile.data.draw(ctx);
      }
    });

    this.snake.draw(ctx, alpha);
  }

  reset(jsonObj?: ScenarioData): void {
    if (jsonObj === undefined) {
      jsonObj = this.jsonObj;
    }

    const startCoordinates = jsonObj.snake.startPosition as Coordinates;
    const startTile = this.getTile(startCoordinates);
    if (startTile === null) {
      throw new Error(
        `Invalid start position for snake at ${startCoordinates}`
      );
    }

    this.snake.reset(startTile);
    for (let i = 1; i < jsonObj.snake.length; i++) {
      this.snake.grow();
    }

    this.loadMap(jsonObj.maps[this.indexCurrentMap]);
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
    return JSON.stringify(map as ScenarioData);
  }

  static deserialize(jsonString: string): ScenarioData {
    return JSON.parse(jsonString);
  }
}
