import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UISuspense from "../UI/UISuspense";
import { useAuth } from "../contexts/AuthContext";
import LayoutComponent from "../layouts/LayoutComponent";

const WidgetLogout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    const lastPath = localStorage.getItem("lastPath") || "/";
    navigate(lastPath);
  }, []);

  return (
    <LayoutComponent>
      <UISuspense></UISuspense>
    </LayoutComponent>
  );
};

export default WidgetLogout;
