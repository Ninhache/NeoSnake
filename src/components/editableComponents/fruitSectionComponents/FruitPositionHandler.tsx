import {useMemo} from "react";
import {ScenarioFruits} from "../../../@types/Scenario";
import {useEditor} from "../../contexts/EditorContext";
import UINumberInput from "../../UI/UINumberInput";

type Props = {
  index: number;
  fruit: ScenarioFruits;
  axis: "x" | "y";
};
const FruitPositionHandler: React.FC<Props> = ({ index, fruit, axis }) => {
  const { mapData, setMapData, currentScenario } = useEditor();

  const size = axis === "x" ? mapData.options.width : mapData.options.height;

  const maxValue = useMemo(
    () => Math.floor(size / mapData.options.cellSize) - 1,
    [mapData.options.cellSize]
  );

  const handleFruitChange = (newValue: number) => {
    setMapData({
      ...mapData,
      maps: mapData.maps.map((map, i) => {
        if (i === currentScenario) {
          return {
            ...map,
            fruits: map.fruits.map((f, j) => {
              if (j === index) {
                return {
                  ...f,
                  actualPosition: {
                    ...f.actualPosition,
                    [axis]: newValue,
                  },
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
      value={fruit.actualPosition[axis]}
      onChangeValue={handleFruitChange}
      max={maxValue}
      min={0}
    />
  );
};

export default FruitPositionHandler;
