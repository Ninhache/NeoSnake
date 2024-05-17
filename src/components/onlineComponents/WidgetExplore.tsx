import { useEffect, useState } from "react";
import { getOnlineCreatedLevels } from "../../lib/level";
import UIScenarioExplorePreview from "./UIScenarioExplorePreview";
import LayoutComponent from "../layouts/LayoutComponent";
import { OnlinePreview } from "../../@types/ApiType";

type Props = {};
const WidgetExplore: React.FC<Props> = ({}) => {
  const [levels, setLevels] = useState<OnlinePreview[]>([]);

  useEffect(() => {
    getOnlineCreatedLevels().then((response) => {
      if (response.success) {
        setLevels(response.data);
      }
    });
  }, []);

  return (
    <LayoutComponent>
      <h1 className="text-3xl text-center font-bold mb-4">Explore</h1>
      <div className="flex flex-wrap gap-2">
        {levels.length === 0 ? (
          <div className="text-center w-full text-gray-500 italic">
            <p>No levels found</p>
          </div>
        ) : (
          levels.map((level) => (
            <UIScenarioExplorePreview key={level.id} scenario={level} />
          ))
        )}
      </div>
    </LayoutComponent>
  );
};

export default WidgetExplore;
