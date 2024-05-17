import { Tile } from "./Map";

export abstract class Entity {
  locationTile: Tile;

  /**
   * @param {@class Tile} tile To instance an entity, a {@Tile} must be provided, Even if further the Tile can be null
   */
  protected constructor(tile: Tile) {
    this.locationTile = tile;
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
