import { useEffect } from "react";
import GameCanvas from "../GameCanvas";
import { useAuth } from "../contexts/AuthContext";
import { GameProvider } from "../contexts/GameContext";
import LayoutComponent from "../layouts/LayoutComponent";
import WidgetGameMenu from "./WidgetGameMenu";
import { useNavigate, useParams } from "react-router-dom";

const WidgetGame: React.FC = () => {
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
          <GameCanvas width={800} height={800} />
          <WidgetGameMenu />
        </div>
      </GameProvider>
    </LayoutComponent>
  );
};

export default WidgetGame;
