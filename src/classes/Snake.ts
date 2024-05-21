import { Coordinates } from "../@types/CoordinatesType";
import { Direction } from "../@types/DirectionType";
import {
  BaseScenarioData,
  Scenario,
  ScenarioFruit,
} from "../@types/scenario/Scenario";
import { Tile } from "./Map";

import { Obstacle } from "./Obstacles";

export class SnakeSegment {
  current: Coordinates;
  target: Coordinates;

  constructor(coordinates: Coordinates) {
    this.current = coordinates;
    this.target = coordinates;
  }

  updatePosition(newX: number, newY: number) {
    this.current = { ...this.target };
    this.target = { x: newX, y: newY };
  }

  get x(): number {
    return this.current.x;
  }

  get y(): number {
    return this.current.y;
  }
}

export class Snake {
  head: SnakeSegment;
  body: SnakeSegment[];
  directionQueue: Direction[] = [];
  currentDirection: Direction;
  hasToDie: boolean = false;
  cellSize: number;

  constructor(
    headCoordinates: Coordinates,
    cellSize: number,
    direction: Direction = Direction.Right
  ) {
    this.head = new SnakeSegment(headCoordinates);
    this.body = [new SnakeSegment(headCoordinates)];
    this.currentDirection = direction;
    this.cellSize = cellSize;
  }

  public eat(food: ScenarioFruit): void {
    food.effect();
    food.next();
  }

  public reset(startTile: Tile): void {
    this.head = new SnakeSegment(startTile.coordinates);
    this.body = [new SnakeSegment(startTile.coordinates)];
    this.currentDirection = Direction.Right;
    this.directionQueue = [];
    this.hasToDie = false;
  }

  public grow(): void {
    const current = this.body[this.body.length - 1].current;
    this.body.push(new SnakeSegment({ x: current.x, y: current.y }));
  }

  public enqueueDirection(newDirection: Direction) {
    if (this.directionQueue.length < 2) {
      const lastDirection =
        this.directionQueue.length > 0
          ? this.directionQueue[this.directionQueue.length - 1]
          : this.currentDirection;
      /*
       * Prevent the snake from going in the opposite direction
       * BUT there's a little problem, it's only working because the enum values are in a specific order :
       *
       *   enum Direction {
       *         Up,     // 0
       *         Left,   // 1
       *         Down,   // 2
       *         Right,  // 3
       *   }
       *
       * If we change the order of the values, this logic will break
       */
      if (Math.abs(lastDirection - newDirection) !== 2) {
        this.directionQueue.push(newDirection);
      }
    }
  }

  public kill(): void {
    this.hasToDie = true;
  }

  public processMovement(map: Scenario<BaseScenarioData>): boolean {
    if (this.directionQueue.length > 0) {
      this.currentDirection = this.directionQueue.shift()!;
    }

    if (this.hasToDie) {
      return false;
    }

    const newHead: Coordinates = {
      x: this.head.target.x,
      y: this.head.target.y,
    };

    switch (this.currentDirection) {
      case Direction.Up:
        newHead.y -= 1;
        break;
      case Direction.Down:
        newHead.y += 1;
        break;
      case Direction.Left:
        newHead.x -= 1;
        break;
      case Direction.Right:
        newHead.x += 1;
        break;
    }

    if (
      this.isLeavingTheScreen(newHead, map.width_cell, map.height_cell) ||
      this.isCollidingWithSelf(newHead) ||
      this.isCollidingWithObstacle(newHead, map)
    ) {
      return false;
    }

    this.head.updatePosition(newHead.x, newHead.y);
    this.body[0].updatePosition(this.head.current.x, this.head.current.y);
    for (let i = 0; i < this.body.length - 1; i++) {
      this.body[i + 1].updatePosition(
        this.body[i].current.x,
        this.body[i].current.y
      );
    }

    this.directionQueue = [];

    return true;
  }

  public isCollidingWithSelf(newHead: Coordinates): boolean {
    return this.body
      .slice(0, -1)
      .some((segment) => segment.x === newHead.x && segment.y === newHead.y);
  }

  public isLeavingTheScreen(
    newHead: Coordinates,
    gameWidth_cell: number,
    gameHeight_cell: number
  ): boolean {
    return (
      newHead.x < 0 ||
      newHead.x >= gameWidth_cell ||
      newHead.y < 0 ||
      newHead.y >= gameHeight_cell
    );
  }

  public isCollidingWithObstacle(
    newHead: Coordinates,
    snakeMap: Scenario<BaseScenarioData>
  ): boolean {
    const maybeTile = snakeMap.getTile(newHead);

    if (maybeTile === null) {
      return false;
    }

    const maybeData = maybeTile.data;

    if (maybeData === null) {
      return false;
    }

    if (maybeData instanceof Obstacle) {
      maybeData.effect(this, snakeMap);
      return true;
    }

    return false;
  }

  /**
   * Used to calculate the color in the draw method, the goal is to make the snake darker as it gets further from the head
   *
   * @param i the index of the segment
   * @param length the length of the snake
   * @returns a number between 0x40 and 0xA0
   */
  private calculateColor(i: number, length: number): number {
    return Math.floor(0xa0 - (i * 0xa0) / length) + 0x40;
  }

  private interpolate(
    current: Coordinates,
    target: Coordinates,
    alpha: number
  ): Coordinates {
    return {
      x: current.x + (target.x - current.x) * alpha,
      y: current.y + (target.y - current.y) * alpha,
    };
  }

  public draw(ctx: CanvasRenderingContext2D, alpha: number = 0): void {
    ctx.fillStyle = "#00D000";

    let headPos = this.interpolate(this.head.current, this.head.target, alpha);

    ctx.fillRect(
      headPos.x * this.cellSize,
      headPos.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );

    this.body.forEach((segment, i) => {
      ctx.fillStyle = `rgb(0,${this.calculateColor(i, this.body.length)},0)`;
      let segmentPos = this.interpolate(segment.current, segment.target, alpha);
      ctx.fillRect(
        segmentPos.x * this.cellSize,
        segmentPos.y * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    });
  }
}
