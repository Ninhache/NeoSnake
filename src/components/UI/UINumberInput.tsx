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
  const handleIncrement = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (value < max) {
      onChangeValue(value + step);
    }
  };

  const handleDecrement = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (value > min) {
      onChangeValue(value - step);
    }
  };

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
        onChange={(e) => onChangeValue(parseFloat(e.target.value))}
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
