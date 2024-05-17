import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import OnlineCanvas from "./OnlineCanvas";
import {useAuth} from "../contexts/AuthContext";
import {GameProvider} from "../contexts/GameContext";
import LayoutComponent from "../layouts/LayoutComponent";
import WidgetGameMenu from "../Widgets/WidgetGameMenu";

const WidgetOnline: React.FC = () => {
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
          <OnlineCanvas width={800} height={800} />
          <WidgetGameMenu />
        </div>
      </GameProvider>
    </LayoutComponent>
  );
};

export default WidgetOnline;
