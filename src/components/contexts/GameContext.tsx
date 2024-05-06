import React, { createContext, useContext, useReducer } from "react";
import { Food } from "../../classes/Entity";
import { saveLevelProgress } from "../../lib/localstorage";

interface GameState {
  score: number;
  level: number;
  name: string;
}

type GameAction =
  | { type: "GAME_EAT_FRUIT"; fruit: Food }
  | { type: "GAME_NEXT_LEVEL" }
  | { type: "GAME_SET_LEVEL"; payload: number }
  | { type: "GAME_SET_NAME"; payload: string }
  | { type: "GAME_LOOSE" };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "GAME_EAT_FRUIT":
      return {
        ...state,
        score: state.score + action.fruit.getValue(),
      };
    case "GAME_NEXT_LEVEL":
      saveLevelProgress(state.level + 1);
      return {
        ...state,
        score: 0,
        level: state.level + 1,
      };
    case "GAME_LOOSE":
      return {
        ...state,
        score: 0,
      };
    case "GAME_LOOSE":
      return {
        ...state,
        score: 0,
      };
    case "GAME_SET_LEVEL":
      return {
        ...state,
        level: action.payload,
      };
    case "GAME_SET_NAME":
      return {
        ...state,
        name: action.payload,
      };
    default:
      console.warn("Action not handled:", action);
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({ state: { score: 0, level: 1, name: "NO_NAME" }, dispatch: () => null });

type Props = {
  children: React.ReactNode;
};

const GameProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, {
    score: 0,
    level: 1,
    name: "NO_NAME",
  });

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

const useGame = () => useContext(GameContext);

export { GameProvider, useGame };
