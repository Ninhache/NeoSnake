import { useEffect, useState } from "react";
import { ObstacleColor } from "../../classes/Obstacles";
import { capitalize } from "../../lib/text";

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
  const [hoveredColor, setHoveredColor] = useState<ObstacleColor | null>(null);
  useEffect(() => {
    setHoveredColor(null);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const colors: ObstacleColor[] = [
    "black",
    "dimgray",
    "gray",
    "silver",
    "skyblue",
    "cyan",
    "teal",
    "blue",
    "darkblue",
    "indigo",
    "purple",
    "fuchsia",
    "violet",
    "pink",
    "yellow",
    "gold",
    "orange",
    "chartreuse",
    "lime",
    "springgreen",
    "green",
  ];

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10"
      onClick={onClose}
    >
      <div className="bg-gray-800 bg-opacity-95 p-4 rounded-lg flex justify-center flex-col">
        <h2 className="font-bold text-xl mb-4 text-center">Select a Color</h2>
        <div className="flex flex-wrap gap-4 max-w-96 justify-center mb-4">
          {colors.map((color) => (
            <button
              key={color}
              className={`h-10 w-10 rounded-lg border-4 border-gray-700 hover:scale-105 transition-transform`}
              style={{ backgroundColor: color }}
              onClick={() => {
                onSelectColor(color);
                onClose();
              }}
              onMouseEnter={(_) => {
                setHoveredColor(color);
              }}
            ></button>
          ))}
          <div>
            <div className="border-2 w-64 border-opacity-45 border-gray-500 mb-2"></div>
            <h2 className="text-center h-8">
              {capitalize(hoveredColor || "")}
            </h2>
          </div>
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
