import { NavLink } from "react-router-dom";
import UIColorfulText from "../UI/UIColorfulText";
import UISpeedButtons from "../UI/UISpeedButtons";
import { useGame } from "../contexts/GameContext";

const WidgetGameMenu: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="relative w-full flex flex-col justify-between bg-gray-900 bg-opacity-30 ml-4 rounded-lg">
      <NavLink
        to="/article/how-to-play-neosnake"
        className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-400 opacity-40 hover:opacity-100 transition duration-300 ease-in-out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 scale-150 fill-gray-200 stroke-gray-700"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
          />
        </svg>
      </NavLink>

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
