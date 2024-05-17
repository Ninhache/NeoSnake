import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { ScenariosName } from "../../@types/ApiType";
import { timestampToChrono } from "../../lib/time";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  scenario: ScenariosName;
};
const UICampaignPreview: React.FC<Props> = ({ scenario }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { username } = useAuth();

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

  let completionTime = "Not Attempted";
  if (!username) {
    const time = localStorage.getItem(`campaign_${scenario.id}`);
    if (time) {
      completionTime = timestampToChrono(parseInt(time, 10));
      scenario.completed = true;
    }
  } else {
    if (scenario.completionTime) {
      completionTime = timestampToChrono(
        new Date(scenario.completionTime).getTime()
      );
    }
  }

  return (
    <div
      className={`border-2 border-opacity-70 p-4   rounded-lg hover:scale-105 transition-transform ${
        scenario.completed
          ? "border-amber-400 bg-amber-300 bg-opacity-10 "
          : "border-black bg-gray-800 bg-opacity-60"
      }`}
    >
      <NavLink to={`/campaign/${scenario.id}`}>
        <canvas
          width={150}
          height={150}
          ref={canvasRef}
          className={`border-2 ${
            scenario.completed ? "border-amber-400" : "border-transparent"
          } `}
        />

        <p className="text-center font-bold m-1">
          {scenario.preview.options.name}
        </p>

        {scenario.completed ? (
          <div>
            <h1 className="text-gray-400 text-sm text-right">
              <p className="text-white font-bold">{completionTime}</p>
            </h1>
          </div>
        ) : (
          <h1 className="italic text-gray-400 text-center">Not Attempted</h1>
        )}
      </NavLink>
    </div>
  );
};

export default UICampaignPreview;
