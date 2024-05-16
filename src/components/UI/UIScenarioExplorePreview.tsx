import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { OnlinePreview } from "../../@types/ApiType";

type Props = {
  scenario: OnlinePreview;
};
const UIScenarioExplorePreview: React.FC<Props> = ({ scenario }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCanvas = (ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    const sizeX =
      (width * scenario.preview.options.cellSize) /
      scenario.preview.options.width;
    const sizeY =
      (height * scenario.preview.options.cellSize) /
      scenario.preview.options.height;

    scenario.preview.fruits.forEach((fruit) => {
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

    scenario.preview.obstacles.forEach((obstacle) => {
      ctx.fillStyle = "black";
      ctx.fillRect(obstacle.x * sizeX, obstacle.y * sizeY, sizeX, sizeY);
    });
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawCanvas(ctx);
  }, [scenario]);

  const navigate = useNavigate();

  return (
    <div
      className={`group border-2 border-opacity-70 p-2 rounded-lg transition-transform border-black bg-gray-800 bg-opacity-60 relative`}
    >
      <NavLink to={`/online/${scenario.id}`}>
        <canvas
          width={150}
          height={150}
          ref={canvasRef}
          className={`border-2 border-transparent`}
        />
      </NavLink>

      <p className="text-center font-bold m-1">
        {scenario.preview.options.name}
      </p>
      <p>{scenario.preview.options.difficulty}</p>
    </div>
  );
};

export default UIScenarioExplorePreview;
