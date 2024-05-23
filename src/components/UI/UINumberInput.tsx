import { useEffect, useState } from "react";
import { clamp } from "../../lib/math";
import "../../styles/UINumberInput.css";

interface NumberInputProps {
  value: number;
  onChangeValue: (newValue: number) => void;
  max: number;
  min?: number;
  step?: number;
  style?: React.CSSProperties;
  className?: string;
}

const UINumberInput: React.FC<NumberInputProps> = ({
  value,
  onChangeValue,
  min = 0,
  max,
  step = 1,
}) => {
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    setIsShiftPressed(event.shiftKey);
  };

  const handleKeyUp = (_: KeyboardEvent) => {
    setIsShiftPressed(false);
  };

  const handleIncrement = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    const increment = isShiftPressed ? 5 : step;
    if (value < max) {
      onChangeValue(Math.min(value + increment, max));
    }
  };

  const handleDecrement = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    const decrement = isShiftPressed ? 5 : step;
    if (value > min) {
      onChangeValue(Math.max(value - decrement, min));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="flex w-full">
      <button
        aria-label="Decrease value"
        className={`border-2 w-12 h-8  transition-colors duration-300 rounded-l-lg ${
          value <= min
            ? "bg-gray-400 cursor-not-allowed text-gray-600 "
            : "bg-gray-100 cursor-pointer text-black hover:bg-red-500"
        } font-bold text-center`}
        onClick={handleDecrement}
        disabled={value <= min}
        style={{
          borderTopLeftRadius: "0.5rem",
          borderBottomLeftRadius: "0.5rem",
        }}
      >
        -
      </button>

      <input
        type="number"
        value={value}
        onChange={(e) => onChangeValue(clamp(+e.target.value, min, max))}
        min={min}
        max={max}
        step={step}
        className="text-black w-full h-8 text-center "
      ></input>

      <button
        aria-label="Increase value"
        className={`border-2 w-12 h-8 transition-colors duration-300 rounded-r-lg ${
          value >= max
            ? "bg-gray-400 cursor-not-allowed text-gray-600"
            : "bg-gray-100 cursor-pointer text-black hover:bg-green-500"
        } font-bold text-center`}
        onClick={handleIncrement}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
};

export default UINumberInput;
