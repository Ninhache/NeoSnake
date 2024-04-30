import { Coordinates } from "../@types/CoordinatesType";
import { Nullable } from "../@types/NullableType";
import { SnakeMap, Tile } from "./Map";

export abstract class Entity {
	locationTile: Nullable<Tile>;

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

		return this.getLocationTile().x === entity.getLocationTile().x && this.getLocationTile().y === entity.getLocationTile().y;
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

	constructor(tile: Tile) {
		super(tile);
	}

	abstract effect(): void;
	abstract draw(ctx: CanvasRenderingContext2D): void;

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
		const snakePositions = new Set(map.snake.body.map(segment => `${segment.x},${segment.y}`));
		possiblePositions = possiblePositions.filter(pos => {
			return !snakePositions.has(`${pos.x},${pos.y}`);
		});

		// Randomly pick a position from the remaining valid positions
		const randomIndex = Math.floor(Math.random() * possiblePositions.length);
		const newPos = possiblePositions[randomIndex];

		const newTile = map.getTile({ x: newPos.x, y: newPos.y });

		if (newTile === null) {
			throw new Error(`Invalid tile position for food respawn at ${newPos.x}, ${newPos.y}`);
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
			// this.locationTile = null;
		}
	}

}

export class BasicFood extends Food {

	public effect(): void {
		const map = this.getLocationTile().parent;

		map.snake.growSnake();
		this.respawn(map);
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = "red";
		ctx.fillRect(this.getLocationTile().x * 20, this.getLocationTile().y * 20, 20, 20);
	}
}

abstract class FoodDecorator extends Food {
	protected food: Food;

	constructor(food: Food) {
		super(food.getLocationTile());
		this.food = food;
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		this.food.draw(ctx);
	}

	public effect(): void {
		this.food.effect();
	}
}

export class BigFruit extends FoodDecorator {
	constructor(food: Food) {
		super(food);
	}

	effect(): void {
		const map = this.getLocationTile().parent;
		for (let i = 0; i < 5; i++) {
			map.snake.growSnake();
		}

		this.disappear();
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = "orange";
		ctx.fillRect(this.getLocationTile().x * 20, this.getLocationTile().y * 20, 20, 20);
	}
}

export class DeadlyFruit extends FoodDecorator {
	constructor(food: Food) {
		super(food);
	}

	effect(): void {
		this.getLocationTile().parent.snake.kill();
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = "purple";
		ctx.fillRect(this.getLocationTile().x * 20, this.getLocationTile().y * 20, 20, 20);
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

