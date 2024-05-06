import { useEffect, useRef, useState } from "react";

import { Direction } from "../@types/DirectionType";
import { Nullable } from "../@types/NullableType";
import { Food } from "../classes/Entity";
import { SnakeMap } from "../classes/Map";
import UISuspense from "./UI/UISuspense";
import { useGame } from "./contexts/GameContext";
import { SnakeMapType } from "../@types/MapTypes";
import UINotification from "./UI/UINotification";

type Props = {
  width: number;
  height: number;
};

const GameCanvas: React.FC<Props> = ({ width, height }) => {
  const { state, dispatch } = useGame();
  const stateRef = useRef(state);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [json, setJson] = useState<Nullable<JSON>>(null);

  const [jsonState, setJsonState] = useState<SnakeMapType>("LOADING");

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    setJson(null);

    fetch(
      `${import.meta.env.VITE_SNAKE_API_ROUTE}/level/${stateRef.current.level}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load level data");
        }
        return response.json();
      })
      .then((data) => {
        dispatch({ type: "GAME_SET_NAME", payload: data.options.name });
        setJson(data);
        setJsonState("LOADED");
      })
      .catch((error) => {
        setJson(null);
        setJsonState("ERROR");
        console.error("Failed to load level data", error);
      });
  }, [state.level]);

  useEffect(() => {
    if (json === null) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let map = new SnakeMap(JSON.stringify(json));
    const snake = map.snake;

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
      map.draw(ctx, (frameNumber % state.speed) / state.speed);
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

        // No magic numbers.. I've to put that in a constant or in the JSON object
        if (stateRef.current.score >= 10) {
          dispatch({ type: "GAME_NEXT_LEVEL" });
        }

        if (frameCount % state.speed === 0) {
          let snakeHasMoved = snake.processMovement(map);

          const tile = map.getTile(snake.head);
          if (tile) {
            if (tile.data instanceof Food) {
              dispatch({ type: "GAME_EAT_FRUIT", fruit: tile.data });
              snake.eat(tile.data);
            }
          }

          if (!snakeHasMoved) {
            map.reset();
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
        {import.meta.env.DEV && jsonState === "ERROR" && (
          <UINotification type="error" className="mb-4">
            *DEV* Check if the API is running
          </UINotification>
        )}
        <UISuspense />
      </div>
    );
  }

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default GameCanvas;
