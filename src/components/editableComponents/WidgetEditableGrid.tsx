import { useEffect, useRef, useState } from "react";
import { isVisible } from "../../lib/visible";
import { useEditor } from "../contexts/EditorContext";

type Props = {
  width: number;
  height: number;
};

const WidgetEditableGrid: React.FC<Props> = ({ width, height }) => {
  const {
    mapData,
    currentScenario,
    isDrawing,
    addObstacle,
    deleteObstacle,
    addFutureFruitPositions,
    currentFruitIndex,

    deleteFutureFruitPositionsByCoordinates,
  } = useEditor();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOperation, setDragOperation] = useState<"ADD" | "DELETE" | null>(
    null
  );
  const [lastPosition, setLastPosition] = useState({
    x: -1,
    y: -1,
  });

  const { cellSize } = mapData.options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  // const currentFruitIndexRef = useRef(currentFruitIndex);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;
    if (!isVisible(canvas)) {
      canvas.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    canvas.focus();

    if (ctx && canvas) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);

      mapData.maps[currentScenario].obstacles.forEach((obstacle) => {
        ctx.fillStyle = "black";
        ctx.fillRect(
          obstacle.x * cellSize,
          obstacle.y * cellSize,
          cellSize,
          cellSize
        );
      });

      if (currentScenario - 1 >= 0) {
        mapData.maps[currentScenario - 1].obstacles.forEach((fruit) => {
          ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
          ctx.fillRect(
            fruit.x * cellSize,
            fruit.y * cellSize,
            cellSize,
            cellSize
          );
        });
      }

      mapData.maps[currentScenario].fruits.forEach((fruit, index) => {
        ctx.fillStyle = "red";
        ctx.fillRect(
          fruit.actualPosition.x * cellSize,
          fruit.actualPosition.y * cellSize,
          cellSize,
          cellSize
        );

        fruit.futurePosition.forEach((futurePosition) => {
          ctx.fillStyle = "rgb(255, 193, 203, 0.5)";

          ctx.fillRect(
            futurePosition.x * cellSize,
            futurePosition.y * cellSize,
            cellSize,
            cellSize
          );

          if (currentFruitIndex === index) {
            ctx.strokeStyle = "black";
            ctx.strokeRect(
              futurePosition.x * cellSize,
              futurePosition.y * cellSize,
              cellSize,
              cellSize
            );
          }
        });
      });

      if (currentScenario === 0) {
        const { x, y } = mapData.snake.startPosition;
        ctx.fillStyle = "green";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }, [currentScenario, mapData, cellSize, currentFruitIndex]);

  const drawOverlay = (x: number, y: number) => {
    const ctx = overlayRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

      ctx.strokeStyle = "black";
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    setIsDragging(true);

    if (event.button === 0) {
      setDragOperation("ADD");

      if (isDrawing === "OBSTACLE") {
        addObstacle({ x, y, type: "OBa" });
      } else if (isDrawing === "FRUIT") {
        addFutureFruitPositions(currentFruitIndex, { x, y });
      }

      setLastPosition({ x, y });
    } else if (event.button === 2) {
      setDragOperation("DELETE");
      deleteObstacle({ x, y });
    }
    event.preventDefault();
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);

    if (x < 0 || x >= width / cellSize || y < 0 || y >= height / cellSize) {
      setIsDragging(false);
      return;
    }

    drawOverlay(x, y);
    if (!isDragging) return;
    if (x === lastPosition.x && y === lastPosition.y) return;

    if (dragOperation === "ADD") {
      if (isDrawing === "OBSTACLE") {
        addObstacle({ x, y, type: "OBa" });
      } else if (isDrawing === "FRUIT") {
        addFutureFruitPositions(currentFruitIndex, { x, y });
      }

      setLastPosition({ x, y });
    } else if (dragOperation === "DELETE") {
      if (isDrawing === "OBSTACLE") {
        deleteObstacle({ x, y });
      } else if (isDrawing === "FRUIT") {
        deleteFutureFruitPositionsByCoordinates(currentFruitIndex, { x, y });
      }
      setLastPosition({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOperation(null);
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onMouseLeave={() => {
        setIsDragging(false);
        setDragOperation(null);
      }}
      style={{ position: "relative" }}
    >
      {isDrawing !== "NONE" && (
        <canvas
          width={width}
          height={height}
          ref={overlayRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="absolute top-0 left-0"
        />
      )}
      <canvas width={width} height={height} ref={canvasRef} />
    </div>
  );
};

export default WidgetEditableGrid;
