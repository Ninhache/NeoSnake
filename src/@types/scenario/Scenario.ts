import { Entity } from "../../classes/Entity";
import { MapSerializer, Tile } from "../../classes/Map";
import { BasicObstacle, ObstacleColor } from "../../classes/Obstacles";
import { Snake } from "../../classes/Snake";
import { Coordinates } from "../CoordinatesType";
import {
  Direction,
  DirectionType,
  stringToDirectionType,
} from "../DirectionType";
import { NextFrameInfo, foodType } from "../MapTypes";
import { Nullable } from "../NullableType";

export abstract class Scenario<T extends BaseScenarioData> {
  tiles: Tile[];
  snake: Snake;
  protected readonly jsonObj: T;
  protected indexCurrentMap: number;
  protected readonly scoreForEachMap: number[];
  protected readonly _scoreToWin: number;

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

    this.jsonObj = MapSerializer.deserialize(serializedMap) as T;

    this.width_px = this.jsonObj.options.width;
    this.height_px = this.jsonObj.options.height;
    this.cellSize = this.jsonObj.options.cellSize;

    this.width_cell = Math.floor(this.width_px / this.jsonObj.options.cellSize);
    this.height_cell = Math.floor(
      this.height_px / this.jsonObj.options.cellSize
    );

    // Create the map tiles
    for (let i = 0; this.cellSize * i < this.width_px; i++) {
      for (let j = 0; this.cellSize * j < this.height_px; j++) {
        this.tiles.push(new Tile(this, { x: i, y: j }));
      }
    }
    // Create the trash tile
    this.tiles.push(new Tile(this, { x: -1, y: -1 }));

    // Create the snake
    const startTile = this.getTile(
      this.jsonObj.snake.startPosition as Coordinates
    );
    if (!startTile) {
      throw new Error(
        `Invalid start position for snake at ${this.jsonObj.snake.startPosition}`
      );
    }

    this.snake = new Snake(startTile, this.cellSize);
    for (let i = 1; i < this.jsonObj.snake.length; i++) {
      this.snake.grow();
    }

    this.snake.directionQueue = [
      stringToDirectionType(this.jsonObj.snake.direction) ?? Direction.Right,
    ];

    this.indexCurrentMap = 0;
    this.scoreForEachMap = [];
    this.jsonObj.maps.forEach((map, index) => {
      let score = 0;
      map.fruits.forEach((fruit) => {
        score += 1 + fruit.futurePosition.length;
      });
      this.scoreForEachMap[index] = score;
    });
    this._scoreToWin = this.scoreForEachMap.reduce((a, b) => a + b, 0);
    this.loadMap(this.jsonObj.maps[this.indexCurrentMap]);
  }

  public loadMap(mapData: BaseScenarioMapData) {
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
      const { x, y, color } = obstacle;
      const cell = this.getTile({ x, y });
      if (!cell) {
        throw new Error(`Invalid obstacle position at ${x}, ${y}`);
      }
      cell.occupy(new BasicObstacle(cell, color));
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

  public draw(ctx: CanvasRenderingContext2D, alpha: number = 0): void {
    this.tiles.forEach((tile) => {
      tile.draw(ctx);
    });

    this.snake.draw(ctx, alpha);
  }

  reset(jsonObj?: BaseScenarioData): void {
    if (jsonObj === undefined) {
      jsonObj = this.jsonObj;
    }

    const { x, y } = jsonObj.snake.startPosition as Coordinates;
    const startTile = this.getTile({ x, y });
    if (startTile === null) {
      throw new Error(`Invalid start position for snake at ${{ x, y }}`);
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

export class ScenarioFruit extends Entity {
  protected value: number = 1;
  protected futurePosition: Coordinates[] = [];

  constructor(tile: Tile, futurePosition: Coordinates[]) {
    super(tile);
    this.futurePosition = futurePosition;
  }

  public next(): void {
    const nextPosition = this.futurePosition.shift();
    if (nextPosition !== undefined) {
      const nextTile = this.locationTile.parent.getTile(nextPosition);

      if (nextTile === null) {
        throw new Error(
          `Invalid tile position for ${this.constructor.name} at ${nextPosition}`
        );
      }

      this.move(nextTile);
    } else {
      this.disappear();
    }
  }

  private disappear(): void {
    if (this.locationTile !== null) {
      const map = this.locationTile.parent;
      const trash = map.getTile({ x: -1, y: -1 });

      if (trash === null) {
        throw new Error("Invalid tile position for trash");
      }

      this.move(trash);
    }
  }

  getValue(): number {
    return this.value;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "red";

    ctx.fillRect(
      this.getLocationTile().x * this.locationTile.parent.cellSize,
      this.getLocationTile().y * this.locationTile.parent.cellSize,
      this.locationTile.parent.cellSize,
      this.locationTile.parent.cellSize
    );
  }

  public effect(): void {
    this.locationTile.parent.snake.grow();
  }
}

export interface BaseFruits {
  actualPosition: Coordinates;
  futurePosition: Coordinates[];
  type: foodType;
}

export interface BaseObstacles {
  x: number;
  y: number;
  color: ObstacleColor;
}

export interface BaseOptionsData {
  width: number;
  height: number;
  cellSize: number;
  name: string;
  difficulty: number;
}

export interface BaseScenarioMapData {
  fruits: BaseFruits[];
  obstacles: BaseObstacles[];
}

export interface BaseScenarioData<
  T extends BaseScenarioMapData = BaseScenarioMapData
> {
  options: BaseOptionsData;
  snake: {
    startPosition: Coordinates;
    direction: DirectionType;
    length: number;
  };
  maps: T[];
}

export interface CampaignMapData extends BaseScenarioMapData {
  texts: ScenarioText[];
  fruits: BaseFruits[];
  obstacles: BaseObstacles[];
}

export interface CampaignScenarioData
  extends BaseScenarioData<CampaignMapData> {}

export interface ScenarioText {
  x: number;
  y: number;
  content: string;
}

export const exampleCampaignData: CampaignScenarioData = {
  options: {
    cellSize: 20,
    difficulty: 3,
    height: 800,
    width: 800,
    name: "blabla",
  },
  snake: {
    direction: "Right",
    length: 3,
    startPosition: {
      x: 5,
      y: 5,
    },
  },
  maps: [
    {
      fruits: [
        {
          actualPosition: { x: 1, y: 2 },
          futurePosition: [
            {
              x: 2,
              y: 3,
            },
          ],
          type: "FBa",
        },
      ],
      obstacles: [
        {
          x: 20,
          y: 20,
          color: "black",
        },
      ],
      texts: [
        {
          x: 200,
          y: 300,
          content: "Hello wolrd",
        },
      ],
    },
  ],
};
