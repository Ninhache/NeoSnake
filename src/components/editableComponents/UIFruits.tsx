import { useEffect } from "react";
import { ScenarioFruits } from "../../@types/Scenario";
import chevron from "../../assets/svg/chevron-right-solid.svg";
import { useEditor } from "../contexts/EditorContext";
import FruitPositionHandler from "./fruitSectionComponents/FruitPositionHandler";
import UIFutureFruits from "./UIFutureFruits";

type Props = {
  index: number;
  fruit: ScenarioFruits;
  isOpen: boolean;
  onClick: () => void;
  deleteFruit: (delIndex: number) => void;
};
const UIFruits: React.FC<Props> = ({
  index,
  fruit,
  isOpen,
  onClick,
  deleteFruit,
}) => {
  const { addFutureFruitPositions, deleteGameFruits } = useEditor();
  useEffect(() => {}, [fruit.actualPosition, fruit.futurePosition]);

  const baseHeight = 34; // That's the height of the cell
  const maxHeight = fruit.futurePosition.length * baseHeight;
  const isScrollable = fruit.futurePosition.length > 10;
  const displayHeight = (isScrollable ? 10 * baseHeight : maxHeight) + 32; // 32 is the height of "add position"

  return (
    <>
      <div className="bg-gray-800 border-2 bg-opacity-60 border-b-2 border-gray-800 text-white">
        <div
          className="cursor-pointer flex justify-between p-2 font-bold group"
          onClick={onClick}
        >
          <div className="flex gap-2 items-center">
            <h3 className="text-gray-500">{index + 1}</h3>
            <h2>{fruit.type}</h2>
            <h3 className="flex gap-2">
              <span className="text-gray-500"> x </span>
              <div className="w-24">
                <FruitPositionHandler index={index} fruit={fruit} axis="x" />
              </div>
              <span className="text-gray-500"> y </span>
              <div className="w-24">
                <FruitPositionHandler index={index} fruit={fruit} axis="y" />
              </div>
            </h3>
            <h3 className="text-gray-500">({fruit.futurePosition.length})</h3>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 self-center opacity-0 group-hover:opacity-70 transition-opacity transition-transform hover:scale-110 hover:cursor-pointer "
            onClick={(e) => {
              e.stopPropagation();
              deleteGameFruits(index);
              deleteFruit(index);
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
          <img
            src={chevron}
            alt="chevron"
            width={14}
            height={14}
            className={`transform ${
              isOpen ? "rotate-90" : ""
            } transition-transform duration-300 ease-in-out`}
          />
        </div>

        <div
          style={{
            maxHeight: isOpen ? `${displayHeight}px` : "0px",
            overflowY: isScrollable ? "auto" : "hidden",
          }}
          className="transition-max-height duration-300 ease bg-gray-900 overflow-hidden"
        >
          {fruit.futurePosition.map((_, futureIndex) => (
            <UIFutureFruits
              key={futureIndex}
              fruit={fruit}
              fruitIndex={index}
              futureIndex={futureIndex}
            />
          ))}
          <div
            className="flex gap-4 h-8 text-gray-500 italic border-gray-700 border-opacity-20 justify-around items-center cursor-pointer hover:bg-gray-800 hover:bg-opacity-60 transition-opacity"
            onClick={() => {
              addFutureFruitPositions(index, { x: 5, y: 5 });
            }}
          >
            add future position
          </div>
        </div>
      </div>
    </>
  );
};

export default UIFruits;
