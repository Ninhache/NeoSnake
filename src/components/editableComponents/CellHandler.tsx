import { clamp } from "../../lib/math";
import UINumberInput from "../UI/UINumberInput";
import { useEditor } from "../contexts/EditorContext";

const CellHandler: React.FC = () => {
  const { mapData, setMapData } = useEditor();

  const maxValueCellSize = 50;
  const minValueCellSize = 10;
  const cellSizePossibleValues = [10, 16, 20, 25, 32, 40, 50];

  const handleCellSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let actualIndex = cellSizePossibleValues.indexOf(mapData.options.cellSize);
    const indexMove = parseInt(e.target.value, 10) - mapData.options.cellSize;

    actualIndex += indexMove;

    actualIndex = clamp(actualIndex, 0, cellSizePossibleValues.length - 1);

    setMapData({
      ...mapData,
      options: {
        ...mapData.options,
        cellSize: cellSizePossibleValues[actualIndex],
      },
    });
  };

  return (
    <>
      <h3 className="font-bold">Cell size :</h3>
      <UINumberInput
        value={mapData.options.cellSize}
        handleChange={handleCellSizeChange}
        max={maxValueCellSize}
        min={minValueCellSize}
      />
    </>
  );
};

export default CellHandler;
