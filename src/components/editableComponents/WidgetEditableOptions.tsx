import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Nullable } from "../../@types/NullableType";
import { uploadMap } from "../../lib/services/level";
import UINotification from "../UI/UINotification";
import UISuspense from "../UI/UISuspense";
import { useEditor } from "../contexts/EditorContext";
import DEVLogButton from "../devComponents/DEVLogButton";
import WidgetDefaultOptions from "./WidgetDefaultOptions";
import WidgetEditableFruits from "./WidgetEditableFruits";
import { isValidData } from "../../lib/mapData";

const WidgetEditableOptions: React.FC = () => {
  const { mapData } = useEditor();
  const { uuid } = useParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [returnValue, setReturnValue] = useState<Nullable<string>>(null);
  const navigate = useNavigate();

  useEffect(() => {}, [mapData, returnValue]);

  const handleSave = () => {
    if (!mapData) {
      console.error("mapData is undefined");
      return;
    }

    if (!isValidData(mapData).success) {
      console.error("mapData is invalid");
      return;
    }

    let tmpUuid = uuid ?? uuidv4();

    setReturnValue("Uploading...");

    setLoading(true);
    uploadMap(mapData, tmpUuid)
      .then((_) => {
        setReturnValue("Upload with success");
        setLoading(false);
        navigate(`/create/${tmpUuid}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full h-full gap-4">
        <WidgetDefaultOptions />

        <WidgetEditableFruits />
        <div className="flex flex-wrap w-auto">
          <DEVLogButton obj={mapData} className="w-1/2" />
          <button
            className={`border-4 border-green-500 rounded-lg p-2 hover:bg-green-400 transition-colors duration-300 font-bold text-xl ${
              import.meta.env.DEV ? "w-1/2" : "w-full"
            }`}
            onClick={handleSave}
          >
            {loading ? <UISuspense /> : "Save"}
          </button>
        </div>
        {returnValue && (
          <UINotification type="info">{returnValue}</UINotification>
        )}
      </div>
    </div>
  );
};

export default WidgetEditableOptions;
