import UIColorfulText from "../UI/UIColorfulText";
import UISpeedButtons from "../UI/UISpeedButtons";
import { useGame } from "../contexts/GameContext";

const WidgetGameMenu: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="w-full flex flex-col justify-between bg-gray-900 bg-opacity-30 ml-4 rounded-lg">
      <div>
        <h1 className="text-center text-2xl my-4">{state.name}</h1>

        <div className="border-2 mx-16 my-4 border-opacity-45 border-gray-500"></div>

        <div className="flex justify-center gap-4">
          <h1>Level : {state.level}</h1>
          <h1>Score : {state.score} </h1>
        </div>

        <div className="border-2 mx-16 my-4 border-opacity-45 border-gray-500"></div>

        <p className="text-center text-lg font-bold text-gray-400">
          How to play ?
        </p>

        <ul className="m-4 text-justify text-gray-500">
          <li>- Use the arrow keys to move the snake.</li>
          <li>
            - Eat all the visible food to grow and avoid hitting the walls or
            yourself.
          </li>
          <li>- Once you eat all the food, you will move to the next level.</li>
          <li>- The game will end once you complete all the levels.</li>
        </ul>

        <div className="border-2 mx-16 my-4 border-opacity-45 border-gray-500"></div>

        <p className="text-center text-lg font-bold text-gray-400">
          Additional Controls
        </p>

        <p className="m-4 text-justify text-gray-500">
          Press R to restart the game.
        </p>

        <div className="border-2 mx-16 my-4 border-opacity-45 border-gray-500"></div>

        {window.secretMode && <UIColorfulText text="Secret Mode Activated" />}
      </div>
      <UISpeedButtons />
    </div>
  );
};

export default WidgetGameMenu;
