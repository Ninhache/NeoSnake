import { useEffect, useRef, useState } from "react";
import { useEditor } from "../contexts/EditorContext";

type Props = {
  width: number;
  height: number;
};

const WidgetEditableGrid: React.FC<Props> = ({ width, height }) => {
  const { mapData, currentScenario, isDrawing, addObstacle, deleteObstacle } =
    useEditor();
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

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

      mapData.maps[currentScenario].fruits.forEach((fruit) => {
        ctx.fillStyle = "red";
        ctx.fillRect(
          fruit.actualPosition.x * cellSize,
          fruit.actualPosition.y * cellSize,
          cellSize,
          cellSize
        );

        fruit.futurePosition.forEach((futurePosition) => {
          //ctx.fillStyle = "pink"
          ctx.fillStyle = "rgb(255, 193, 203, 0.5)";

          ctx.fillRect(
            futurePosition.x * cellSize,
            futurePosition.y * cellSize,
            cellSize,
            cellSize
          );
        });
      });

      if (currentScenario === 0) {
        const { x, y } = mapData.snake.startPosition;
        ctx.fillStyle = "green";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }, [currentScenario, mapData, cellSize]);

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
      addObstacle({ x, y, type: "OBa" });
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
      addObstacle({ x, y, type: "OBa" });
      setLastPosition({ x, y });
    } else if (dragOperation === "DELETE") {
      deleteObstacle({ x, y });
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
      {isDrawing && (
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
      <canvas
        width={width}
        height={height}
        ref={canvasRef}
        className={`${isDrawing ? "cursor-pointer" : ""}`}
      />
    </div>
  );
};

export default WidgetEditableGrid;
