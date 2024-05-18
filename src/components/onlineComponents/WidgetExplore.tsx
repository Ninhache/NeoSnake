import { useEffect, useState } from "react";
import { OnlinePreview } from "../../@types/ApiType";
import { Nullable } from "../../@types/NullableType";
import { getOnlineCreatedLevels } from "../../lib/level";
import UIDropdown from "../UI/UIDropdown";
import UIPagination from "../UI/UIPagination";
import UITextInput from "../UI/UITextInput";
import LayoutComponent from "../layouts/LayoutComponent";
import UIScenarioExplorePreview from "./UIScenarioExplorePreview";

const WidgetExplore: React.FC = () => {
  const [levels, setLevels] = useState<OnlinePreview[]>([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [sortDate, setSortDate] = useState("desc" as "asc" | "desc");
  const [difficulty, setDifficulty] = useState(-1);

  const [debouncedCreatorName, setDebouncedCreatorName] = useState("");
  const [creatorName, setCreatorName] = useState("");

  useEffect(() => {
    getOnlineCreatedLevels({
      difficulty,
      limit,
      page,
      creatorName,
      sortDate,
    }).then((response) => {
      if (response.success) {
        setLevels(response.data);

        setPage(response.pagination.currentPage);
        setLimit(response.pagination.pageSize);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      }
    });
  }, [page, limit, difficulty, debouncedCreatorName, sortDate]);

  const handleNextPage = () => {
    setPage((currentPage) => Math.min(totalPages, currentPage + 1));
  };

  const handlePrevPage = () => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  };

  const [timeoutId, setTimeoutId] = useState<Nullable<number>>(null);
  const handleCreatorNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCreatorName(event.target.value);

    if (timeoutId) clearTimeout(timeoutId); // Clear the existing timeout

    const newTimeoutId = setTimeout(() => {
      setDebouncedCreatorName(event.target.value.trim());
    }, 1000); // 1-second delay

    setTimeoutId(newTimeoutId);
  };

  return (
    <LayoutComponent>
      <h1 className="text-3xl text-center font-bold my-8">Explore</h1>
      <div className="border-2 mx-16 my-4 border-opacity-45 border-gray-500"></div>

      <div>
        <div className="flex justify-center gap-4">
          <div className="w-36">
            <p className="text-gray-400 italic mb-2">Sort by date</p>
            <UIDropdown
              items={["Ascend", "Descend"]}
              onSelect={(str) => {
                setSortDate(str === "Ascend" ? "asc" : "desc");
              }}
            />
          </div>

          <div className="w-36">
            <p className="text-gray-400 italic mb-2">Difficulty</p>
            <UIDropdown
              items={["None", "1", "2", "3", "4", "5"]}
              onSelect={(str) => {
                if (str === "None") {
                  setDifficulty(-1);
                } else {
                  setDifficulty(parseInt(str, 10));
                }
              }}
            />
          </div>

          <div className="w-36 ">
            <p className="text-gray-400 italic mb-2">Max Items per page</p>
            <UIDropdown
              items={["12", "24", "36", "48", "60"]}
              onSelect={(str) => {
                setLimit(parseInt(str, 10));
              }}
            />
          </div>

          <div className="border-l-2 border-gray-500"></div>

          <div className="w-64 flex self-end">
            <UITextInput
              handleChange={handleCreatorNameChange}
              placeholder="Creator Name"
              value={creatorName}
            />
          </div>
        </div>
      </div>

      <div className="border-2 mx-16 my-4 border-opacity-45 border-gray-500"></div>
      <div className="flex flex-col justify-center">
        {levels.length === 0 ? (
          <div className="text-center w-full text-gray-500 italic">
            <p>No levels found</p>
          </div>
        ) : (
          <>
            <div className="flex justify-end items-center mr-16 mb-4">
              <p className="mr-2 text-gray-400">{totalItems} maps in total</p>
              <UIPagination
                page={page}
                totalPages={totalPages}
                onNext={handleNextPage}
                onPrev={handlePrevPage}
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {levels.map((level) => (
                <UIScenarioExplorePreview key={level.id} scenario={level} />
              ))}
            </div>
            <div className="flex justify-end mr-16 mt-4">
              <p className="mr-2 text-gray-400">{totalItems} maps in total</p>
              <UIPagination
                page={page}
                totalPages={totalPages}
                onNext={handleNextPage}
                onPrev={handlePrevPage}
              />
            </div>
          </>
        )}
      </div>
    </LayoutComponent>
  );
};

export default WidgetExplore;
