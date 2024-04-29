
import { useEffect, useRef } from "react";
import { BasicFood, BigFruit, DeadlyFruit, Food, Snake } from "../classes/Entity";

import { Direction } from "../enums";

type Props = {
    width: number;
    height: number;
}

const GameCanvas: React.FC<Props> = ({ width, height }) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const snake = useRef(new Snake(null, { x: 10, y: 10 }));
    
    // const food = useRef(new Food(null, { x: 15, y: 15 }));
    const foodsRef = useRef([
        new BasicFood(null, { x: 10, y: 10 }),
        new BigFruit(new BasicFood(null, { x: 25, y: 20 })),
        new BasicFood(null, { x: 30, y: 35 }),
        new DeadlyFruit(new BasicFood(null, { x: 15, y: 20 }))
    ]);

    const handleKeyPress = (event: KeyboardEvent) => {
        // Keep all the events unless they are arrow keys
        if (
            ![
              "ArrowLeft",
              "ArrowUp",
              "ArrowRight",
              "ArrowDown",
            ].includes(event.key)
          )
            return;
        event.preventDefault();
        const { key } = event;

        switch (key) {
            case "ArrowUp":
                snake.current.enqueueDirection(Direction.Up);
                break;
            case "ArrowDown":
                snake.current.enqueueDirection(Direction.Down);
                break;
            case "ArrowLeft":
                snake.current.enqueueDirection(Direction.Left);
                break;
            case "ArrowRight":
                snake.current.enqueueDirection(Direction.Right);
                break;
        }
    };

    const draw = (ctx: CanvasRenderingContext2D, frameNumber: number) => {
        foodsRef.current.forEach(food => {
			food.draw(ctx);
		});

		snake.current.draw(ctx, (frameNumber % 20) / 20);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (ctx && canvas) {
            let frameCount = 0;
            let animationFrameId: number;

            window.addEventListener('keydown', handleKeyPress);

            const render = () => {
                frameCount++;
                animationFrameId = window.requestAnimationFrame(render);

                
                ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                if (frameCount % 20 === 0) {

                    const snakeHasMoved = snake.current.move(Math.floor(width / 20), Math.floor(height / 20));

                    foodsRef.current.forEach((food) => {
                        if (snake.current.head.x === food.coordinates.x && snake.current.head.y === food.coordinates.y) {
                            snake.current.eat(food, Math.floor(width / 20), Math.floor(height / 20))
                        }
                    });

                    if (!snakeHasMoved) {
                        alert('Game Over');
                        window.cancelAnimationFrame(animationFrameId);
                    }

                }

				draw(ctx, frameCount);

            }

            render();

            return () => {
                window.cancelAnimationFrame(animationFrameId),
                    window.removeEventListener('keydown', handleKeyPress);
            }

        }
    }, []);

    return (<canvas ref={canvasRef} width={width} height={height} style={{ border: '1px solid black' }} />);

};

export default GameCanvas;