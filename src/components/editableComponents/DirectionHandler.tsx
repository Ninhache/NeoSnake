import { DirectionType } from "../../@types/DirectionType";
import UIDropdown from "../UI/UIDropdown";
import { useEditor } from "../contexts/EditorContext";

const DirectionHandler: React.FC = () => {
  const { mapData, setMapData } = useEditor();

  const handleDirectionChange = (direction: string) => {
    setMapData({
      ...mapData,
      snake: {
        ...mapData.snake,
        direction: direction as DirectionType,
      },
    });
  };

  return (
    <>
      <h3 className="font-bold">Direction</h3>
      <UIDropdown
        items={["Right", "Left", "Down", "Up"]}
        label="Test"
        onSelect={handleDirectionChange}
      />
    </>
  );
};

export default DirectionHandler;
