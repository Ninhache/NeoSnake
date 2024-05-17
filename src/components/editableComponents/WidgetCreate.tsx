import { useNavigate, useParams } from "react-router-dom";
import WidgetLogin from "../account/WidgetLogin";
import { useAuth } from "../contexts/AuthContext";
import { useEditor } from "../contexts/EditorContext";
import LayoutComponent from "../layouts/LayoutComponent";
import WidgetEditableGrid from "./WidgetEditableGrid";
import WidgetEditableOptions from "./WidgetEditableOptions";

import { useEffect, useState } from "react";

import { getExistingMap } from "../../lib/level";
import UISuspense from "../UI/UISuspense";
import WidgetScenarios from "./WidgetScenarios";

const WidgetCreate: React.FC = () => {
  const { username } = useAuth();

  const { uuid } = useParams();
  const navigate = useNavigate();

  const { setMapData, pendingChanges } = useEditor();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!pendingChanges) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pendingChanges]);

  useEffect(() => {
    if (!uuid) {
      setLoading(false);
      return;
    } else {
      try {
        getExistingMap(uuid)
          .then((response) => {
            if (response.success) {
              const { uuid, ...foundData } = JSON.parse(response.data.map_data);
              setMapData(foundData);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {}
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
      <div className="flex gap-4">
        <div>
          <WidgetEditableGrid width={800} height={800} />
          <WidgetScenarios />
        </div>
        <WidgetEditableOptions />
      </div>
    </LayoutComponent>
  );
};

export default WidgetCreate;
