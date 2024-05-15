import { useEffect } from "react";
import UINotification from "../UI/UINotification";
import { useAuth } from "../contexts/AuthContext";
import { GameProvider } from "../contexts/GameContext";
import LayoutComponent from "../layouts/LayoutComponent";
import WidgetListAllDevScenarios from "./WidgetListAllDevScenarios";

const WidgetCampaignExplorer: React.FC = () => {
  const { username } = useAuth();

  useEffect(() => {}, [username]);

  return (
    <LayoutComponent>
      <GameProvider>
        <div className="flex w-full justify-center">
          {!username && (
            <UINotification type="warning">
              Without being logged in, your progress will be saved locally.
            </UINotification>
          )}
        </div>

        <h1 className=" m-4 text-3xl text-center">
          Scenario's created by devs
        </h1>

        <WidgetListAllDevScenarios />
      </GameProvider>
    </LayoutComponent>
  );
};

export default WidgetCampaignExplorer;
