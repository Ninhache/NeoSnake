import { useGame } from "../contexts/GameContext";

type Props = {};

const UIScoreDisplayer: React.FC<Props> = ({}) => {
  const { state } = useGame();

  return (
    <>
      <h1>score: {state.score}</h1>
    </>
  );
};

export default UIScoreDisplayer;
