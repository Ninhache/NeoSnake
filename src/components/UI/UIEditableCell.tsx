import { useEffect } from "react";
import { gameObjectType, getColorFromType } from "../../@types/MapTypes";
import { Nullable } from "../../@types/NullableType";
import { useEditor } from "../contexts/EditorContext";

interface Props {
  x: number;
  y: number;
  onMouseDown: (
    event: React.MouseEvent<HTMLDivElement>,
    x: number,
    y: number
  ) => void;
  onMouseEnter: (x: number, y: number) => void;
  content: Nullable<gameObjectType>;
}

const UIEditableCell: React.FC<Props> = ({
  x,
  y,
  onMouseDown,
  onMouseEnter,
  content,
}) => {
  const { mapData } = useEditor();

  useEffect(() => {}, [mapData.options.cellSize, mapData.snake.startPosition]);

  const isSnakeHead =
    mapData.snake.startPosition.x === x && mapData.snake.startPosition.y === y;

  return (
    <div
      style={{
        width: `${mapData.options.cellSize}px`,
        height: `${mapData.options.cellSize}px`,
        position: "relative",
      }}
      onMouseDown={(e) => onMouseDown(e, x, y)}
      onMouseEnter={() => onMouseEnter(x, y)}
    >
      <div
        style={{
          backgroundColor: isSnakeHead ? "green" : getColorFromType(content),
        }}
        className="absolute top-0 left-0 right-0 bottom-0"
      ></div>
      <div className="absolute top-0 left-0 right-0 bottom-0 hover:bg-black hover:bg-opacity-25"></div>
    </div>
  );
};

export default UIEditableCell;
