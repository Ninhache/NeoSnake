import React, { useEffect } from "react";
import { useGame } from "../contexts/GameContext";

interface SpeedButtonProps {}

const speeds = [
  {
    text: "Fast",
    value: 10,
  },
  {
    text: "Medium",
    value: 20,
  },
  {
    text: "Slow",
    value: 30,
  },
];

const UISpeedButtons: React.FC<SpeedButtonProps> = ({}) => {
  const { state, dispatch } = useGame();

  useEffect(() => {}, [state.speed]);

  return (
    <div className="w-full flex justify-center">
      {speeds.map(({ text, value }) => (
        <button
          key={value}
          className={`border-2 border-red-500 m-2 rounded-lg p-2 w-24 transition-colors duration-300 ${
            state.speed === value
              ? "bg-red-500 text-white cursor-default"
              : "hover:bg-red-500"
          }`}
          onClick={() => dispatch({ type: "GAME_SET_SPEED", payload: value })}
        >
          {text}
        </button>
      ))}
    </div>
  );
};

export default UISpeedButtons;
