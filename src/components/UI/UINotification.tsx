import { useState } from "react";
import closeIcon from "../../assets/svg/close_icon.svg";
import infoIcon from "../../assets/svg/info_icon.svg";

type NotificationType = "info" | "error" | "warning";

type Props = {
  children: React.ReactNode;
  type: NotificationType;
};
const UINotification: React.FC<Props> = ({ children, type = "info" }) => {
  const [isOpen, setOpen] = useState<boolean>(true);

  if (!isOpen) {
    return null;
  }

  const colorMap: Record<
    NotificationType,
    { filter: string; backgroundColor: string; borderColor: string }
  > = {
    info: {
      filter:
        "invert(13%) sepia(94%) saturate(5528%) hue-rotate(260deg) brightness(66%) contrast(126%)",
      backgroundColor: "rgb(20,0,150, 0.25)",
      borderColor: "rgb(20,40,150)",
    },
    error: {
      filter:
        "invert(10%) sepia(76%) saturate(5746%) hue-rotate(17deg) brightness(95%) contrast(125%)",
      backgroundColor: "rgb(150,0,0, 0.25)",
      borderColor: "rgb(150,0,0)",
    },
    warning: {
      filter:
        "invert(44%) sepia(73%) saturate(1242%) hue-rotate(36deg) brightness(99%) contrast(101%)",
      backgroundColor: "rgb(150,150,0, 0.25)",
      borderColor: "rgb(150,150,0)",
    },
  };

  const color = colorMap[type];

  return (
    <div
      className="border-2 rounded-lg p-4 flex items-center justify-between "
      style={{
        backgroundColor: color.backgroundColor,
        borderColor: color.borderColor,
      }}
    >
      <div className="flex flex-row items-center gap-2">
        <img
          src={infoIcon}
          alt="info"
          className="h-8 w-8"
          style={{
            filter: color.filter,
          }}
        />
        <h1 className="w-full">
          <b>{children}</b>
          <br></br>
        </h1>
      </div>
      <button onClick={() => setOpen(false)}>
        <img
          src={closeIcon}
          alt="close"
          className="h-8 w-8"
          style={{
            filter: color.filter,
          }}
        />
      </button>
    </div>
  );
};

export default UINotification;
