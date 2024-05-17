import { Entity } from "./Entity";
import { SnakeMap, Tile } from "./Map";
import { Snake } from "./Snake";

export abstract class Obstacle extends Entity {
  protected constructor(tile: Tile) {
    super(tile);
  }

  abstract effect(snake: Snake, map: SnakeMap): void;
  abstract draw(ctx: CanvasRenderingContext2D): void;
}

export type ObstacleColor =
  | "black"
  | "gray"
  | "silver"
  | "blue"
  | "teal"
  | "cyan"
  | "skyblue"
  | "indigo"
  | "purple"
  | "violet"
  | "fuchsia"
  | "pink"
  | "yellow"
  | "orange"
  | "gold"
  | "lime"
  | "green";

export class BasicObstacle extends Obstacle {
  private color: string;
  constructor(tile: Tile, color: ObstacleColor = "black") {
    super(tile);
    this.color = color;
  }

  public effect(snake: Snake): void {
    snake.hasToDie = true;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.getLocationTile().x * this.locationTile.parent.cellSize,
      this.getLocationTile().y * this.locationTile.parent.cellSize,
      this.locationTile.parent.cellSize,
      this.locationTile.parent.cellSize
    );
  }
}
