import { clamp } from "../../lib/math";
import UINumberInput from "../UI/UINumberInput";
import { useEditor } from "../contexts/EditorContext";

const LengthHandler: React.FC = () => {
  const { mapData, setMapData } = useEditor();

  const maxValueLength = 999;
  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLength = clamp(parseInt(e.target.value, 10), 0, maxValueLength);

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
    <>
      <h3 className="font-bold">Initial Length :</h3>
      <UINumberInput
        value={mapData.snake.length}
        handleChange={handleLengthChange}
        max={maxValueLength}
        min={1}
      />
    </>
  );
};

export default LengthHandler;
