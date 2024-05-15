import { useEffect, useRef, useState } from "react";

import { Direction } from "../@types/DirectionType";
import { Nullable } from "../@types/NullableType";
import {
  ScenarioData,
  ScenarioFruit,
  exampleScenario,
} from "../@types/Scenario";
import { SnakeMap } from "../classes/Map";
import UISuspense from "./UI/UISuspense";
import { useGame } from "./contexts/GameContext";

type Props = {
  width: number;
  height: number;
};

const GameCanvas: React.FC<Props> = ({ width, height }) => {
  const { state, dispatch } = useGame();
  const stateRef = useRef(state);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [json, setJson] = useState<Nullable<ScenarioData>>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    setJson(exampleScenario);
  }, []);

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

      const render = () => {
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

          console.log(scenario.scoreNeeded(), scoreMap);
          if (scoreMap >= scenario.scoreNeeded()) {
            scoreMap = 0;
            scenario.next();

            if (totalScore >= scenario.scoreToWin()) {
              dispatch({ type: "GAME_WIN" });
            }
          }

          if (!snakeHasMoved) {
            scenario.reset();
            dispatch({ type: "GAME_LOOSE" });
          }
        }

        draw(ctx, frameCount);
      };

      render();

      return () => {
        window.cancelAnimationFrame(animationFrameId),
          window.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [json, state.speed]);

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

export default GameCanvas;
