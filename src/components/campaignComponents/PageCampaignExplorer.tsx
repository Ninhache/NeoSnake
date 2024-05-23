import { useEffect } from "react";
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
        <h1 className="text-3xl text-center font-bold my-8">Campaign</h1>
        <div className="border-2 mx-16 mb-8 border-opacity-45 border-gray-500"></div>

        <WidgetCampaignList />
      </GameProvider>
    </LayoutComponent>
  );
};

export default PageCampaignExplorer;
