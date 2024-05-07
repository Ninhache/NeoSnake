import { useEffect, useState } from "react";
import UILevelSelector from "../UI/UILevelSelector";
import { loadLevelProgress } from "../../lib/localstorage";
import UISuspense from "../UI/UISuspense";
import { SnakeMapType } from "../../@types/MapTypes";
import UINotification from "../UI/UINotification";

type Props = {};
const WidgetListOfLevel: React.FC<Props> = ({}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [levelLength, setLevelLength] = useState<number>(0);

  const [jsonState, setJsonState] = useState<SnakeMapType>("LOADING");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SNAKE_API_ROUTE}/level`)
      .then((response) => response.json())
      .then((data) => {
        setLevelLength(data.length);
        setLoading(false);
        setJsonState("LOADED");
      })
      .catch((error) => {
        setJsonState("ERROR");
        console.error("Failed to load levels data", error);
      });
  }, []);

  if (loading)
    return (
      <>
        {import.meta.env.DEV && jsonState === "ERROR" && (
          <UINotification type="error" className="m-2">
            *DEV* Check if the API is running
          </UINotification>
        )}
        <UISuspense />
      </>
    );

  const maxLevel = loadLevelProgress();

  return (
    <div className="p-2">
      {Array.from({ length: levelLength }, (_, i) => (
        <UILevelSelector key={i} levelId={i + 1} disabled={i + 1 > maxLevel} />
      ))}
    </div>
  );
};

export default WidgetListOfLevel;
