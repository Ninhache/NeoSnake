
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
        new BigFruit(new BasicFood(null, { x: 20, y: 20 })),
        new BasicFood(null, { x: 30, y: 35 }),
        new DeadlyFruit(new BasicFood(null, { x: 20, y: 20 }))
    ]);

    const handleKeyPress = (event: KeyboardEvent) => {
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

    const draw = (ctx: CanvasRenderingContext2D) => {
        foodsRef.current.forEach(food => {
            food.draw(ctx);
        });
        snake.current.draw(ctx);
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

                // ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                draw(ctx);

                animationFrameId = window.requestAnimationFrame(render);

                if (frameCount % 15 === 0) {

                    foodsRef.current.forEach((food) => {
                        
                        console.log(width, height)
                        if (snake.current.head.x === food.coordinates.x && snake.current.head.y === food.coordinates.y) {
                            snake.current.eat(food, Math.floor(width / 20), Math.floor(height / 20))
                        }
                    });

                    if (!snake.current.move(Math.floor(width / 20), Math.floor(height / 20))) {
                        alert('Game Over');
                        window.cancelAnimationFrame(animationFrameId);
                    }

                }
            }

            render();

            return () => {
                window.cancelAnimationFrame(animationFrameId),
                    window.removeEventListener('keydown', handleKeyPress);
            }

        }

        // if (ctx && canvas) {
        //     const gameLoop = setInterval(() => {
        //         ctx.clearRect(0, 0, canvas.width, canvas.height);
        //         snake.current.move();
        //         food.current.draw(ctx);
        //         snake.current.draw(ctx);
        //     }, 100);

        //     window.addEventListener('keydown', handleKeyPress);

        //     return () => {
        //         clearInterval(gameLoop),
        //         window.removeEventListener('keydown', handleKeyPress);
        //     }
        // }

    }, [draw]);

    return (<canvas ref={canvasRef} width={width} height={height} style={{ border: '1px solid black' }} />);

};

export default GameCanvas;