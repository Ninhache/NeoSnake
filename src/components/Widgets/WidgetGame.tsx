import GameCanvas from "../GameCanvas";
import { GameProvider } from "../contexts/GameContext";
import LayoutComponent from "../layouts/LayoutComponent";
import WidgetGameMenu from "./WidgetGameMenu";

const WidgetGame: React.FC = () => {
  return (
    <LayoutComponent>
      <GameProvider>
        <div className="flex w-full">
          <GameCanvas width={800} height={800} />
          <div className="flex flex-row w-full">
            <WidgetGameMenu />
          </div>
        </div>
      </GameProvider>
    </LayoutComponent>
  );
};

export default WidgetGame;
