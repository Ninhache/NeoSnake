import React, { useEffect, useRef, useState } from "react";
import { Coordinates } from "../../@types/CoordinatesType";
import { Nullable } from "../../@types/NullableType";
import { isVisible } from "../../lib/visible";
import { useEditor } from "../contexts/EditorContext";

type Props = {
  width: number;
  height: number;
};

const WidgetEditableGrid: React.FC<Props> = ({ width, height }) => {
  const {
    currentScenario,
    currentFruitIndex,
    currentObstacleColor,
    isDrawing,
    mapData,
    shape,
    addObstacle,
    deleteObstacle,
    addFutureFruitPositions,
    deleteFutureFruitPositionsByCoordinates,
  } = useEditor();

  const [isDragging, setIsDragging] = useState(false);
  const [dragOperation, setDragOperation] =
    useState<Nullable<"ADD" | "DELETE">>(null);
  const [lastPosition, setLastPosition] = useState({
    x: -1,
    y: -1,
  });

  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  const { cellSize } = mapData.options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  const [startPos, setStartPos] = useState({ x: -1, y: -1 });
  const [endPos, setEndPos] = useState({ x: -1, y: -1 });

  function bresenhamsLineAlgorithm(
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ) {
    let points = [];
    let dx = Math.abs(x1 - x0);
    let sx = x0 < x1 ? 1 : -1;
    let dy = -Math.abs(y1 - y0);
    let sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    let e2;

    while (true) {
      points.push({ x: x0, y: y0 });
      if (x0 === x1 && y0 === y1) break;
      e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
    return points;
  }

  function generateCirclePoints(
    cx: number,
    cy: number,
    radius: number
  ): Coordinates[] {
    let points: Coordinates[] = [];
    let x: number = radius;
    let y: number = 0;
    let p: number = 1 - radius;

    addCirclePoints(points, cx, cy, x, y);

    while (x > y) {
      y++;
      if (p <= 0) {
        p = p + 2 * y + 1;
      } else {
        x--;
        p = p + 2 * y - 2 * x + 1;
      }
      addCirclePoints(points, cx, cy, x, y);
    }

    return points;
  }

  function addCirclePoints(
    points: Coordinates[],
    cx: number,
    cy: number,
    x: number,
    y: number
  ): void {
    points.push({ x: cx + x, y: cy + y });
    points.push({ x: cx - x, y: cy + y });
    points.push({ x: cx + x, y: cy - y });
    points.push({ x: cx - x, y: cy - y });
    points.push({ x: cx + y, y: cy + x });
    points.push({ x: cx - y, y: cy + x });
    points.push({ x: cx + y, y: cy - x });
    points.push({ x: cx - y, y: cy - x });
  }

  function rectangleAlgorithm(x0: number, y0: number, x1: number, y1: number) {
    const xMin = Math.min(x0, x1);
    const xMax = Math.max(x0, x1);
    const yMin = Math.min(y0, y1);
    const yMax = Math.max(y0, y1);

    let points = [];
    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        points.push({ x, y });
      }
    }

    return points;
  }

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
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(
          obstacle.x * cellSize,
          obstacle.y * cellSize,
          cellSize,
          cellSize
        );
      });

      if (currentScenario - 1 >= 0) {
        mapData.maps[currentScenario - 1].obstacles.forEach((obstacle) => {
          ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
          ctx.fillRect(
            obstacle.x * cellSize,
            obstacle.y * cellSize,
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
            ctx.lineWidth = 1;
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
      ctx.lineWidth = 1;
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

      if (startPos.x === -1 && startPos.y === -1) return;

      if (shape === "LINE") {
        setPoints(
          bresenhamsLineAlgorithm(startPos.x, startPos.y, endPos.x, endPos.y)
        );
      } else if (shape === "RECTANGLE") {
        setPoints(
          rectangleAlgorithm(startPos.x, startPos.y, endPos.x, endPos.y)
        );
      } else if (shape === "CIRCLE") {
        setPoints(
          generateCirclePoints(
            startPos.x,
            startPos.y,
            Math.max(
              Math.abs(startPos.x - endPos.x),
              Math.abs(startPos.y - endPos.y)
            )
          )
        );
      }

      points.forEach((point) => {
        ctx.fillStyle = currentObstacleColor;
        ctx.fillRect(
          point.x * cellSize,
          point.y * cellSize,
          cellSize,
          cellSize
        );

        ctx.strokeStyle = dragOperation === "ADD" ? "lime" : "red";
        if (shape !== "RECTANGLE") {
          ctx.lineWidth = 2;
          ctx.strokeRect(
            point.x * cellSize,
            point.y * cellSize,
            cellSize,
            cellSize
          );
        }
      });

      if (shape === "RECTANGLE") {
        const startX = Math.min(startPos.x, endPos.x) * cellSize;
        const startY = Math.min(startPos.y, endPos.y) * cellSize;
        const width = Math.abs(endPos.x - startPos.x) * cellSize;
        const height = Math.abs(endPos.y - startPos.y) * cellSize;

        const adjustedWidth =
          startPos.x === endPos.x ? cellSize : width + cellSize;
        const adjustedHeight =
          startPos.y === endPos.y ? cellSize : height + cellSize;

        ctx.lineWidth = 5;
        ctx.strokeRect(startX, startY, adjustedWidth, adjustedHeight);
      }
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

      if (shape !== null) {
        setStartPos({ x, y });
        setEndPos({ x, y });
      } else if (isDrawing === "OBSTACLE") {
        addObstacle({ x, y });
      } else if (isDrawing === "FRUIT") {
        addFutureFruitPositions(currentFruitIndex, { x, y });
      }
      setLastPosition({ x, y });
    } else if (event.button === 2) {
      setDragOperation("DELETE");

      if (shape !== null) {
        setStartPos({ x, y });
        setEndPos({ x, y });
      } else if (isDrawing === "OBSTACLE") {
        deleteObstacle({ x, y });
      }
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

    if (shape !== null) {
      setEndPos({ x, y });
    } else {
      if (dragOperation === "ADD") {
        if (isDrawing === "OBSTACLE") {
          addObstacle({ x, y });
        } else if (isDrawing === "FRUIT") {
          addFutureFruitPositions(currentFruitIndex, { x, y });
        }

        setLastPosition({ x, y });
      } else if (dragOperation === "DELETE") {
        if (isDrawing === "OBSTACLE") {
          deleteObstacle({ x, y });
        } else if (isDrawing === "FRUIT") {
          deleteFutureFruitPositionsByCoordinates(currentFruitIndex, {
            x,
            y,
          });
        }
        setLastPosition({ x, y });
      }
    }
  };

  const handleMouseUp = () => {
    if (dragOperation === "ADD") {
      points.forEach((point) => {
        if (
          point.x >= 0 &&
          point.y >= 0 &&
          point.x < width / cellSize &&
          point.y < height / cellSize
        )
          addObstacle(point);
      });
    } else {
      points.forEach((point) => {
        if (
          point.x >= 0 &&
          point.y >= 0 &&
          point.x < width / cellSize &&
          point.y < height / cellSize
        )
          deleteObstacle(point);
      });
    }

    clearStates();
  };

  const clearStates = () => {
    setIsDragging(false);
    setDragOperation(null);
    setPoints([]);
    setStartPos({ x: -1, y: -1 });
    setEndPos({ x: -1, y: -1 });
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onMouseLeave={() => {
        clearStates();
      }}
      style={{ position: "relative" }}
    >
      {(isDrawing !== "NONE" || shape !== null) && (
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
