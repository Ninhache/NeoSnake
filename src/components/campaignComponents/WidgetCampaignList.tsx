import { useEffect, useState } from "react";
import { ScenariosName } from "../../@types/ApiType";
import { getCampaignPreviewLevels } from "../../lib/services/level.ts";
import UICampaignPreview from "./UICampaignPreview.tsx";
import UISuspense from "../UI/UISuspense";
import { useAuth } from "../contexts/AuthContext.tsx";
import WidgetDisconnectedOverlay from "../Widgets/WidgetDisconnectedOverlay.tsx";
import { NavLink } from "react-router-dom";

const WidgetCampaignList: React.FC = ({}) => {
  const [scenariosName, setScenariosName] = useState<ScenariosName[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    getCampaignPreviewLevels()
      .then((response) => {
        if (response.success) {
          setScenariosName(response.data);
          setTotalItems(response.totalItems);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <UISuspense />;
  }

  const levelUntilTheEnd = totalItems - scenariosName.length;
  const completedScenarios = scenariosName.filter(
    (scenario) => scenario.completed
  );

  return (
    <>
      <div className="relative flex gap-2 flex-col flex-wrap justify-center">
        {scenariosName.length === 0 && (
          <div className="text-center w-full text-gray-500 italic">
            <p>No scenarios found</p>
          </div>
        )}

        <div className="flex justify-center gap-4 flex-wrap">
          {scenariosName.map((scenario) => (
            <UICampaignPreview key={scenario.id} scenario={scenario} />
          ))}
        </div>

        <div className="text-center mt-4 ">
          {levelUntilTheEnd > 0 ? (
            <>
              <p className="text-gray-500 italic">
                There's {levelUntilTheEnd} more scenario
                {levelUntilTheEnd > 1 && "s"} to unlock
              </p>
              <div className="my-8">
                <NavLink
                  to="https://www.google.com/search?q=contrat+de+travail+exemple+pdf"
                  target="_blank"
                  className="bg-gray-900 bg-opacity-40 p-4 rounded-lg hover:bg-opacity-70 transition-colors
                  "
                >
                  If your company's name is <b>Pit</b>, you can click here to
                  complete <b>ALL</b> the scenarios
                </NavLink>
              </div>
            </>
          ) : (
            completedScenarios.length === totalItems && (
              <NavLink to="/congrats">
                <p className="text-xl text-amber-500 italic font-bold hover:scale-105 transition-transform duration-150 ease-out">
                  You've completed all the scenarios!
                </p>
              </NavLink>
            )
          )}
        </div>

        {!isAuthenticated() && <WidgetDisconnectedOverlay />}
      </div>
    </>
  );
};

export default WidgetCampaignList;
