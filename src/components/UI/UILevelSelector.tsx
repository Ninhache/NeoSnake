import { useCallback, useEffect } from "react";
import { useGame } from "../contexts/GameContext";

type Props = {
  levelId: number;
  disabled: boolean;
};

const UILevelSelector: React.FC<Props> = ({ levelId, disabled }) => {
  const { state, dispatch } = useGame();

  const handleClick = useCallback(() => {
    dispatch({ type: "GAME_SET_LEVEL", payload: levelId });
  }, [dispatch, levelId]);

  useEffect(() => {}, [state.level]);

  return (
    <button
      disabled={disabled}
      className={`border-2 border-red-400 h-12 w-12 m-2 rounded-lg ${
        state.level === levelId ? "bg-red-500" : ""
      }
      ${disabled ? "opacity-50" : ""}
      `}
      onClick={handleClick}
    >
      {levelId}
    </button>
  );
};

export default UILevelSelector;
