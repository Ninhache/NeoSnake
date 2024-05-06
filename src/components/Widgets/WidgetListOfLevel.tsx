import { useEffect, useState } from "react";
import UILevelSelector from "../UI/UILevelSelector";
import { loadLevelProgress } from "../../lib/localstorage";

type Props = {};
const WidgetListOfLevel: React.FC<Props> = ({}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [levelLength, setLevelLength] = useState<number>(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SNAKE_API_ROUTE}/levels`)
      .then((response) => response.json())
      .then((data) => {
        setLevelLength(data.length);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load levels data", error);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

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
