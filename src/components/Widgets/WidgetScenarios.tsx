import React, { useEffect, useRef } from "react";
import { useEditor } from "../contexts/EditorContext";
import { ScenarioMapData } from "../../@types/Scenario";

interface Props {}

const WidgetScenarios: React.FC<Props> = ({}) => {
  const {
    mapData,
    currentScenario,
    setCurrentScenario,
    addScenario,
    deleteScenario,
  } = useEditor();
  interface CanvasRef {
    ctx: CanvasRenderingContext2D | null;
  }

  const canvasRefs = useRef<(CanvasRef | null)[]>([]);

  const drawCanvas = (ctx: CanvasRenderingContext2D, data: ScenarioMapData) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    const sizeX = (width * mapData.options.cellSize) / mapData.options.width;
    const sizeY = (height * mapData.options.cellSize) / mapData.options.height;

    data.fruits.forEach((fruit) => {
      ctx.fillStyle = "red";
      ctx.fillRect(
        fruit.actualPosition.x * sizeX,
        fruit.actualPosition.y * sizeY,
        sizeX,
        sizeY
      );

      fruit.futurePosition.forEach((futurePosition) => {
        ctx.fillStyle = "pink";
        ctx.fillRect(
          futurePosition.x * sizeX,
          futurePosition.y * sizeY,
          sizeX,
          sizeY
        );
      });
    });

    data.obstacles.forEach((obstacle) => {
      ctx.fillStyle = "black";
      ctx.fillRect(obstacle.x * sizeX, obstacle.y * sizeY, sizeX, sizeY);
    });
  };

  useEffect(() => {
    mapData.maps.forEach((map, index) => {
      const canvasRef = canvasRefs.current[index];
      if (canvasRef?.ctx) {
        drawCanvas(canvasRef.ctx, map);
      }
    });
  }, [mapData, canvasRefs]);

  return (
    <>
      <div>Steps</div>
      <div className="flex flex-row gap-2 w-auto">
        {mapData.maps.map((map, index) => (
          <div className="relative group" key={index}>
            <canvas
              className={` w-20 h-20 border-2 hover:border-blue-500 transition-colors ${
                currentScenario === index
                  ? "border-blue-500"
                  : "border-black cursor-pointer"
              }`}
              width={80}
              height={80}
              onClick={() => setCurrentScenario(index)}
              ref={(c) => {
                if (c) {
                  const existingRef = canvasRefs.current[index];
                  if (!existingRef) {
                    canvasRefs.current[index] = { ctx: c.getContext("2d") };
                  } else {
                    if (existingRef.ctx === null) {
                      existingRef.ctx = c.getContext("2d");
                    }
                  }
                  if (existingRef?.ctx) {
                    drawCanvas(existingRef.ctx, map);
                  }
                }
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 absolute top-1 right-1 text-lg font-bold text-black opacity-0 transition-opacity transition-transform group-hover:opacity-70 hover:scale-110 cursor-pointer "
              onClick={() => {
                canvasRefs.current.splice(index, 1);
                deleteScenario(index);
                const newIndex =
                  index <= currentScenario
                    ? currentScenario - 1
                    : currentScenario;

                setCurrentScenario(newIndex);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
            <div className="absolute bottom-0 right-2 text-lg font-bold text-black">
              {index + 1}
            </div>
          </div>
        ))}
        <button
          onClick={() => {
            addScenario();
            setCurrentScenario(mapData.maps.length);
          }}
          className="bg-red-400 w-20 h-20 flex justify-center items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default WidgetScenarios;
