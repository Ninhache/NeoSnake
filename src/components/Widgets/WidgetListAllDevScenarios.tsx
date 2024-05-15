import { useEffect, useState } from "react";
import { getPreviewLevels } from "../../lib/level";
import UISuspense from "../UI/UISuspense";
import { ScenariosName } from "../../@types/ApiType";
import UIScenarioPreview from "../UI/UIScenarioPreview";

type Props = {};
const WidgetListAllDevScenarios: React.FC<Props> = ({}) => {
  const [scenariosName, setScenariosName] = useState<ScenariosName[]>([]);

  useEffect(() => {
    getPreviewLevels().then((response) => {
      console.log("gaga", response);
      if (response.success) {
        setScenariosName(response.data);
      }
    });
  }, []);

  if (scenariosName.length === 0) {
    return <UISuspense />;
  }

  return (
    <div className="flex">
      {scenariosName.map((scenario) => (
        <UIScenarioPreview key={scenario.id} scenario={scenario} />
      ))}
    </div>
  );
};

export default WidgetListAllDevScenarios;
