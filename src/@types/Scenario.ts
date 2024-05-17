import {Entity} from "../classes/Entity";
import {Tile} from "../classes/Map";
import {Coordinates} from "./CoordinatesType";
import {DirectionType} from "./DirectionType";
import {foodType, obstacleType} from "./MapTypes";

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

export interface ScenarioFruits {
  actualPosition: Coordinates;
  futurePosition: Coordinates[];
  type: foodType;
}

export interface ScenarioObstacles {
  x: number;
  y: number;
  type: obstacleType;
}

export interface OptionsScenarioData {
  width: number;
  height: number;
  cellSize: number;
  name: string;
  difficulty: number;
}

export interface ScenarioData {
  options: OptionsScenarioData;
  snake: {
    startPosition: Coordinates;
    direction: DirectionType;
    length: number;
  };
  maps: ScenarioMapData[];
}

export interface ScenarioMapData {
  fruits: ScenarioFruits[];
  obstacles: ScenarioObstacles[];
}
