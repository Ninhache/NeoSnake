import React, { useState, ChangeEvent } from "react";

interface DropdownProps {
  items: string[];
  label: string;
  onSelect: (selectedItem: string) => void;
}

const UIDropdown: React.FC<DropdownProps> = ({ items, onSelect }) => {
  if (items.length === 0) {
    throw new Error("Items array cannot be empty");
  }
  const [selectedItem, setSelectedItem] = useState(items[0] || "");

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setSelectedItem(newValue);
    onSelect(newValue);
  };

  return (
    <div className="w-full">
      <select
        value={selectedItem}
        onChange={handleChange}
        className="text-black bg-white hover:bg-gray-200 text-center w-full h-8 rounded-lg"
      >
        {items.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UIDropdown;
