import { useEffect } from "react";
import { ObstacleColor } from "../../classes/Obstacles";

interface ColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectColor: (color: ObstacleColor) => void;
}

const ColorModal: React.FC<ColorModalProps> = ({
  isOpen,
  onClose,
  onSelectColor,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isOpen) return null;

  const colors: ObstacleColor[] = [
    "black",
    "gray",
    "silver",
    "blue",
    "teal",
    "cyan",
    "skyblue",
    "indigo",
    "purple",
    "violet",
    "fuchsia",
    "pink",
    "lime",
    "green",
    "orange",
    "gold",
    "yellow",
  ];

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10"
      onClick={onClose}
    >
      <div className="bg-gray-800 bg-opacity-95 p-4 rounded-lg flex justify-center flex-col">
        <h2 className="font-bold text-xl mb-4 text-center">Select a Color</h2>
        <div className="flex flex-wrap gap-4 max-w-96 justify-center mb-8">
          {colors.map((color) => (
            <button
              key={color}
              className={`h-10 w-10 rounded-lg border-4 border-gray-700 hover:scale-105 transition-transform`}
              style={{ backgroundColor: color }}
              onClick={() => {
                onSelectColor(color);
                onClose();
              }}
            ></button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="bg-gray-700 bg-opacity-70 text-white py-3 px-12 rounded-lg"
          ref={(ref) => ref?.focus()}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ColorModal;
