import { foodType, getColorFromType } from "../@types/MapTypes";
import { SnakeMap, Tile } from "./Map";

export abstract class Entity {
  locationTile: Tile;

  /**
   * @param {@class Tile} tile To instanciate an entity, a {@Tile} must be provided, Even if further the Tile can be null
   */
  constructor(tile: Tile) {
    this.locationTile = tile;
  }

  isColliding(entity: Entity): boolean {
    if (!this.isOnMap() || !entity.isOnMap()) {
      return false;
    }

    return (
      this.getLocationTile().x === entity.getLocationTile().x &&
      this.getLocationTile().y === entity.getLocationTile().y
    );
  }

  move(newTile: Tile): void {
    if (this.locationTile !== null) {
      this.locationTile.vacate();
    }
    this.locationTile = newTile;
    this.locationTile.occupy(this);
  }

  getLocationTile(): Tile {
    if (this.locationTile === null) {
      throw new Error("Entity is not on the map");
    }

    return this.locationTile;
  }

  isOnMap(): boolean {
    return this.locationTile !== null;
  }

  public abstract draw(ctx: CanvasRenderingContext2D): void;
}

export abstract class Food extends Entity {
  protected value: number = 1;
  protected abstract type: foodType;

  constructor(tile: Tile) {
    super(tile);
  }

  getValue(): number {
    return this.value;
  }

  abstract effect(): void;

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = getColorFromType(this.type);

    ctx.fillRect(
      this.getLocationTile().x * this.locationTile.parent.cellSize,
      this.getLocationTile().y * this.locationTile.parent.cellSize,
      this.locationTile.parent.cellSize,
      this.locationTile.parent.cellSize
    );
  }

  /**
   * Respawn the food at a random location on the screen, but not on the snake's body
   *
   * @param snake the snake is provided to prevent the food from spawning on the snake's body
   */
  public respawn(map: SnakeMap): void {
    let possiblePositions = [];
    for (let i = 0; i < map.width_cell; i++) {
      for (let j = 0; j < map.height_cell; j++) {
        possiblePositions.push({ x: i, y: j });
      }
    }

    // Remove positions that are occupied by the snake
    const snakePositions = new Set(
      map.snake.body.map((segment) => `${segment.x},${segment.y}`)
    );
    possiblePositions = possiblePositions.filter((pos) => {
      return !snakePositions.has(`${pos.x},${pos.y}`);
    });

    // Randomly pick a position from the remaining valid positions
    const randomIndex = Math.floor(Math.random() * possiblePositions.length);
    const newPos = possiblePositions[randomIndex];

    const newTile = map.getTile({ x: newPos.x, y: newPos.y });

    if (newTile === null) {
      throw new Error(
        `Invalid tile position for food respawn at ${newPos.x}, ${newPos.y}`
      );
    }

    this.move(newTile);
  }

  public disappear(): void {
    if (this.locationTile !== null) {
      const map = this.locationTile.parent;
      const trash = map.getTile({ x: -1, y: -1 });

      if (trash === null) {
        throw new Error("Invalid tile position for trash");
      }

      this.move(trash);
    }
  }
}

export class BasicFood extends Food {
  protected type: foodType = "FBa";
  constructor(tile: Tile) {
    super(tile);
  }

  public effect(): void {
    const map = this.getLocationTile().parent;

    map.snake.grow();
    this.respawn(map);
  }
}

abstract class FoodDecorator extends Food {
  protected food: Food;

  constructor(food: Food) {
    super(food.getLocationTile());
    this.food = food;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = getColorFromType(this.type);
    ctx.fillRect(
      this.getLocationTile().x * this.locationTile.parent.cellSize,
      this.getLocationTile().y * this.locationTile.parent.cellSize,
      this.locationTile.parent.cellSize,
      this.locationTile.parent.cellSize
    );
  }

  public effect(): void {
    this.food.effect();
  }
}

export class BigFruit extends FoodDecorator {
  protected type: foodType = "FBi";
  constructor(food: Food) {
    super(food);
  }

  getValue(): number {
    return this.food.getValue() * 15;
  }

  effect(): void {
    const map = this.getLocationTile().parent;
    for (let i = 0; i < 5; i++) {
      map.snake.grow();
    }

    this.disappear();
  }
}

export class DeadlyFruit extends FoodDecorator {
  protected type: foodType = "FDe";
  constructor(food: Food) {
    super(food);
  }

  effect(): void {
    this.getLocationTile().parent.snake.kill();
  }
}
