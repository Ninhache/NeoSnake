import { clearCache, godCache } from "../../lib/localstorage";

type Props = {};
const DEVCacheButtons: React.FC<Props> = ({}) => {
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col justify-center my-2">
        <div className="flex justify-center">
          <button
            className="bg-red-500 p-2 m-1 w-1/2 rounded-lg hover:bg-red-600 transition-colors duration-300"
            onClick={() => clearCache()}
          >
            Clear Cache
          </button>

          <button
            className="bg-red-500 p-2 m-1 w-1/2 rounded-lg hover:bg-red-600 transition-colors duration-300"
            onClick={() => godCache()}
          >
            "God" Mode
          </button>
        </div>

        <i className="text-gray-500 ml-4 text-center">
          * Buttons only available in dev mode
        </i>
      </div>
    </>
  );
};

export default DEVCacheButtons;
