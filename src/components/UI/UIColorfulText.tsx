import React, { useState, useEffect } from "react";

interface Props {
  text: string;
}
const UIColorfulText: React.FC<Props> = ({ text }) => {
  const colors = [
    "text-red-500",
    "text-yellow-500",
    "text-green-500",
    "text-blue-500",
    "text-purple-500",
  ];

  const [currentColor, setCurrentColor] = useState(colors[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentColor((prevColor) => {
        const currentIndex = colors.indexOf(prevColor);
        const nextIndex = (currentIndex + 1) % colors.length;
        return colors[nextIndex];
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={`text-center text-lg font-bold transition-colors duration-300 ${currentColor}`}
    >
      {text}
    </div>
  );
};

export default UIColorfulText;
