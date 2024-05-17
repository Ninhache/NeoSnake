import {useEffect, useRef, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {Preview} from "../../@types/ApiType";
import ConfirmModal from "../UI/UIConfirmModal";
import {deleteCreatedLevel} from "../../lib/level";

type Props = {
  scenario: Preview;
  onDelete: (uuid: string) => void;
};
const UIPersonalLevelPreview: React.FC<Props> = ({
  scenario,
  onDelete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isModalOpen, setModalOpen] = useState(false);

  const handleDelete = () => {
    deleteCreatedLevel(scenario.id).then((response) => {
      if (response.success) {
        onDelete(scenario.id);
      }
    });
    setModalOpen(false);
  };

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
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        itemName={scenario.options.name}
      />
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
          "opacity-0 group-hover:opacity-70 transition-opacity hover:scale-105 absolute bottom-12 right-24 bg-red-600 p-1 rounded-md"
        }
        onClick={(e) => {
          e.stopPropagation();
          setModalOpen(true);
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
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>

      <button
        className={
          "opacity-0 group-hover:opacity-70 transition-opacity hover:scale-105 absolute bottom-12 right-14 bg-green-600 p-1 rounded-md"
        }
        onClick={(e) => {
          e.stopPropagation();
          // force lastPath to be account to redirect here when the user finished to play
          localStorage.setItem("lastPath", "/account");
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

      <button
        className={
          "opacity-0 group-hover:opacity-70 transition-opacity hover:scale-105 absolute bottom-12 right-4 bg-gray-600 rounded-md p-1"
        }
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/create/${scenario.id}`);
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
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>

      <p className="text-center font-bold m-1">{scenario.options.name}</p>
    </div>
  );
};

export default UIPersonalLevelPreview;
