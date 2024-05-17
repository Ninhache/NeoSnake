import { clamp } from "../../../lib/math";
import UINumberInput from "../../UI/UINumberInput";
import { useEditor } from "../../contexts/EditorContext";

const LengthHandler: React.FC = () => {
  const { mapData, setMapData } = useEditor();

  const maxValueLength = 999;
  const handleLengthChange = (value: number) => {
    const newLength = clamp(value, 0, maxValueLength);

    if (!isNaN(newLength)) {
      setMapData({
        ...mapData,
        snake: {
          ...mapData.snake,
          length: newLength,
        },
      });
    }
  };

  return (
    <UINumberInput
      value={mapData.snake.length}
      onChangeValue={handleLengthChange}
      max={maxValueLength}
      min={1}
    />
  );
};

export default LengthHandler;
