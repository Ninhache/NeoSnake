import { useEffect, useState } from "react";
import { ScenariosName } from "../../@types/ApiType";
import { getPreviewLevels } from "../../lib/level";
import UIScenarioCampaignPreview from "../UI/UIScenarioCampaignPreview";
import UISuspense from "../UI/UISuspense";

type Props = {};
const WidgetCampaignList: React.FC<Props> = ({}) => {
  const [scenariosName, setScenariosName] = useState<ScenariosName[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPreviewLevels()
      .then((response) => {
        if (response.success) {
          setScenariosName(response.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <UISuspense />;
  }

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {scenariosName.length === 0 && (
        <div className="text-center w-full">
          <p>No scenarios found</p>
        </div>
      )}

      {scenariosName.map((scenario) => (
        <UIScenarioCampaignPreview key={scenario.id} scenario={scenario} />
      ))}
    </div>
  );
};

export default WidgetCampaignList;
