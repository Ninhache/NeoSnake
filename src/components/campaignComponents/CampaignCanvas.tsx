import { useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { Direction } from "../../@types/DirectionType";
import { Nullable } from "../../@types/NullableType";

import {
  getCampaignLevel,
  uploadCampaignCompletion,
} from "../../lib/services/level";

import { NavLink } from "react-router-dom";
import { CampaignScenario } from "../../@types/scenario/Campaign";
import {
  CampaignScenarioData,
  ScenarioFruit,
} from "../../@types/scenario/Scenario";
import { timestampToChrono } from "../../lib/time";
import { isVisible } from "../../lib/visible";
import UISuspense from "../UI/UISuspense";
import { useGame } from "../contexts/GameContext";

type Props = {
  width: number;
  height: number;
};

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
  "Enter",
];
let konamiCodePosition = 0;

const CampaignCanvas: React.FC<Props> = ({ width, height }) => {
  const { state, dispatch } = useGame();
  const stateRef = useRef(state);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [json, setJson] = useState<Nullable<CampaignScenarioData>>(null);
  const [finalTime, setFinalTime] = useState<number>(-1);
  const [playState, setPlayState] = useState<"PLAYING" | "PAUSED" | "STOPPED">(
    "PAUSED"
  );
  const [resetToggle, setResetToggle] = useState<boolean>(false);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const [nextId, setNextId] = useState<Nullable<number>>(null);

  useEffect(() => {
    const restartGame = (event: KeyboardEvent) => {
      if (event.key.toLocaleLowerCase() === "r") {
        dispatch({ type: "GAME_RESET" });
        setNextId(null);
        setResetToggle((prev) => !prev);
      }
    };

    window.addEventListener("keydown", restartGame);
    return () => {
      window.removeEventListener("keydown", restartGame);
    };
  }, []);

  const playStateRef = useRef(playState);
  useEffect(() => {
    playStateRef.current = playState;
  }, [playState]);

  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    throw new Error("Missing id in params");
  }

  useEffect(() => {
    getCampaignLevel(id).then((response) => {
      if (response.success) {
        setJson(response.data);
      }
    });
  }, [id]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (finalTime === -1) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      throw new Error("Canvas not found");
    }

    ctx.fillStyle = "rgba(100, 255, 100, 0.50)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw the time at center
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(
      `You won in ${timestampToChrono(finalTime)}`,
      canvas.width / 2,
      canvas.height / 2
    );

    ctx.fillText(
      `Press ESC to go back to the menu`,
      canvas.width / 2,
      canvas.height / 2 + 50
    );

    uploadCampaignCompletion(id, finalTime).then((res) => {
      ctx.fillText(`Time saved...`, canvas.width / 2, canvas.height / 2 + 100);

      if (res.nextId >= 0) {
        setNextId(res.nextId);
      }

      buttonRef.current?.focus();
    });

    const handlePressEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        navigate("/play");
      }
    };

    addEventListener("keydown", handlePressEscape);

    return () => {
      removeEventListener("keydown", handlePressEscape);
    };
  }, [finalTime, id]);

  useEffect(() => {
    if (json === null) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let scenario = new CampaignScenario(JSON.stringify(json));

    dispatch({ type: "GAME_SET_NAME", payload: json.options.name });

    const snake = scenario.snake;
    let scoreMap = 0;
    let totalScore = 0;

    if (!canvas || !ctx) return;

    if (!isVisible(canvas)) {
      canvas.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    canvas.focus();

    const handleKeyPress = (event: KeyboardEvent) => {
      if (import.meta.env.DEV) {
        if (event.key.toLocaleLowerCase() === "p") {
          scoreMap = scenario.scoreNeeded();
          totalScore = scenario.scoreToWin();
        }
      }

      // Keep all the events unless they are arrow keys
      if (
        !["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(event.key)
      )
        return;
      event.preventDefault();
      const { key } = event;

      switch (key) {
        case "ArrowUp":
          snake.enqueueDirection(Direction.Up);
          break;
        case "ArrowDown":
          snake.enqueueDirection(Direction.Down);
          break;
        case "ArrowLeft":
          snake.enqueueDirection(Direction.Left);
          break;
        case "ArrowRight":
          snake.enqueueDirection(Direction.Right);
          break;
      }
    };

    const konamiCode = (event: KeyboardEvent) => {
      const { key } = event;
      if (KONAMI_CODE.includes(key)) {
        if (key === KONAMI_CODE[konamiCodePosition]) {
          konamiCodePosition++;
          if (konamiCodePosition === KONAMI_CODE.length) {
            window.switchSecretMode();
            konamiCodePosition = 0;
          }
        } else {
          konamiCodePosition = 0;
        }
      } else {
        konamiCodePosition = 0;
      }
    };

    const draw = (ctx: CanvasRenderingContext2D, frameNumber: number) => {
      scenario.draw(ctx, (frameNumber % state.speed) / state.speed);
    };

    if (ctx && canvas) {
      let frameCount = 0;
      let animationFrameId: number;

      window.addEventListener("keydown", handleKeyPress);
      window.addEventListener("keydown", konamiCode);
      const startTime = performance.now();
      const render = () => {
        if (playStateRef.current === "STOPPED") return;
        if (playStateRef.current === "PAUSED") {
          animationFrameId = window.requestAnimationFrame(render);
          return;
        }

        frameCount++;
        animationFrameId = window.requestAnimationFrame(render);

        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (frameCount % state.speed === 0) {
          let snakeHasMoved = snake.processMovement(scenario);

          if (!snakeHasMoved) {
            scoreMap = 0;
            totalScore = 0;
            scenario.reset();
            dispatch({ type: "GAME_RESET" });
            setResetToggle((prev) => !prev);
          }

          const tile = scenario.getTile(snake.head);
          if (tile) {
            if (tile.data instanceof ScenarioFruit) {
              dispatch({ type: "GAME_EAT_FRUIT", fruit: tile.data });
              snake.eat(tile.data);
              scoreMap++;
              totalScore++;
            }
          }

          if (scoreMap >= scenario.scoreNeeded()) {
            if (totalScore >= scenario.scoreToWin()) {
              const winTime = performance.now();
              setFinalTime(winTime - startTime);
              setPlayState("STOPPED");
            } else {
              scoreMap = 0;
              scenario.next();
            }
          }
        }

        draw(ctx, frameCount);
      };
      setPlayState("PLAYING");
      render();

      return () => {
        window.cancelAnimationFrame(animationFrameId),
          window.removeEventListener("keydown", handleKeyPress),
          window.removeEventListener("keydown", konamiCode);
      };
    }
  }, [json, state.speed, resetToggle]);

  if (json === null) {
    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          minWidth: `${width}px`,
          minHeight: `${height}px`,
        }}
        className="mr-4"
      >
        <UISuspense />
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <canvas ref={canvasRef} width={width} height={height} />

        <div
          className={`absolute flex gap-16 justify-center w-full transition-opacity duration-300 ease-out
          ${nextId === null ? "opacity-0" : "opacity-100"}
          `}
          style={{
            bottom: "25%",
          }}
        >
          <NavLink
            to={"/"}
            className="flex justify-center p-5 bg-gray-500 text-white w-24 rounded-lg"
          >
            Menu
          </NavLink>
          <NavLink
            to={nextId && nextId > 0 ? `/campaign/${nextId}` : "/congrats"}
            className="flex justify-center p-5 bg-green-900 font-bold text-white w-24 rounded-lg"
            ref={buttonRef}
            onClick={() => {
              setNextId(null);
              dispatch({ type: "GAME_RESET" });
              setResetToggle((prev) => !prev);
              setFinalTime(-1);
            }}
          >
            Next
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default CampaignCanvas;
