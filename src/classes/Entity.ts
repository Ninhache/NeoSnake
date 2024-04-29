import { Coordinates } from "../@types/CoordinatesType";
import { Nullable } from "../@types/NullableType";
import { Direction } from "../enums";

export class Sprite {
    src: String;

    constructor(src: String) {
        this.src = src;
    }
}

export abstract class Entity {
    sprite: Nullable<Sprite>;
    coordinates: Coordinates;

    constructor(sprite: Nullable<Sprite>, coordinates: Coordinates) {
        this.sprite = sprite;
        this.coordinates = coordinates;
    }

    getCoordinates(): Coordinates {
        return this.coordinates;
    }

    isColliding(entity: Entity): boolean {
        return this.coordinates.x === entity.coordinates.x && this.coordinates.y === entity.coordinates.y;
    }

    public abstract draw(ctx: CanvasRenderingContext2D): void;

}

export class Obstacles extends Entity {
    constructor(sprite: Sprite, coordinates: Coordinates) {
        super(sprite, coordinates);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "black";
        ctx.fillRect(this.coordinates.x * 20, this.coordinates.y * 20, 20, 20);
    }
}



export abstract class Food extends Entity {


    constructor(sprite: Nullable<Sprite>, coordinates: Coordinates) {
        super(sprite, coordinates);
    }

    abstract effect(snake: Snake, gameWidth: number, gameHeight: number): void;
    abstract draw(ctx: CanvasRenderingContext2D): void;

    /**
     * Respawn the food at a random location on the screen, but not on the snake's body
     * 
     * @param snake the snake is provided to prevent the food from spawning on the snake's body
     */
    public respawn(snake: Snake, gameWidth: number, gameHeight: number): void {
        let possiblePositions = [];
        for (let i = 0; i < gameWidth; i++) {
            for (let j = 0; j < gameHeight; j++) {
                possiblePositions.push({ x: i, y: j });
            }
        }

        // Remove positions that are occupied by the snake
        const snakePositions = new Set(snake.body.map(segment => `${segment.x},${segment.y}`));
        possiblePositions = possiblePositions.filter(pos => {
            return !snakePositions.has(`${pos.x},${pos.y}`);
        });

        // Randomly pick a position from the remaining valid positions
        const randomIndex = Math.floor(Math.random() * possiblePositions.length);
        const newPos = possiblePositions[randomIndex];

        // Update food position
        this.coordinates = newPos;
    }



}

export class BasicFood extends Food {

    public effect(snake: Snake, gameWidth: number, gameHeight: number): void {
        this.respawn(snake, gameWidth, gameHeight);
        snake.growSnake();
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "red";
        ctx.fillRect(this.coordinates.x * 20, this.coordinates.y * 20, 20, 20);
    }
}

abstract class FoodDecorator extends Food {
    protected food: Food;

    constructor(food: Food) {
        super(null, food.coordinates);
        this.food = food;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.food.draw(ctx);
    }

    public effect(snake: Snake, gameWidth: number, gameHeight: number): void {
        this.food.effect(snake, gameWidth, gameHeight);
    }
}

export class BigFruit extends FoodDecorator {
    constructor(food: Food) {
        super(food);
    }

    effect(snake: Snake): void {
        for (let i = 0; i < 5; i++) {
            snake.growSnake();
        }
        this.coordinates = { x: -1, y: -1 };
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "orange";
        ctx.fillRect(this.coordinates.x * 20, this.coordinates.y * 20, 20, 20);
    }
}

export class DeadlyFruit extends FoodDecorator {
    constructor(food: Food) {
        super(food);
    }

    effect(snake: Snake): void {
        snake.kill();
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "purple";
        ctx.fillRect(this.coordinates.x * 20, this.coordinates.y * 20, 20, 20);
    }
}


class SnakeSegment {
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

export class Snake extends Entity {

