import { useEffect, useState } from "react";
import { useEditor } from "../contexts/EditorContext";

type DifficultyButtonProps = {
  difficulty: number;
  toggle: boolean;
  onClick: () => void;
};
const DifficultyButton: React.FC<DifficultyButtonProps> = ({
  difficulty,
  toggle,
  onClick,
}) => {
  return (
    <button
      className={` border-2  text-white font-bold py-2 px-4 rounded transition-colors ${
        toggle
          ? "border-gray-500 bg-gray-500 bg-opacity-20"
          : " border-transparent bg-gray-800 hover:bg-gray-700"
      }`}
      onClick={onClick}
    >
      {difficulty}
    </button>
  );
};

const DifficultyHandler: React.FC = () => {
  const { mapData, setMapData } = useEditor();
  const [difficulty, setDifficulty] = useState<number>(
    mapData.options.difficulty
  );

  useEffect(() => {
    setMapData({
      ...mapData,
      options: {
        ...mapData.options,
        difficulty: difficulty,
      },
    });
  }, [difficulty]);

  return (
    <div className="flex items-center justify-center gap-2">
      <h1 className="align-middle font-bold">Difficulty</h1>
      <div className="flex gap-2">
        {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
          <DifficultyButton
            key={i}
            difficulty={i}
            toggle={difficulty === i}
            onClick={() => {
              setDifficulty(i);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DifficultyHandler;
