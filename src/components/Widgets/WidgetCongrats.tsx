import { useEffect, useState } from "react";
import { checkAllLevelCompletions } from "../../lib/services/level";
import UISuspense from "../UI/UISuspense";
import { useAuth } from "../contexts/AuthContext";
import LayoutComponent from "../layouts/LayoutComponent";
import { useNavigate } from "react-router-dom";

import "../../styles/congrats.css";

const WidgetCongrats: React.FC = () => {
  const { username } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAllLevelCompletions()
      .then((response) => {
        if (response.success) {
          if (!response.allCompleted) {
            navigate("/play");
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <LayoutComponent>
        <UISuspense />
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      <h1 className="text-3xl text-center font-bold my-8 text-amber-400">
        Congrats {username} you did it!
      </h1>

      <div className="border-2 mx-16 mb-8 border-opacity-45 border-gray-500"></div>

      <p className="text-center text-3xl ">
        You have reached the end of the game! 🎉
      </p>

      <p className="text-center text-2xl italic text-gray-400 teaser">
        For the moment ... <span className="not-italic">🙄</span>
      </p>

      <p className="text-center text-3xl mt-5">
        Thank you for playing Neo-Snake! 🐍
      </p>
    </LayoutComponent>
  );
};

export default WidgetCongrats;
