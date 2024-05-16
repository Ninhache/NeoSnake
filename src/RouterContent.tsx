import { Route, Routes } from "react-router-dom";
import WidgetAccount from "./components/Widgets/WidgetAccount";
import WidgetArticle from "./components/Widgets/WidgetArticle";
import WidgetCampaignExplorer from "./components/Widgets/WidgetCampaignExplorer";
import WidgetCreate from "./components/Widgets/WidgetCreate";
import WidgetFaq from "./components/Widgets/WidgetFaq";
import WidgetGame from "./components/Widgets/WidgetGame";
import WidgetHome from "./components/Widgets/WidgetLandingPage";
import WidgetLogin from "./components/Widgets/WidgetLogin";
import WidgetLogout from "./components/Widgets/WidgetLogout";
import WidgetSignup from "./components/Widgets/WidgetSignup";
import { EditorContextProvider } from "./components/contexts/EditorContext";
import { useStoreLastRoute } from "./components/hooks/useStoreLastRoute";
import "./styles/App.css";

import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import WidgetExplore from "./components/Widgets/WidgetExplore";
import { useAuth } from "./components/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

const RouterContent: React.FC<{}> = ({}) => {
  useStoreLastRoute();

  return (
    <>
      <Routes>
        <Route path="/" element={<WidgetHome />} />
        <Route path="/play" element={<WidgetCampaignExplorer />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <WidgetAccount />
            </ProtectedRoute>
          }
        />
        <Route path="/explore" element={<WidgetExplore />} />
        <Route path="/game/:id?" element={<WidgetGame />} />
        <Route
          path="/create/:uuid?"
          element={
            <EditorContextProvider>
              <WidgetCreate />
            </EditorContextProvider>
          }
        />
        <Route path="/faq" element={<WidgetFaq />} />
        <Route path="/login" element={<WidgetLogin />} />
        <Route path="/logout" element={<WidgetLogout />} />
        <Route path="/signup" element={<WidgetSignup />} />
        <Route path="/article/:id" element={<WidgetArticle />} />
      </Routes>
    </>
  );
};

export default RouterContent;
