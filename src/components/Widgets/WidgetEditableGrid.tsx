import { useEffect, useState } from "react";
import UIEditableCell from "../UI/UIEditableCell";
import { useEditor } from "../contexts/EditorContext";

type Props = {
  width: number;
  height: number;
};

const WidgetEditableGrid: React.FC<Props> = ({ width, height }) => {
  const { mapData, addGameObject, deleteGameObject, currentGameObjectType } =
    useEditor();
  const { cellSize } = mapData.options;
  const numCols = width / cellSize;
  const numRows = height / cellSize;

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOperation, setDragOperation] = useState<"ADD" | "DELETE" | null>(
    null
  );

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
    x: number,
    y: number
  ) => {
    event.preventDefault();
    setIsDragging(true);

    if (event.button === 0) {
      setDragOperation("ADD");
      addGameObject({ x, y, type: currentGameObjectType });
    } else if (event.button === 2) {
      setDragOperation("DELETE");
      deleteGameObject(x, y);
    }
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (isDragging) {
      if (dragOperation === "ADD") {
        addGameObject({ x, y, type: currentGameObjectType });
      } else if (dragOperation === "DELETE") {
        deleteGameObject(x, y);
      }
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  useEffect(() => {
    const globalMouseUp = (event: MouseEvent) => {
      event.preventDefault();
      handleMouseUp(event);
    };

    if (isDragging) {
      window.addEventListener("mouseup", globalMouseUp);
    } else {
      window.removeEventListener("mouseup", globalMouseUp);
    }

    return () => {
      window.removeEventListener("mouseup", globalMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{ width, height, display: "flex", flexWrap: "wrap" }}
    >
      {Array.from({ length: numRows * numCols }).map((_, index) => {
        const x = index % numCols;
        const y = Math.floor(index / numCols);
        const existingObject = mapData.gameObject.find(
          (obj) => obj.x === x && obj.y === y
        );
        return (
          <UIEditableCell
            key={`${x}-${y}`}
            x={x}
            y={y}
            content={existingObject ? existingObject.type : null}
            onMouseDown={(e) => handleMouseDown(e, x, y)}
            onMouseEnter={() => handleMouseEnter(x, y)}
          />
        );
      })}
    </div>
  );
};

export default WidgetEditableGrid;
