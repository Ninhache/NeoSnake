import { useEffect } from "react";
import UIFruits from "./UIFruits";
import { DrawingType, useEditor } from "../contexts/EditorContext";

type Props = {};
const WidgetEditableFruits: React.FC<Props> = ({}) => {
  const {
    mapData,
    currentScenario,
    addGameFruits,
    setDrawing,
    currentFruitIndex,
    setCurrentFruitIndex,
    isDrawing,
  } = useEditor();

  const enableDrawing = (type: DrawingType) => {
    if (isDrawing === type) {
      setDrawing("NONE");
    } else {
      setDrawing(type);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;

      const upperCaseKey = key.toLocaleUpperCase();
      if (upperCaseKey === "A") {
        enableDrawing("OBSTACLE");
      } else if (upperCaseKey === "Z") {
        if (currentFruitIndex === -1) return;
        enableDrawing("FRUIT");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawing]);

  useEffect(() => {
    if (isDrawing === "FRUIT" && currentFruitIndex === -1) {
      setDrawing("NONE");
    }
  }, [currentFruitIndex]);

  useEffect(() => {}, [mapData.maps[currentScenario].fruits]);

  return (
    <div className="bg-gray-800 bg-opacity-40 h-4/6 overflow-y-scroll overflow-x-hidden flex flex-col justify-between min-w-96">
      <div className="flex-grow overflow-y-auto overflow-x-hidden">
        {mapData.maps[currentScenario].fruits.map((fruit, index) => (
          <UIFruits
            index={index}
            key={index}
            fruit={fruit}
            isOpen={currentFruitIndex === index}
            onClick={() => {
              setCurrentFruitIndex((prev) => (prev === index ? -1 : index));
            }}
            deleteFruit={(delIndex) => {
              const newIndex =
                delIndex <= currentFruitIndex
                  ? currentFruitIndex - 1
                  : currentFruitIndex;

              setCurrentFruitIndex(newIndex);
            }}
          />
        ))}
      </div>
      <div className="flex gap-2 justify-center py-2">
        <button
          className={`relative  bg-black border-2 p-6 hover:bg-gray-900 transition-colors ${
            isDrawing === "OBSTACLE" ? " border-blue-500" : "border-transparent"
          }`}
          onClick={() => {
            enableDrawing("OBSTACLE");
          }}
        >
          <p className="absolute bottom-0 left-1 white stroke-black font-bold text-2xl">
            A
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 absolute -top-1 -right-1 stroke-gray-400 scale-125"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
            />
          </svg>
        </button>

        <button
          className={`relative bg-red-500 border-2 p-6 hover:bg-red-400 transition-colors
          ${currentFruitIndex === -1 && "cursor-not-allowed opacity-50"}
          ${isDrawing === "FRUIT" ? " border-blue-500" : "border-transparent"}`}
          disabled={currentFruitIndex === -1}
          onClick={() => {
            enableDrawing("FRUIT");
          }}
        >
          <p className="absolute bottom-0 left-1 white stroke-black font-bold text-2xl">
            Z
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 absolute -top-2 -right-2 stroke-white scale-125"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>

        <div className="border-l-2 border-gray-700 m-2"></div>

        <button
          className="relative bg-red-500 border-2 p-6 hover:bg-red-400 transition-colors border-transparent"
          onClick={() => {
            addGameFruits({ x: 5, y: 5, type: "FBa" });
            setCurrentFruitIndex(mapData.maps[currentScenario].fruits.length);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="w-6 h-6 absolute -top-2 -right-2 stroke-green-500 scale-150"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WidgetEditableFruits;
