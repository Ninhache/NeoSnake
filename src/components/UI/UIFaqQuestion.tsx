import {useState} from "react";
import chevron from "../../assets/svg/chevron-right-solid.svg";

type Props = {
  title: string;
  children: React.ReactNode;
};

const UIFaqQuestion: React.FC<Props> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-900 text-white border-2 border-solid border-gray-700 border-w my-4 rounded-lg">
      <div
        className="cursor-pointer flex justify-between p-4 font-bold"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <img
          src={chevron}
          alt="chevron"
          width={14}
          height={14}
          className={`transform ${
            isOpen ? "rotate-90" : ""
          } transition-transform duration-300 ease-in-out`}
        />
      </div>

      <div
        className={`${
          isOpen ? "max-h-96" : "max-h-0"
        } transition-max-height duration-300 ease bg-gray-900  border-blue-950 rounded-b-lg overflow-hidden`}
      >
        <div className={`border-blue-950 border-t-2 p-4`}>{children}</div>
      </div>
    </div>
  );
};

export default UIFaqQuestion;
