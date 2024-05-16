import { useEffect, useState } from "react";
import { getCreatedLevels } from "../../lib/level";
import UIScenarioExplorePreview from "../UI/UIScenarioExplorePreview";
import LayoutComponent from "../layouts/LayoutComponent";
import { OnlinePreview } from "../../@types/ApiType";

type Props = {};
const WidgetExplore: React.FC<Props> = ({}) => {
  const [levels, setLevels] = useState<OnlinePreview[]>([]);

  useEffect(() => {
    getCreatedLevels().then((response) => {
      if (response.success) {
        setLevels(response.data);
      }
    });
  }, []);

  return (
    <LayoutComponent>
      <h1 className="text-3xl text-center font-bold">Explore</h1>
      <div className="flex flex-wrap gap-2">
        {levels.map((level) => (
          <UIScenarioExplorePreview key={level.id} scenario={level} />
        ))}
      </div>
    </LayoutComponent>
  );
};

export default WidgetExplore;
