import { useEffect, useRef } from "react";

import jsonMap from "../assets/jsons/testMap.json";
import { Food } from "../classes/Entity";
import { SnakeMap } from "../classes/Map";
import { Direction } from "../@types/DirectionType";
import { useGame } from "./contexts/GameContext";

type Props = {
  width: number;
  height: number;
};

const GameCanvas: React.FC<Props> = ({ width, height }) => {
  const { dispatch } = useGame();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const map = new SnakeMap(JSON.stringify(jsonMap));
  const snake = map.snake;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

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
      map.draw(ctx, (frameNumber % 10) / 10);
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

        if (frameCount % 10 === 0) {
          const snakeHasMoved = snake.processMovement(map);

          const tile = map.getTile(snake.head);
          if (tile) {
            if (tile.data instanceof Food) {
              dispatch({ type: "GAME_EAT_FRUIT", fruit: tile.data });
              snake.eat(tile.data);
            }
          }

          if (!snakeHasMoved) {
            alert("Game Over");
            window.cancelAnimationFrame(animationFrameId);
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: "1px solid black" }}
    />
  );
};

export default GameCanvas;
