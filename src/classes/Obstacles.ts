import {getColorFromType} from "../@types/MapTypes";
import {Entity} from "./Entity";
import {SnakeMap, Tile} from "./Map";
import {Snake} from "./Snake";

export abstract class Obstacle extends Entity {
  protected constructor(tile: Tile) {
    super(tile);
  }

  abstract effect(snake: Snake, map: SnakeMap): void;
  abstract draw(ctx: CanvasRenderingContext2D): void;
}

export class BasicObstacle extends Obstacle {
  public effect(snake: Snake): void {
    snake.hasToDie = true;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = getColorFromType("OBa");
    ctx.fillRect(
      this.getLocationTile().x * this.locationTile.parent.cellSize,
      this.getLocationTile().y * this.locationTile.parent.cellSize,
      this.locationTile.parent.cellSize,
      this.locationTile.parent.cellSize
    );
  }
}

