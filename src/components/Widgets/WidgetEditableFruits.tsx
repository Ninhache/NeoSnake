import { useEffect, useState } from "react";
import UIFruits from "../UI/UIFruits";
import { useEditor } from "../contexts/EditorContext";

type Props = {};
const WidgetEditableFruits: React.FC<Props> = ({}) => {
  const {
    mapData,
    currentScenario,
    addGameFruits,
    addFutureFruitPositions,
    setDrawing,
    isDrawing,
  } = useEditor();
  const [openedIndex, setOpenedIndex] = useState<number>(0);

  useEffect(() => {}, [mapData.maps[currentScenario].fruits]);

  return (
    <div className="bg-gray-800 bg-opacity-40 h-4/6 overflow-y-scroll overflow-x-hidden flex flex-col justify-between min-w-96">
      <div className="flex-grow overflow-y-auto overflow-x-hidden">
        {mapData.maps[currentScenario].fruits.map((fruit, index) => (
          <UIFruits
            index={index}
            key={index}
            fruit={fruit}
            isOpen={openedIndex === index}
            onClick={() => {
              setOpenedIndex((prev) => (prev === index ? -1 : index));
            }}
            deleteFruit={(delIndex) => {
              const newIndex =
                delIndex <= openedIndex ? openedIndex - 1 : openedIndex;

              setOpenedIndex(newIndex);
            }}
          />
        ))}
      </div>
      <div className="flex gap-2 justify-center">
        <button
          className={`bg-red-500 border-2 p-2 hover:bg-red-400 transition-colors ${
            isDrawing ? " border-blue-500" : "border-transparent"
          }`}
          onClick={() => {
            setDrawing((prev) => !prev);
          }}
        >
          Draw Obstacles {isDrawing ? "on" : "off"}
        </button>
        <button
          className={`bg-red-500 p-2 border-2 border-transparent hover:bg-red-400 transition-colors transition-opacity ${
            openedIndex === -1 && "cursor-not-allowed opacity-50"
          }`}
          disabled={openedIndex === -1}
          onClick={() => {
            addFutureFruitPositions(openedIndex, { x: 5, y: 5 });
          }}
        >
          Add future position
        </button>
        <button
          className="bg-red-500 p-2 hover:bg-red-400 transition-colors"
          onClick={() => {
            addGameFruits({ x: 5, y: 5, type: "FBa" });
            setOpenedIndex(mapData.maps[currentScenario].fruits.length);
          }}
        >
          Add fruit
        </button>
      </div>
    </div>
  );
};

export default WidgetEditableFruits;
