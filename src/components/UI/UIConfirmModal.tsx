import React, { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) => {
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
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10 "
      onClick={onClose}
    >
      <div className="bg-gray-800 bg-opacity-95 p-4 rounded-lg">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete "{itemName}"?</p>
        <div className="flex justify-around mt-4">
          <button
            onClick={onConfirm}
            className="bg-red-700 bg-opacity-70 text-white py-3 px-12 rounded-lg"
            ref={(ref) => ref?.focus()}
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-700 bg-opacity-70 text-white py-3 px-12 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