    head: SnakeSegment;
    body: SnakeSegment[];
    directionQueue: Direction[] = [];
    currentDirection: Direction;
    // speed: number; // ?
    // grow: boolean = false;
    hasToDie: boolean = false;


    constructor(sprite: Nullable<Sprite>, coordinates: Coordinates) {
        super(sprite, coordinates);
        this.head = new SnakeSegment(coordinates);
        this.body = [
            new SnakeSegment({ x: coordinates.x - 1, y: coordinates.y }),
            new SnakeSegment({ x: coordinates.x - 2, y: coordinates.y }),
            new SnakeSegment({ x: coordinates.x - 3, y: coordinates.y })
        ];
        this.currentDirection = Direction.Right;
    }

    public eat(food: Food, gameWidth: number, gameHeight: number): void {
        food.effect(this, gameWidth, gameHeight);
    }

    public growSnake(): void {
        const current = this.body[this.body.length - 1].current;
        this.body.push(new SnakeSegment({ x: current.x, y: current.y }));
    }

    public enqueueDirection(newDirection: Direction) {
        if (this.directionQueue.length < 2) {
            const lastDirection = this.directionQueue.length > 0 ? this.directionQueue[this.directionQueue.length - 1] : this.currentDirection;
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

    public move(gameWidth: number, gameHeight: number): boolean {

        if (this.directionQueue.length > 0) {
            this.currentDirection = this.directionQueue.shift()!;
        }

        if (this.hasToDie) {
            return false;
        }

        const newHead: Coordinates = {
            x: this.head.target.x,
            y: this.head.target.y
        };

        switch (this.currentDirection) {
            case Direction.Up: newHead.y -= 1; break;
            case Direction.Down: newHead.y += 1; break;
            case Direction.Left: newHead.x -= 1; break;
            case Direction.Right: newHead.x += 1; break;
        }

        if (this.isLeavingTheScreen(newHead, gameWidth, gameHeight) || this.isCollidingWithSelf(newHead)) {
            return false;
        }

        this.head.updatePosition(newHead.x, newHead.y);        
        this.body[0].updatePosition(this.head.current.x, this.head.current.y);
        for (let i = 0; i < this.body.length - 1; i++) {
            this.body[i + 1].updatePosition(this.body[i].current.x, this.body[i].current.y);
        }

        this.directionQueue = [];

        return true;
    }

    public isCollidingWithSelf(newHead: Coordinates): boolean {
        return this.body.slice(0, -1).some(segment => segment.x === newHead.x && segment.y === newHead.y);
    }

    public isLeavingTheScreen(newHead: Coordinates, gameWidth: number, gameHeight: number): boolean {
        return newHead.x < 0 || newHead.x >= gameWidth || newHead.y < 0 || newHead.y >= gameHeight;
    }


    /**
     * Used to calculate the color in the draw method, the goal is to make the snake darker as it gets further from the head
     * 
     * @param i the index of the segment
     * @param length the length of the snake
     * @returns a number between 0x40 and 0xA0
     */
    private calculateColor(i: number, length: number): number {
        return Math.floor(0xA0 - (i * 0xA0 / length)) + 0x40;
    }

    private interpolate(current: Coordinates, target: Coordinates, alpha: number): Coordinates {
        
        return {
            x: current.x + (target.x - current.x) * alpha,
            y: current.y + (target.y - current.y) * alpha
        };
    }

    public draw(ctx: CanvasRenderingContext2D, alpha: number = 0): void {

        ctx.fillStyle = '#00D000';

        let headPos = this.interpolate(this.head.current, this.head.target, alpha);
        ctx.fillRect(headPos.x * 20, headPos.y * 20, 20, 20);

        this.body.forEach((segment, i) => {
            ctx.fillStyle = `rgb(0,${this.calculateColor(i, this.body.length)},0)`;
            let segmentPos = this.interpolate(segment.current, segment.target, alpha);
            ctx.fillRect(segmentPos.x * 20, segmentPos.y * 20, 20, 20);
        });

    }



}