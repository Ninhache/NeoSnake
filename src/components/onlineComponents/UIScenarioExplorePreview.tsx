import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { OnlinePreview } from "../../@types/ApiType";
import { duplicateToCampaign } from "../../lib/services/level";
import { timestampToChrono } from "../../lib/time";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  scenario: OnlinePreview;
};
const UIScenarioExplorePreview: React.FC<Props> = ({ scenario }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { isAuthenticated, isAdmin } = useAuth();

  const drawCanvas = (ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    const sizeX = (width * scenario.options.cellSize) / scenario.options.width;
    const sizeY =
      (height * scenario.options.cellSize) / scenario.options.height;

    scenario.fruits.forEach((fruit) => {
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

    scenario.obstacles.forEach((obstacle) => {
      ctx.fillStyle = obstacle.color;
      ctx.fillRect(obstacle.x * sizeX, obstacle.y * sizeY, sizeX, sizeY);
    });
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawCanvas(ctx);
  }, [scenario]);

  let completionTime = "Not Attempted";
  if (!isAuthenticated()) {
    const time = localStorage.getItem(`online_${scenario.id}`);
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
      <NavLink to={`/online/${scenario.id}`} className={"relative"}>
        <canvas
          width={150}
          height={150}
          ref={canvasRef}
          className={`border-2 border-transparent`}
        />
        {isAdmin() && (
          <div
            className="absolute top-36 left-0 border-2 bg-red-500"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              duplicateToCampaign(scenario.id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 scale-110"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
        )}
      </NavLink>
      <p className="text-center font-bold m-1">{scenario.options.name}</p>
      <div className="flex justify-end gap-1 text-gray-500">
        By{" "}
        <NavLink
          className="font-bold text-white hover:scale-110 transition-transform duration-150"
          to={`/profile/${scenario.creatorName}`}
        >
          {scenario.creatorName}
        </NavLink>
      </div>
      <p className="text-gray-500 italic text-right">
        Difficulty {scenario.options.difficulty}
      </p>
      {scenario.completed ? (
        <div>
          <h1 className="text-gray-400 text-sm text-right">
            <p className="text-white font-bold">{completionTime}</p>
          </h1>
        </div>
      ) : (
        <h1 className="italic text-gray-400 text-center">Not Attempted Yet</h1>
      )}
    </div>
  );
};

export default UIScenarioExplorePreview;
