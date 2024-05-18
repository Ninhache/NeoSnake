import { useEffect, useRef } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { OnlinePreview } from "../../@types/ApiType";
import { timestampToChrono } from "../../lib/time";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  scenario: OnlinePreview;
};
const UIProfileLevelPreview: React.FC<Props> = ({ scenario }) => {
  const { username } = useParams();
  const { isAuthenticated } = useAuth();

  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const navigate = useNavigate();

  let completionTime = "Not Attempted";
  if (!isAuthenticated()) {
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
      className={`group border-2 border-opacity-70 p-4 rounded-lg hover:scale-105 transition-transform ${
        scenario.completed
          ? "border-amber-400 bg-amber-300 bg-opacity-10 "
          : "border-black bg-gray-800 bg-opacity-60"
      }`}
    >
      <NavLink to={`/online/${scenario.id}`}>
        <canvas
          width={150}
          height={150}
          ref={canvasRef}
          className={`border-2 border-transparent`}
        />
      </NavLink>

      <button
        className={
          "absolute opacity-0 group-hover:opacity-70 transition-opacity hover:scale-105 right-6 bg-green-600 p-1 rounded-md"
        }
        style={{ bottom: "100px" }}
        onClick={(e) => {
          e.stopPropagation();
          // force lastPath to be /profile to redirect here when the user finished to play
          localStorage.setItem("lastPath", `/profile/${username}`);
          navigate(`/online/${scenario.id}`);
        }}
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
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
          />
        </svg>
      </button>

      <p className="text-center font-bold m-1">{scenario.options.name}</p>
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

export default UIProfileLevelPreview;
