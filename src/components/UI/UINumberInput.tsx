import "../../styles/UINumberInput.css";

interface NumberInputProps {
  value: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step?: number;
  style?: React.CSSProperties;
  className?: string;
}

const UINumberInput: React.FC<NumberInputProps> = ({
  value,
  handleChange,
  min,
  max,
  step = 1,
}) => {
  const numericValue = Number(value);

  return (
    <div className="flex">
      <button
        aria-label="Decrease value"
        className={`border-2 w-8 h-8  transition-colors duration-300 rounded-l-lg ${
          numericValue <= min
            ? "bg-gray-400 cursor-not-allowed text-gray-600"
            : "bg-gray-100 cursor-pointer text-black"
        } font-bold text-center`}
        onClick={() => {
          handleChange({
            target: { value: String(numericValue - step) },
          } as React.ChangeEvent<HTMLInputElement>);
        }}
        disabled={numericValue <= min}
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
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="text-black w-8 h-8 text-center "
      />

      <button
        aria-label="Increase value"
        className={`border-2 w-8 h-8 transition-colors duration-300 rounded-r-lg ${
          numericValue >= max
            ? "bg-gray-400 cursor-not-allowed text-gray-600"
            : "bg-gray-100 cursor-pointer text-black"
        } font-bold text-center`}
        onClick={() => {
          handleChange({
            target: { value: String(numericValue + step) },
          } as React.ChangeEvent<HTMLInputElement>);
        }}
        disabled={numericValue >= max}
      >
        +
      </button>
    </div>
  );
};

export default UINumberInput;
