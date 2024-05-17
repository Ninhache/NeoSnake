import {useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {Preview} from "../../@types/ApiType";
import {getCreatedLevel} from "../../lib/level";
import UIPersonalLevelPreview from "./UIPersonalLevelPreview.tsx";
import UISuspense from "../UI/UISuspense";
import {useAuth} from "../contexts/AuthContext";
import LayoutComponent from "../layouts/LayoutComponent";

type Props = {};
const PageAccount: React.FC<Props> = ({}) => {
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
          {previewMap.length === 0 ? (
            <div className="text-center">
              You don't have created levels yet, go to the{" "}
              <NavLink to={"/create"} className={`text-blue-500 font-bold`}>
                Create section
              </NavLink>{" "}
              to create one !
            </div>
          ) : (
            previewMap.map((map) => (
              <div key={map.id}>
                <UIPersonalLevelPreview
                  key={map.id}
                  scenario={map}
                  onDelete={(uuid: string) => {
                    setPreviewMap((prev) => prev.filter((p) => p.id !== uuid));
                  }}
                />
              </div>
            ))
          )}
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

export default PageAccount;
