import { Entity } from "../classes/Entity";
import { Tile } from "../classes/Map";
import { Coordinates } from "./CoordinatesType";
import { DirectionType } from "./DirectionType";
import { foodType, obstacleType } from "./MapTypes";

export class ScenarioFruit extends Entity {
  protected value: number = 1;
  protected futurePosition: Coordinates[] = [];

  constructor(tile: Tile, futurePosition: Coordinates[]) {
    super(tile);
    this.futurePosition = futurePosition;
  }

  public addFuturePosition(position: Coordinates): void {
    this.futurePosition.push(position);
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

export interface ScenarioData {
  options: {
    width: 800;
    height: 800;
    cellSize: number;
    name: string;
  };
  snake: {
    startPosition: Coordinates;
    direction: DirectionType;
    length: number;
  };
  maps: ScenarioMapData[];
}

export interface ScenarioMapData {
  fruits: ScenarioFruits[];
  obstacles: {
    x: number;
    y: number;
    type: obstacleType;
  }[];
}

export const exampleScenario: ScenarioData = {
  options: {
    width: 800,
    height: 800,
    cellSize: 20,
    name: "Example Scenario",
  },
  snake: {
    startPosition: { x: 10, y: 10 },
    direction: "Right",
    length: 3,
  },
  maps: [
    {
      fruits: [
        {
          actualPosition: { x: 5, y: 5 },
          futurePosition: [],
          type: "FBa",
        },
        {
          actualPosition: { x: 20, y: 5 },
          futurePosition: [],
          type: "FBi",
        },
      ],
      obstacles: [
        { x: 0, y: 0, type: "OBa" },
        { x: 0, y: 1, type: "OBa" },
        { x: 0, y: 2, type: "OBa" },
        { x: 0, y: 3, type: "OBa" },
        { x: 0, y: 4, type: "OBa" },
        { x: 0, y: 5, type: "OBa" },
      ],
    },
  ],
};
