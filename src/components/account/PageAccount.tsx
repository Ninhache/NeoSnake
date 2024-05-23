import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { OnlinePreview } from "../../@types/ApiType";
import { getCreatedLevel } from "../../lib/services/level.ts";
import UIDropdown from "../UI/UIDropdown.tsx";
import UIPagination from "../UI/UIPagination.tsx";
import UISuspense from "../UI/UISuspense";
import { useAuth } from "../contexts/AuthContext";
import LayoutComponent from "../layouts/LayoutComponent";
import UIPersonalLevelPreview from "./UIPersonalLevelPreview.tsx";

const PageAccount: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [sortDate, setSortDate] = useState("desc" as "asc" | "desc");
  const [difficulty, setDifficulty] = useState(-1);

  const [previewMap, setPreviewMap] = useState<OnlinePreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCreatedLevel({ page, limit, difficulty, sortDate })
      .then((response) => {
        if (response.success) {
          setPreviewMap(response.data);

          setPage(response.pagination.currentPage);
          setLimit(response.pagination.pageSize);
          setTotalPages(response.pagination.totalPages);
          setTotalItems(response.pagination.totalItems);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, limit, difficulty, sortDate]);

  const handleNextPage = () => {
    setPage((currentPage) => Math.min(totalPages, currentPage + 1));
  };

  const handlePrevPage = () => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  };

  return (
    <LayoutComponent>
      <h1 className="text-3xl text-center font-bold my-8">Account</h1>

      <div className="border-2 mx-16 mb-8 border-opacity-45 border-gray-500"></div>
      <div>
        <div className="flex justify-center gap-4">
          {totalItems > 12 && (
            <div className="w-36 ">
              <p className="text-gray-400 italic mb-2">Max Items per page</p>
              <UIDropdown
                items={["12", "24", "36", "48", "60"]}
                onSelect={(str) => {
                  setLimit(parseInt(str, 10));
                }}
              />
            </div>
          )}

          {previewMap.length > 0 && (
            <>
              <div className="w-36">
                <p className="text-gray-400 italic mb-2">Sort by date</p>
                <UIDropdown
                  items={["Latest Update", "Oldest Update"]}
                  onSelect={(str) => {
                    setSortDate(str === "Oldest Update" ? "asc" : "desc");
                  }}
                />
              </div>
              <div className="w-36">
                <p className="text-gray-400 italic mb-2">Difficulty</p>
                <UIDropdown
                  items={["All", "1", "2", "3", "4", "5"]}
                  onSelect={(str) => {
                    if (str === "All") {
                      setDifficulty(-1);
                    } else {
                      setDifficulty(parseInt(str, 10));
                    }
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4">My creations</h1>
      {totalItems > limit && (
        <div className="flex justify-end items-center mr-16 mb-4">
          <p className="mr-2 text-gray-400">{totalItems} maps in total</p>
          <UIPagination
            page={page}
            totalPages={totalPages}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
          />
        </div>
      )}
      <div className="mb-8">
        {loading ? (
          <UISuspense />
        ) : (
          <div className="flex gap-2 mb-4 flex-wrap justify-center">
            {previewMap.length === 0 ? (
              <div className="text-center">
                No levels found, go to the{" "}
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
                      setPreviewMap((prev) =>
                        prev.filter((p) => p.id !== uuid)
                      );
                    }}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <button
        className="bg-red-700 bg-opacity-70 text-white py-2 px-12 rounded-lg"
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
