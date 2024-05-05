import React, { createContext, useContext, useReducer } from "react";
import { Food } from "../../classes/Entity";

interface GameState {
  score: number;
  level: number;
  fruitsCollected: number;
}

type GameAction =
  | { type: "GAME_EAT_FRUIT"; fruit: Food }
  | { type: "GAME_NEXT_LEVEL" };

function gameReducer(state: GameState, action: GameAction): GameState {
  console.log(state, action);
  switch (action.type) {
    case "GAME_EAT_FRUIT":
      return {
        ...state,
        score: state.score + action.fruit.getValue(),
        fruitsCollected: state.fruitsCollected + 1,
      };
    case "GAME_NEXT_LEVEL":
      return {
        ...state,
        level: state.level + 1,
        fruitsCollected: 0,
      };
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({ state: { score: 0, level: 1, fruitsCollected: 0 }, dispatch: () => null });

type Props = {
  children: React.ReactNode;
};

const GameProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, {
    score: 0,
    level: 1,
    fruitsCollected: 0,
  });

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

const useGame = () => useContext(GameContext);

export { GameProvider, useGame };
