import { useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { Direction } from "../../@types/DirectionType";
import { Nullable } from "../../@types/NullableType";
import { ScenarioData, ScenarioFruit } from "../../@types/Scenario";
import { SnakeMap } from "../../classes/Map";
import {
  getCreatedLevelById,
  uploadOnlineCompletion,
} from "../../lib/services/level";

import { timestampToChrono } from "../../lib/time";
import UISuspense from "../UI/UISuspense";
import { useAuth } from "../contexts/AuthContext";
import { useGame } from "../contexts/GameContext";
import { isVisible } from "../../lib/visible";

type Props = {
  width: number;
  height: number;
};

const OnlineCanvas: React.FC<Props> = ({ width, height }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  if (!id) {
    navigate("/explore");
  }

  const { state, dispatch } = useGame();
  const stateRef = useRef(state);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [json, setJson] = useState<Nullable<ScenarioData>>(null);
  const [finalTime, setFinalTime] = useState<number>(-1);
  const [resetToggle, setResetToggle] = useState<boolean>(false);
  const { username } = useAuth();
  const [playState, setPlayState] = useState<"PLAYING" | "PAUSED" | "STOPPED">(
    "PAUSED"
  );
  const playStateRef = useRef(playState);

  useEffect(() => {
    const restartGame = (event: KeyboardEvent) => {
      if (event.key === "r" || event.key === "R") {
        dispatch({ type: "GAME_RESET" });
        setResetToggle((prev) => !prev);
      }
    };

    window.addEventListener("keydown", restartGame);
    return () => {
      window.removeEventListener("keydown", restartGame);
    };
  }, []);

  useEffect(() => {
    playStateRef.current = playState;
  }, [playState]);

  if (!id) {
    throw new Error("Missing id in params");
  }

  useEffect(() => {
    getCreatedLevelById(id).then((response) => {
      if (response.success) {
        setJson(JSON.parse(response.data.map_data));
      } else {
        throw new Error("Error fetching level");
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

    ctx.fillStyle = "rgba(100, 255, 100, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw the time at center
    ctx.font = "30px Arial";
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

    if (username) {
      uploadOnlineCompletion(id, finalTime).then(() => {
        ctx.fillText(
          `Time saved...`,
          canvas.width / 2,
          canvas.height / 2 + 100
        );
      });
    } else {
      // save to the local storage instead
      localStorage.setItem(`online_${id}`, `${finalTime}`);
    }

    const handlePressEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        navigate(localStorage.getItem("lastPath") || "/explore");
      }
    };

    addEventListener("keydown", handlePressEscape);

    return () => {
      removeEventListener("keydown", handlePressEscape);
    };
  }, [finalTime, username, id]);

  useEffect(() => {
    if (json === null) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let scenario = new SnakeMap(JSON.stringify(json));

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

    const draw = (ctx: CanvasRenderingContext2D, frameNumber: number) => {
      scenario.draw(ctx, (frameNumber % state.speed) / state.speed);
    };

    if (ctx && canvas) {
      let frameCount = 0;
      let animationFrameId: number;

      window.addEventListener("keydown", handleKeyPress);
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

          if (!snakeHasMoved) {
            scoreMap = 0;
            totalScore = 0;
            scenario.reset();
            dispatch({ type: "GAME_RESET" });
            setResetToggle((prev) => !prev);
          }
        }

        draw(ctx, frameCount);
      };
      setPlayState("PLAYING");
      render();

      return () => {
        window.cancelAnimationFrame(animationFrameId),
          window.removeEventListener("keydown", handleKeyPress);
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
        {/* {import.meta.env.DEV && jsonState === "ERROR" && (
          <UINotification type="error" className="mb-4">
            *DEV* Check if the API is running
          </UINotification>
        )} */}
        <UISuspense />
      </div>
    );
  }

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default OnlineCanvas;
