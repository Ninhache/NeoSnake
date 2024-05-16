import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useStoreLastRoute() {
  const location = useLocation();

  useEffect(() => {
    console.log("before >", localStorage.getItem("lastPath"));
    if (
      location.pathname !== "/login" &&
      location.pathname !== "/signup" &&
      location.pathname !== "/logout" &&
      location.pathname !== "/account"
    ) {
      localStorage.setItem("lastPath", location.pathname);

      console.log("after   >", localStorage.getItem("lastPath"));
    }
  }, [location]);
}
