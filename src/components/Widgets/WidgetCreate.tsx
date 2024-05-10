import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../contexts/AuthContext";
import { useEditor } from "../contexts/EditorContext";
import LayoutComponent from "../layouts/LayoutComponent";
import WidgetEditableGrid from "./WidgetEditableGrid";
import WidgetEditableOptions from "./WidgetEditableOptions";
import WidgetLogin from "./WidgetLogin";

import { useEffect, useState } from "react";
import { SnakeMapData } from "../../@types/MapTypes";
import { getExistingMap } from "../../lib/level";
import UISuspense from "../UI/UISuspense";
import WidgetToolSelector from "./WidgetToolSelector";

const WidgetCreate: React.FC = () => {
  const { username } = useAuth();

  const { uuid } = useParams();
  const navigate = useNavigate();

  const { setMapData, pendingChanges } = useEditor();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!pendingChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pendingChanges]);

  useEffect(() => {
    if (!uuid) {
      const newId = uuidv4();
      navigate(`/create/${newId}`);
    } else {
      getExistingMap(uuid)
        .then((data) => data.json())
        .then((data) => {
          const { uuid, ...foundData } = JSON.parse(
            data.data.map_data
          ) as SnakeMapData & {
            uuid: string;
          };

          setMapData(foundData);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [uuid, navigate]);

  if (!username) {
    return (
      <LayoutComponent>
        <h1 className="text-center text-3xl text-white font-bold">
          You've to be connected to access this
        </h1>
        <WidgetLogin />
      </LayoutComponent>
    );
  }

  if (loading) {
    return <UISuspense />;
  }

  return (
    <LayoutComponent>
      <div className="flex">
        <div>
          <WidgetToolSelector />
          <WidgetEditableGrid width={800} height={800} />
        </div>
        <WidgetEditableOptions />
      </div>
    </LayoutComponent>
  );
};

export default WidgetCreate;
