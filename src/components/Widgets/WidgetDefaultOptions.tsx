import CellSizeHandler from "../editableComponents/CellHandler";
import DirectionHandler from "../editableComponents/DirectionHandler";
import LengthHandler from "../editableComponents/LengthHandler";
import NameHandler from "../editableComponents/NameHandler";
import PositionHandler from "../editableComponents/PositionHandler";

const WidgetDefaultOptions: React.FC = () => {
  return (
    <div className="bg-gray-800 bg-opacity-40 h-3/8">
      <h1 className="text-2xl font-bold text-center">Options</h1>

      <h2 className="font-bold text-xl text-center">Map</h2>
      <div className="flex gap-2 justify-center">
        <label className="flex gap-2">
          <NameHandler />
        </label>
      </div>
      <div className="flex gap-2 justify-center">
        <label className="flex gap-2">
          <CellSizeHandler />
        </label>
      </div>

      <h2 className="font-bold text-xl text-center">Snake</h2>
      <div className="flex gap-2 justify-center">
        <label className="flex gap-2 w-1/2 justify-center">
          <PositionHandler axis="x" />
        </label>
        <label className="flex gap-2 w-1/2 justify-center">
          <PositionHandler axis="y" />
        </label>
      </div>

      <div className="flex gap-2 justify-center">
        <DirectionHandler />
      </div>

      <label className="flex gap-2 justify-center">
        <LengthHandler />
      </label>
    </div>
  );
};

export default WidgetDefaultOptions;
