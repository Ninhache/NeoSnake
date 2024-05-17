import { ScenarioFruits } from "../../@types/Scenario";
import { useEditor } from "../contexts/EditorContext";
import FuturePositionHandler from "./fruitSectionComponents/FuturePositionHandler";

type Props = {
  fruit: ScenarioFruits;
  fruitIndex: number;
  futureIndex: number;
};
const UIFutureFruits: React.FC<Props> = ({
  fruit,
  fruitIndex,
  futureIndex,
}) => {
  const { deleteFutureFruitPositionsByIndex } = useEditor();
  return (
    <div
      key={futureIndex}
      className="flex gap-4 border-b-2 border-gray-700 border-opacity-20 justify-around items-center group"
    >
      <div className="flex gap-2">
        <span className="text-gray-500 w-4 content-center ml-2">
          {futureIndex + 1}
        </span>
        <div className="flex">
          <div className="flex font-bold gap-2">
            <span className="flex gap-2 items-center">
              X{" "}
              <div className="w-24">
                <FuturePositionHandler
                  fruitIndex={fruitIndex}
                  futureIndex={futureIndex}
                  fruit={fruit}
                  axis="x"
                />
              </div>
            </span>

            <span className="flex gap-2 items-center">
              Y{" "}
              <div className="w-24">
                <FuturePositionHandler
                  fruitIndex={fruitIndex}
                  futureIndex={futureIndex}
                  fruit={fruit}
                  axis="y"
                />
              </div>
            </span>
          </div>
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 opacity-0 group-hover:opacity-70 transition-opacity transition-transform hover:scale-110 hover:cursor-pointer "
        onClick={() => {
          deleteFutureFruitPositionsByIndex(fruitIndex, futureIndex);
        }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </div>
  );
};

export default UIFutureFruits;
