import { clearCache, godCache } from "../../lib/localstorage";
import { useGame } from "../contexts/GameContext";
import WidgetListOfLevel from "./WidgetListOfLevel";

type Props = {};
const WidgetGameMenu: React.FC<Props> = ({}) => {
  const { state } = useGame();

  return (
    <div className="border-2 w-full">
      <h1>Score : {state.score}</h1>
      <h1>Level : {state.level}</h1>
      <h1>Name : {state.name}</h1>
      <button className="bg-red-500 p-2 m-1" onClick={() => clearCache()}>
        Clear Cache
      </button>

      <button className="bg-red-500 p-2 m-1" onClick={() => godCache()}>
        "God" Mode
      </button>

      <WidgetListOfLevel />
    </div>
  );
};

export default WidgetGameMenu;
