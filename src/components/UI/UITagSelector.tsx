import React, { useEffect, useRef, useState } from "react";
import { capitalize } from "../../lib/text";

interface Props {
  tags: string[];
  selectedTags: string[];
  onTagChange: (tag: string) => void;
}

const UITagSelector: React.FC<Props> = ({
  tags,
  selectedTags,
  onTagChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const [searchTerm, setSearchTerm] = useState("");
  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelection = (tag: string) => {
    onTagChange(tag);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex justify-between">
        <button
          onClick={toggleDropdown}
          className="px-4 py-2 font-bold text-white bg-red-500 hover:bg-red-600 rounded-md shadow flex gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`w-6 h-6 transition-transform duration-300 ${
              isOpen ? "-rotate-45" : ""
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Tags
          {selectedTags.length > 0 && (
            <span className="bg-gray-700 text-white font-bold px-2 rounded-full">
              {selectedTags.length}
            </span>
          )}
        </button>
      </div>

      <div
        className={`absolute left-0 w-48 bg-gray-700 border border-gray-300 shadow-lg rounded-md z-10
        transition-opacity duration-300 ease-out
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <div className="flex gap-2 items-center border-b rounded-t-md border-gray-300 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>

          <input
            type="text"
            ref={(input) => input && input.focus()}
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white font-bold focus:outline-none rounded-md"
          />
        </div>
        <ul>
          {filteredTags.length === 0 && (
            <li className="p-2 text-gray-300">No tags found</li>
          )}
          {filteredTags.map((tag, index) => (
            <li
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              <label
                onClick={() => handleSelection(tag)}
                className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 hover:bg-opacity-20"
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-sm border-2 ${
                    selectedTags.includes(tag)
                      ? "bg-red-500 border-red-600"
                      : "border-gray-300"
                  }`}
                >
                  {selectedTags.includes(tag) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-white"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 011.414 1.414l-8 8a1 1 0 01-1.414 0l-4-4A1 1 0 116.707 9.293L9 11.586l7.293-7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="flex-1">{capitalize(tag)}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UITagSelector;
