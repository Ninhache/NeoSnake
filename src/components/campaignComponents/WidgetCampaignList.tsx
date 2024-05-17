import {useEffect, useState} from "react";
import {ScenariosName} from "../../@types/ApiType";
import {getCampaignPreviewLevels} from "../../lib/level";
import UICampaignPreview from "./UICampaignPreview.tsx";
import UISuspense from "../UI/UISuspense";

type Props = {};
const WidgetCampaignList: React.FC<Props> = ({}) => {
  const [scenariosName, setScenariosName] = useState<ScenariosName[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCampaignPreviewLevels()
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
        <div className="text-center w-full text-gray-500 italic">
          <p>No scenarios found</p>
        </div>
      )}

      {scenariosName.map((scenario) => (
        <UICampaignPreview key={scenario.id} scenario={scenario} />
      ))}
    </div>
  );
};

export default WidgetCampaignList;
