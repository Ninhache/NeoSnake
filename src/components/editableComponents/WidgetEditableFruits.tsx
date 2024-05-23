import { useEffect, useState } from "react";
import { ObstacleColor } from "../../classes/Obstacles";
import ColorModal from "../UI/UIColorModal";
import { DrawingType, useEditor } from "../contexts/EditorContext";
import UIFruits from "./UIFruits";

const WidgetEditableFruits: React.FC = () => {
  const {
    mapData,
    currentScenario,
    addGameFruits,
    setDrawing,
    currentFruitIndex,
    setCurrentFruitIndex,
    isDrawing,
    currentObstacleColor,
    setObstacleColors,
    selectShape,
    shape,
  } = useEditor();

  const [isColorModalOpen, setColorModalOpen] = useState(false);

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

      const keyUpper = key.toLocaleUpperCase();
      if ([`A`, `Z`].includes(keyUpper)) {
        e.preventDefault();
        selectShape(null);
        if (keyUpper === "A") {
          enableDrawing("OBSTACLE");
        } else if (keyUpper === "Z") {
          if (currentFruitIndex === -1) return;
          enableDrawing("FRUIT");
        }
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
    <div
      className="bg-gray-800 bg-opacity-40 overflow-x-hidden flex flex-col justify-between min-w-96 h-full"
      style={{ maxHeight: "420px" }}
    >
      <ColorModal
        isOpen={isColorModalOpen}
        onClose={() => setColorModalOpen(false)}
        onSelectColor={(color: ObstacleColor) => {
          setObstacleColors(color);
          setColorModalOpen(false);
        }}
      />
      <div className="hide-scrollbars flex-grow overflow-x-hidden">
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

      <div
        className={`relative flex justify-center items-center p-2 transition-colors`}
      >
        <button
          className={`group relative border-4 p-6 transition-colors border-transparent`}
          style={{
            backgroundColor: currentObstacleColor,
          }}
          onClick={() => {
            setColorModalOpen(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 absolute -top-2 -right-2 fill-white stroke-black opacity-80 z-10
            group-hover:scale-110 group-hover:opacity-100 group-hover:rotate-90 transition-all"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>

        <button
          className={`group relative flex justify-center items-center border-4 p-6 transition-colors 
          ${
            shape === "CIRCLE"
              ? "border-blue-500 bg-blue-200"
              : "border-transparent bg-white"
          }
          `}
          onClick={() => {
            setDrawing("NONE");
            if (shape === "CIRCLE") {
              selectShape(null);
            } else {
              selectShape("CIRCLE");
            }
          }}
        >
          <div
            className="absolute w-10 h-10 rounded-full border-2"
            style={{
              borderColor: "black",
              backgroundColor: currentObstacleColor,
            }}
          ></div>
        </button>

        <button
          className={`group relative flex justify-center items-center border-4 p-6 transition-colors 
          ${
            shape === "RECTANGLE"
              ? "border-blue-500 bg-blue-200"
              : "border-transparent bg-white"
          }
          `}
          onClick={() => {
            setDrawing("NONE");

            if (shape === "RECTANGLE") {
              selectShape(null);
            } else {
              selectShape("RECTANGLE");
            }
          }}
        >
          <div
            className="absolute border-2 w-10 h-10"
            style={{
              borderColor: "black",
              backgroundColor: currentObstacleColor,
            }}
          ></div>
        </button>

        <button
          className={`group relative flex justify-center items-center border-4 p-6 transition-colors 
          ${
            shape === "LINE"
              ? "border-blue-500 bg-blue-200"
              : "border-transparent bg-white"
          }
          `}
          onClick={() => {
            setDrawing("NONE");

            if (shape === "LINE") {
              selectShape(null);
            } else {
              selectShape("LINE");
            }
          }}
        >
          <div
            className="absolute border-2 w-12 h-2 rotate-45"
            style={{
              borderColor: "black",
              backgroundColor: currentObstacleColor,
            }}
          ></div>
        </button>

        <button
          className={`group relative bg-black border-4 p-6 hover:bg-gray-900 transition-colors ${
            isDrawing === "OBSTACLE"
              ? " border-blue-500 bg-blue-200"
              : "border-transparent bg-white"
          }`}
          style={{
            backgroundColor: currentObstacleColor,
          }}
          onClick={() => {
            selectShape(null);
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
            className="w-6 h-6 absolute -top-1 -right-1 fill-white stroke-black scale-125 opacity-80 group-hover:rotate-12 group-hover:opacity-100 transition-all"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
            />
          </svg>
        </button>

        <button
          className={`relative bg-red-500 border-4 p-6 hover:bg-red-400 transition-colors
          ${currentFruitIndex === -1 && "cursor-not-allowed opacity-50"}
          ${
            isDrawing === "FRUIT"
              ? " border-blue-500 bg-blue-200"
              : "border-transparent"
          }`}
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
          className="relative bg-red-500 border-4 p-6 hover:bg-red-400 transition-colors border-transparent"
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
