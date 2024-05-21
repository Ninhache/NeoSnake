import { Coordinates } from "../@types/CoordinatesType";
import { Nullable } from "../@types/NullableType";
import { OnlineScenario } from "../@types/scenario/Online";
import { BaseScenarioData, Scenario } from "../@types/scenario/Scenario";

import { Entity } from "./Entity";

export class Tile {
  parent: Scenario<BaseScenarioData>;
  coordinates: Coordinates;
  private _data: Nullable<Entity>;

  constructor(
    parent: OnlineScenario,
    coordinates: Coordinates,
    data: Nullable<Entity> = null
  ) {
    this.parent = parent;
    this.coordinates = coordinates;
    this._data = data;
  }

  get data(): Nullable<Entity> {
    return this._data;
  }

  set data(data: Nullable<Entity>) {
    this._data = data;
  }

  get x(): number {
    return this.coordinates.x;
  }

  get y(): number {
    return this.coordinates.y;
  }

  set x(x: number) {
    this.coordinates.x = x;
  }

  set y(y: number) {
    this.coordinates.y = y;
  }

  /**
   * Occupy the tile with an entity
   * @param entity
   */
  occupy(entity: Entity): void {
    this._data = entity;
  }

  /**
   * Vacate the tile
   */
  vacate(): void {
    this._data = null;
  }

  /**
   * Check if the tile is occupied
   * @returns
   */
  isOccupied(): boolean {
    return this._data !== null;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this._data !== null) {
      this._data.draw(ctx);
    }
  }
}

export class TextMap {
  x: number;
  y: number;
  content: string;

  constructor(x: number, y: number, content: string) {
    this.x = x;
    this.y = y;
    this.content = content;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(`${this.content}`, this.x, this.y);
  }
}

export class MapSerializer {
  static serialize(map: any): string {
    return JSON.stringify(map);
  }

  static deserialize(jsonString: string): BaseScenarioData {
    return JSON.parse(jsonString);
  }
}
