import { useEffect, useMemo, useRef } from "react";
import { gameObjectType, getColorFromType } from "../../@types/MapTypes";
import { useEditor } from "../contexts/EditorContext";

type Props = {
  type: gameObjectType;
  children: React.ReactNode;
  style: React.CSSProperties;
  className?: string;
};

const UIEntitySelector: React.FC<Props> = ({
  type,
  children,
  style,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setGameObjectType, currentGameObjectType } = useEditor();

  const drawIcon = useMemo(() => {
    return (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, 20, 20);
      ctx.fillStyle = getColorFromType(type);
      ctx.fillRect(0, 0, 20, 20);
    };
  }, [type]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawIcon(ctx);
      }
    }
  }, [drawIcon]);

  return (
    <button
      className={`border-2 flex p-1 items-center rounded-lg
      ${currentGameObjectType === type && "border-red-500"}
      ${className}
      `}
      onClick={() => setGameObjectType(type)}
      style={style}
    >
      <canvas
        ref={canvasRef}
        width="20"
        height="20"
        className="mr-2 border-2"
      ></canvas>
      {children}
    </button>
  );
};

export default UIEntitySelector;
