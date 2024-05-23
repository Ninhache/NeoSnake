import { useState } from "react";

type NotificationType = "info" | "error" | "warning";

type Props = {
  children: React.ReactNode;
  type: NotificationType;
  className?: string;
  closeable?: boolean;
};
const UINotification: React.FC<Props> = ({
  children,
  type = "info",
  className,
  closeable = true,
}) => {
  const [isOpen, setOpen] = useState<boolean>(true);

  if (!isOpen) {
    return null;
  }

  const colorMap: Record<
    NotificationType,
    { backgroundColor: string; borderColor: string; textColor: string }
  > = {
    info: {
      backgroundColor: "bg-blue-800 bg-opacity-30",
      borderColor: "border-blue-950",
      textColor: "text-blue-950",
    },
    error: {
      backgroundColor: "bg-red-800 bg-opacity-30",
      borderColor: "border-red-500",
      textColor: "text-red-500",
    },
    warning: {
      backgroundColor: "bg-yellow-700 bg-opacity-30",
      borderColor: "border-yellow-500",
      textColor: "text-yellow-500",
    },
  };

  const color = colorMap[type];

  return (
    <div
      className={`border-2 rounded-lg p-4 flex items-center justify-between ${color.backgroundColor} ${color.borderColor} ${className}`}
    >
      <div className="flex flex-row items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className={`w-8 h-8 ${color.textColor}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>

        <h1 className="w-full">
          <b>{children}</b>
          <br></br>
        </h1>
      </div>
      {closeable && (
        <button onClick={() => setOpen(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className={`w-8 h-8 ${color.textColor}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default UINotification;
