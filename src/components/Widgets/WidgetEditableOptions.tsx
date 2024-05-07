import { v4 as uuidv4 } from "uuid";
import { useEffect, useMemo, useState } from "react";
import { useEditor } from "../contexts/EditorContext";
import CellHandler from "../editableComponents/CellHandler";
import DirectionHandler from "../editableComponents/DirectionHandler";
import LengthHandler from "../editableComponents/LengthHandler";
import NameHandler from "../editableComponents/NameHandler";
import PositionHandler from "../editableComponents/PositionHandler";
import DEVLogButton from "../devComponents/DEVLogButton";

const WidgetEditableOptions: React.FC = () => {
  const { mapData } = useEditor();

  useEffect(() => {}, [mapData]);
  const [loading, setLoading] = useState<boolean>(false);

  const uuid = useMemo(() => uuidv4(), []);

  const handleSave = () => {
    if (!mapData) {
      console.error("mapData is undefined");
      return;
    }

    setLoading(true);
    console.log("Sending mapData:", JSON.stringify(mapData));
    fetch(`${import.meta.env.VITE_SNAKE_API_ROUTE}/level/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...mapData, id: uuid }),
    })
      .then((data) => {
        console.log("Response Data:", data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error sending mapData:", err);
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col p-2 w-full ml-4 gap-4">
      <h1 className="text-2xl font-bold text-center">Map options</h1>

      <h2 className="font-bold text-xl text-center">Map Options</h2>
      <div className="flex gap-2 justify-center">
        <label className="flex gap-2">
          <NameHandler />
        </label>
      </div>
      <div className="flex gap-2 justify-center">
        <label className="flex gap-2">
          <CellHandler />
        </label>
      </div>

      <h2 className="font-bold text-xl text-center">Snake Options</h2>
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

      <DEVLogButton obj={mapData} />
      <button
        className="border-4 border-green-500 rounded-lg p-2 hover:bg-green-400 transition-colors duration-300 font-bold text-xl"
        onClick={handleSave}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default WidgetEditableOptions;
