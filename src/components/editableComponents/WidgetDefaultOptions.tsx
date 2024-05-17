import {NavLink} from "react-router-dom";
import CellSizeHandler from "./Handler/CellHandler";
import DifficultyHandler from "./Handler/DifficultyHandler";
import DirectionHandler from "./Handler/DirectionHandler";
import LengthHandler from "./Handler/LengthHandler";
import NameHandler from "./Handler/NameHandler";
import PositionHandler from "./Handler/PositionHandler";

const WidgetDefaultOptions: React.FC = () => {
  return (
    <div className="relative bg-gray-800 bg-opacity-40 w-full h-3/8 flex flex-col gap-2">
      <NavLink
        to="/article/editor-beginners-guide"
        className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-400 opacity-40 hover:opacity-100 transition duration-300 ease-in-out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 scale-150 fill-gray-200 stroke-gray-700"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
          />
        </svg>
      </NavLink>

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
