import { Entity } from "./Entity";
import { SnakeMap, Tile } from "./Map";
import { Snake } from "./Snake";

export abstract class Obstacle extends Entity {
  constructor(tile: Tile) {
    super(tile);
  }

  abstract effect(snake: Snake, map: SnakeMap): void;
  abstract draw(ctx: CanvasRenderingContext2D): void;
}

abstract class ObstacleDecorator extends Obstacle {
  protected obstacle: Obstacle;

  constructor(obstacle: Obstacle) {
    super(obstacle.getLocationTile());
    this.obstacle = obstacle;
  }

  public effect(snake: Snake, map: SnakeMap): void {
    this.obstacle.effect(snake, map);
  }

  public abstract draw(ctx: CanvasRenderingContext2D): void;
}

export class BasicObstacle extends Obstacle {
  public effect(snake: Snake): void {
    snake.hasToDie = true;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "black";
    ctx.fillRect(
      this.getLocationTile().x * this.locationTile.parent.cellSize,
      this.getLocationTile().y * this.locationTile.parent.cellSize,
      this.locationTile.parent.cellSize,
      this.locationTile.parent.cellSize
    );
  }
}

export class DifferentObstacle extends ObstacleDecorator {
  constructor(obstacle: Obstacle) {
    super(obstacle);
  }

  public effect(snake: Snake, map: SnakeMap): void {
    super.effect(snake, map);
    snake.hasToDie = true;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "blue";
    ctx.fillRect(
      this.getLocationTile().x * this.locationTile.parent.cellSize,
      this.getLocationTile().y * this.locationTile.parent.cellSize,
      this.locationTile.parent.cellSize,
      this.locationTile.parent.cellSize
    );
  }
}
