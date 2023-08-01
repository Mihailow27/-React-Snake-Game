import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Food from "./components/Food";
import Snake from "./components/Snake";

const randomFoodPosition = () => {
  const pos = { x: 0, y: 0 };
  let x = Math.floor(Math.random() * 96);
  let y = Math.floor(Math.random() * 96);
  pos.x = x - (x % 4);
  pos.y = y - (y % 4);
  return pos;
};

const initialSnakeState = {
  snake: [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 8, y: 0 },
  ],
  direction: "ArrowRight",
  speed: 100,
};

function App() {
  const [snake, setSnake] = useState(initialSnakeState.snake);
  const [lastDirection, setLastDirection] = useState(initialSnakeState.direction);
  const [foodPosition, setFoodPosition] = useState(randomFoodPosition);
  const [isStarted, setIsStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const playgroundRef = useRef();

  useEffect(() => {
    if (!isStarted) return;

    const checkCollision = () => {
      const { x, y } = snake[snake.length - 1];
      if (x === 100 || x === 0 || y === 100 || y === -4) {
        setGameOver(true);
      }
    };

    const interval = setInterval(() => {
      move();
      checkCollision();
    }, initialSnakeState.speed);

    return () => clearInterval(interval);
  }, [isStarted, snake]);

  const move = () => {
    const tmpSnake = [...snake];
    let x = tmpSnake[tmpSnake.length - 1].x,
      y = tmpSnake[tmpSnake.length - 1].y;

    switch (lastDirection) {
      case "ArrowUp":
        y -= 4;
        break;
      case "ArrowRight":
        x += 4;
        break;
      case "ArrowDown":
        y += 4;
        break;
      case "ArrowLeft":
        x -= 4;
        break;
      default:
        break;
    }

    tmpSnake.push({
      x,
      y,
    });

    if (x !== foodPosition.x || y !== foodPosition.y) {
      tmpSnake.shift();
    } else {
      setFoodPosition(randomFoodPosition());
    }

    setSnake(tmpSnake);
  };

  const handleStart = () => {
    setIsStarted(true);
    playgroundRef.current.focus();
  };

  const handleRestart = () => {
    setIsStarted(true);
    setGameOver(false);
    setSnake(initialSnakeState.snake);
    setLastDirection(initialSnakeState.direction);
    playgroundRef.current.focus();
  };

  return (
    <div
      className="App"
      onKeyDown={(e) => setLastDirection(e.key)}
      ref={playgroundRef}
      tabIndex={0}
    >
      {isStarted && <div className="count">Score: {snake.length - 3}</div>}

      {!isStarted && (
        <>
          <button onClick={handleStart} type="submit">
            Start
          </button>
          <div className="arrow-msg text">Press Arrow keys to play!</div>
        </>
      )}
      {gameOver && (
        <>
          <div className="game-over text">Game Over!</div>
          <button onClick={handleRestart} type="submit">
            Restart
          </button>
        </>
      )}
      <Snake snake={snake} lastDirection={lastDirection} />
      {!gameOver && <Food position={foodPosition} />}
    </div>
  );
}

export default App;
