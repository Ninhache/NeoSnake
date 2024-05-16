import CellSizeHandler from "../editableComponents/CellHandler";
import DifficultyHandler from "../editableComponents/DifficultyHandler";
import DirectionHandler from "../editableComponents/DirectionHandler";
import LengthHandler from "../editableComponents/LengthHandler";
import NameHandler from "../editableComponents/NameHandler";
import PositionHandler from "../editableComponents/PositionHandler";

const WidgetDefaultOptions: React.FC = () => {
  return (
    <div className="bg-gray-800 bg-opacity-40 w-full h-3/8 flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-center text-gray-600">Options</h1>

      <h2 className="font-bold text-xl text-center">Map</h2>

      <div className="flex justify-center">
        <h3 className="font-bold w-36 text-right pr-2">Name :</h3>
        <div className="w-48">
          <NameHandler />
        </div>
      </div>

      <div className="flex justify-center">
        <h3 className="font-bold w-36 text-right pr-2">Cell size :</h3>
        <div className="w-48">
          <CellSizeHandler />
        </div>
      </div>

      <h2 className="font-bold text-xl text-center">Snake</h2>

      <div className="flex justify-center">
        <h3 className="font-bold w-36 text-right pr-2">X :</h3>
        <div className="w-48">
          <PositionHandler axis="x" />
        </div>
      </div>
      <div className="flex justify-center">
        <h3 className="font-bold w-36 text-right pr-2">Y :</h3>
        <div className="w-48">
          <PositionHandler axis="y" />
        </div>
      </div>

      <div className="flex justify-center">
        <h3 className="font-bold w-36 text-right pr-2">Direction :</h3>
        <div className="w-48">
          <DirectionHandler />
        </div>
      </div>

      <div className="flex justify-center">
        <h3 className="font-bold w-36 text-right pr-2">Initial Length :</h3>
        <div className="w-48">
          <LengthHandler />
        </div>
      </div>

      <DifficultyHandler />
      <br></br>
    </div>
  );
};

export default WidgetDefaultOptions;
