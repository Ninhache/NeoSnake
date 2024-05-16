import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Preview } from "../../@types/ApiType";
import { getCreatedLevel } from "../../lib/level";
import UIScenarioPersonnalPreview from "../UI/UIScenarioPersonnalPreview";
import UISuspense from "../UI/UISuspense";
import { useAuth } from "../contexts/AuthContext";
import LayoutComponent from "../layouts/LayoutComponent";

type Props = {};
const WidgetAccount: React.FC<Props> = ({}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [previewMap, setPreviewMap] = useState<Preview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCreatedLevel()
      .then((response) => {
        if (response.success) {
          setPreviewMap(response.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <LayoutComponent>
      <h1 className="text-3xl text-center font-bold">Account</h1>

      <h1 className="text-3xl font-bold mb-4">My creation</h1>
      {loading ? (
        <UISuspense />
      ) : (
        <div className="flex gap-2 mb-4">
          {previewMap.map((map) => (
            <div key={map.id}>
              <UIScenarioPersonnalPreview
                key={map.id}
                scenario={map}
                onDelete={(uuid: string) => {
                  setPreviewMap((prev) => prev.filter((p) => p.id !== uuid));
                }}
              />
            </div>
          ))}
        </div>
      )}

      <button
        className="bg-red-700 bg-opacity-70 text-white py-3 px-12 rounded-lg"
        onClick={() => {
          logout();
          navigate(localStorage.getItem("lastPath") || "/");
        }}
      >
        Logout
      </button>
    </LayoutComponent>
  );
};

export default WidgetAccount;
