import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CampaignCanvas from "./CampaignCanvas";
import { useAuth } from "../contexts/AuthContext";
import { GameProvider } from "../contexts/GameContext";
import LayoutComponent from "../layouts/LayoutComponent";
import WidgetGameMenu from "../Widgets/WidgetGameMenu";

const PageCampaign: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    navigate("/play");
  }

  const { username } = useAuth();
  useEffect(() => {}, [username]);

  return (
    <LayoutComponent>
      <GameProvider>
        <div className="flex w-full justify-center">
          <CampaignCanvas width={800} height={800} />
          <WidgetGameMenu />
        </div>
      </GameProvider>
    </LayoutComponent>
  );
};

export default PageCampaign;
