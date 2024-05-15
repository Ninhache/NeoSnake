import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useStoreLastRoute() {
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname !== "/login" &&
      location.pathname !== "/signup" &&
      location.pathname !== "/logout"
    ) {
      localStorage.setItem("lastPath", location.pathname);
    }
  }, [location]);
}
