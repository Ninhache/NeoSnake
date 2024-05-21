import { BaseScenarioData, Scenario } from "./Scenario";

export class OnlineScenario extends Scenario<BaseScenarioData> {
  constructor(serializedMap: string) {
    super(serializedMap);
  }
}
