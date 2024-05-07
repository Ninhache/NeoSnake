import { gameObjectType } from "../../@types/MapTypes";
import UIEntitySelector from "../UI/UIEntitySelector";

const WidgetToolSelector: React.FC = () => {
  const gameObjectDescriptions: Record<gameObjectType, string> = {
    FBa: "Food Basic",
    FBi: "Food Bonus",
    FDe: "Food Deadly",
    OBa: "Basic Obstacle",
    ODi: "Different Obstacle",
  };

  // 1 * 0.25rem ~~ 1 * 4px
  const gapSize = 1;

  // 6 items per row
  const numItems = 6;

  const itemWidth = `calc((100% - ${
    (numItems - 1) * gapSize
  }rem) / ${numItems})`;

  return (
    <div className="flex py-1 gap-2 flex-wrap justify-center">
      {Object.entries(gameObjectDescriptions).map(([type, description]) => (
        <UIEntitySelector
          key={type}
          type={type as gameObjectType}
          style={{ width: itemWidth }}
        >
          {description}
        </UIEntitySelector>
      ))}
    </div>
  );
};

export default WidgetToolSelector;
