import React from "react";

interface TextInputProps {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  placeholder?: string;
}

const UITextInput: React.FC<TextInputProps> = ({
  value,
  placeholder = "Placeholder text",
  handleChange,
  maxLength,
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="text-black w-full h-8 rounded-lg text-center"
      maxLength={maxLength}
    />
  );
};

export default UITextInput;
