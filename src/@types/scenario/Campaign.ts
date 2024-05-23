import { TextMap } from "../../classes/Map";
import {
  BaseScenarioMapData,
  CampaignScenarioData,
  Scenario,
} from "./Scenario";

export class CampaignScenario extends Scenario<CampaignScenarioData> {
  text: TextMap[];
  constructor(serializedMap: string) {
    super(serializedMap);
    this.text = [];
    this.loadMap(this.jsonObj.maps[this.indexCurrentMap]);
  }

  public loadMap(mapData: BaseScenarioMapData): void {
    super.loadMap(mapData);

    this.text = [];
    this.jsonObj.maps[this.indexCurrentMap].texts.forEach((text) => {
      const { x, y, content } = text;
      this.text.push(new TextMap(x, y, content));
    });
  }

  public draw(ctx: CanvasRenderingContext2D, alpha: number = 0): void {
    super.draw(ctx, alpha);

    this.text.forEach((text) => {
      text.draw(ctx);
    });
  }
}
