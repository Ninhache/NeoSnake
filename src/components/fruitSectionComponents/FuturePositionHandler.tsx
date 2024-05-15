import { useMemo } from "react";
import { ScenarioFruits } from "../../@types/Scenario";
import UINumberInput from "../UI/UINumberInput";
import { useEditor } from "../contexts/EditorContext";

type FuturePositionHandlerProps = {
  fruitIndex: number;
  futureIndex: number;
  fruit: ScenarioFruits;
  axis: "x" | "y";
};
const FuturePositionHandler: React.FC<FuturePositionHandlerProps> = ({
  fruitIndex,
  futureIndex,
  fruit,
  axis,
}) => {
  const { mapData, setMapData, currentScenario } = useEditor();

  const size = axis === "x" ? mapData.options.width : mapData.options.height;

  const maxValue = useMemo(
    () => Math.floor(size / mapData.options.cellSize) - 1,
    [mapData.options.cellSize]
  );

  const handleFuturePositionsChange = (newValue: number) => {
    setMapData({
      ...mapData,
      maps: mapData.maps.map((map, i) => {
        if (i === currentScenario) {
          return {
            ...map,
            fruits: map.fruits.map((f, j) => {
              if (j === fruitIndex) {
                return {
                  ...f,
                  futurePosition: f.futurePosition.map((fp, k) => {
                    if (k === futureIndex) {
                      return {
                        ...fp,
                        [axis]: newValue,
                      };
                    }
                    return fp;
                  }),
                };
              }
              return f;
            }),
          };
        }
        return map;
      }),
    });
  };

  return (
    <UINumberInput
      value={fruit.futurePosition[futureIndex][axis]}
      onChangeValue={handleFuturePositionsChange}
      max={maxValue}
      min={0}
    />
  );
};

export default FuturePositionHandler;
