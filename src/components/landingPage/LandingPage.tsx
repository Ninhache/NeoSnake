import { useEffect } from "react";
import { NavLink } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const LandingPageModal: React.FC<Props> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 bg-opacity-95 p-8 rounded-lg text-xl border-4 border-red-500 border-opacity-75"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Welcome to V1 ! 🥳</h2>

        <div className="border-2 mx-8 my-4 border-opacity-45 border-gray-500"></div>

        <ul>
          <li>- 10 levels Campaign !</li>
          <li>- An editor to create your own</li>
          <li>- A billion possibilities</li>
        </ul>

        <div className="border-2 mx-8 my-4 border-opacity-45 border-gray-500"></div>

        <div className="flex justify-center p-2 bg-gray-900 bg-opacity-70 hover:bg-opacity-100 font-bold rounded-lg mt-4 cursor-pointer">
          <NavLink to="/play">Ready to play ?</NavLink>
        </div>
      </div>
    </div>
  );
};

export default LandingPageModal;
