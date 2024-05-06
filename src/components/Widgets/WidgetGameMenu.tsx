import UISpeedButtons from "../UI/UISpeedButtons";
import { useGame } from "../contexts/GameContext";
import DEVCacheButtons from "../devComponents/DEVCacheButtons";
import WidgetListOfLevel from "./WidgetListOfLevel";

type Props = {};
const WidgetGameMenu: React.FC<Props> = ({}) => {
  const { state } = useGame();

  return (
    <div className="border-2 w-full flex flex-col justify-between">
      <div>
        <h1 className="text-center text-2xl">{state.name}</h1>

        <h1>Score : {state.score}</h1>
        <h1>Level : {state.level}</h1>

        <br></br>

        <UISpeedButtons />

        <WidgetListOfLevel />
      </div>

      <DEVCacheButtons />
    </div>
  );
};

export default WidgetGameMenu;
