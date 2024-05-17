import { useEffect } from "react";
import UINotification from "../UI/UINotification";
import { useAuth } from "../contexts/AuthContext";
import { GameProvider } from "../contexts/GameContext";
import LayoutComponent from "../layouts/LayoutComponent";
import WidgetCampaignList from "./WidgetCampaignList";

const PageCampaignExplorer: React.FC = () => {
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

        <h1 className="text-3xl text-center font-bold my-8">Campaign</h1>
        <div className="border-2 mx-16 mb-8 border-opacity-45 border-gray-500"></div>

        <WidgetCampaignList />
      </GameProvider>
    </LayoutComponent>
  );
};

export default PageCampaignExplorer;
