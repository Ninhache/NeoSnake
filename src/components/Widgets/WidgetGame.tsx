import GameCanvas from "../GameCanvas";
import UIScoreDisplayer from "../UI/UIScoreDisplayer";
import { GameProvider, useGame } from "../contexts/GameContext";
import LayoutComponent from "../layouts/LayoutComponent";

const WidgetGame: React.FC = () => {
  return (
    <LayoutComponent>
      <GameProvider>
        {/* Display the score and level */}
        <UIScoreDisplayer />
        <GameCanvas width={800} height={800} />
      </GameProvider>
    </LayoutComponent>
  );
};

export default WidgetGame;
