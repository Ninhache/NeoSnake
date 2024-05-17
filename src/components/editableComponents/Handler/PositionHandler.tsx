import { useMemo } from "react";
import { clamp } from "../../../lib/math";
import UINumberInput from "../../UI/UINumberInput";
import { useEditor } from "../../contexts/EditorContext";

interface Props {
  axis: "x" | "y";
}

const PositionHandler: React.FC<Props> = ({ axis }) => {
  const { mapData, setMapData } = useEditor();

  const size = axis === "x" ? mapData.options.width : mapData.options.height;

  const maxValue = useMemo(
    () => Math.floor(size / mapData.options.cellSize) - 1,
    [mapData.options.cellSize]
  );

  const handleChange = (axis: "x" | "y") => (value: number) => {
    const clampedValue = clamp(value, 0, maxValue);

    if (!isNaN(clampedValue)) {
      setMapData({
        ...mapData,
        snake: {
          ...mapData.snake,
          startPosition: {
            ...mapData.snake.startPosition,
            [axis]: clampedValue,
          },
        },
      });
    }
  };

  return (
    <UINumberInput
      value={mapData.snake.startPosition[axis]}
      onChangeValue={handleChange(axis)}
      max={maxValue}
      min={0}
    />
  );
};

export default PositionHandler;
