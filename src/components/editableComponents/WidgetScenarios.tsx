import React, { useEffect, useRef, useState } from "react";
import { useEditor } from "../contexts/EditorContext";
import { ScenarioMapData } from "../../@types/Scenario";
import ConfirmModal from "../UI/UIConfirmModal";

interface Props {}
const WidgetScenarios: React.FC<Props> = ({}) => {
  const {
    mapData,
    currentScenario,
    setCurrentScenario,
    addScenario,
    deleteScenario,
    duplicateScenario,
  } = useEditor();
  interface CanvasRef {
    ctx: CanvasRenderingContext2D | null;
  }

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<number>(0);
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
    canvasRefs.current = canvasRefs.current.slice(0, mapData.maps.length);
    mapData.maps.forEach((_, index) => {
      if (!canvasRefs.current[index]) {
        canvasRefs.current[index] = null;
      }
    });
  }, [mapData.maps.length]);

  useEffect(() => {
    mapData.maps.forEach((map, index) => {
      const canvasRef = canvasRefs.current[index];
      if (canvasRef?.ctx) {
        drawCanvas(canvasRef.ctx, map);
      }
    });
  }, [mapData, canvasRefs]);

  useEffect(() => {
    mapData.maps.forEach((map, index) => {
      const canvasRef = canvasRefs.current[index];
      if (canvasRef?.ctx) {
        drawCanvas(canvasRef.ctx, map);
      }
    });
  }, [mapData, canvasRefs]);

  const handleCanvasSetup = (
    canvas: HTMLCanvasElement | null,
    index: number
  ) => {
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // @ts-ignore
        canvasRefs.current[index] = ctx;
        drawCanvas(ctx, mapData.maps[index]);
      }
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={() => {
          deleteScenario(toDelete);
          canvasRefs.current.splice(toDelete, 1);
          mapData.maps.forEach((map, idx) => {
            const canvasRef = canvasRefs.current[idx];
            if (canvasRef?.ctx) {
              drawCanvas(canvasRef.ctx, map);
            }
          });
          const newIndex =
            toDelete <= currentScenario ? currentScenario - 1 : currentScenario;

          setCurrentScenario(newIndex);
          setModalOpen(false);
        }}
        onClose={() => setModalOpen(false)}
        itemName={`Scenario ${toDelete + 1}`}
      />
      <div>Steps</div>
      <div className="flex flex-row gap-2 w-auto">
        {mapData.maps.map((_, index) => (
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
              ref={(el) => handleCanvasSetup(el, index)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 absolute top-1 right-1 text-lg font-bold text-black opacity-0 transition-opacity transition-transform group-hover:opacity-70 hover:scale-110 cursor-pointer"
              onClick={() => {
                duplicateScenario(index);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
              />
            </svg>

            {mapData.maps.length > 1 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 absolute top-1 right-6 text-lg font-bold text-black opacity-0 transition-opacity transition-transform group-hover:opacity-70 hover:scale-110 cursor-pointer stroke-red-800
                "
                onClick={() => {
                  setToDelete(index);
                  setModalOpen(true);
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            )}
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
