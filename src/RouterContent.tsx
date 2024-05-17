import { Navigate, Route, Routes } from "react-router-dom";
import WidgetFaq from "./components/Widgets/WidgetFaq";
import PageAccount from "./components/account/PageAccount.tsx";
import WidgetLogin from "./components/account/WidgetLogin";
import WidgetLogout from "./components/account/WidgetLogout";
import WidgetSignup from "./components/account/WidgetSignup";
import PageCampaign from "./components/campaignComponents/PageCampaign.tsx";
import PageCampaignExplorer from "./components/campaignComponents/PageCampaignExplorer.tsx";
import { EditorContextProvider } from "./components/contexts/EditorContext";
import WidgetCreate from "./components/editableComponents/WidgetCreate";
import { useStoreLastRoute } from "./components/hooks/useStoreLastRoute";
import WidgetArticle from "./components/landingPage/WidgetArticle";
import WidgetHome from "./components/landingPage/WidgetLandingPage";
import "./styles/App.css";

import React, { ReactNode } from "react";
import { useAuth } from "./components/contexts/AuthContext";
import WidgetExplore from "./components/onlineComponents/WidgetExplore";
import WidgetOnline from "./components/onlineComponents/WidgetOnline";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

const RouterContent: React.FC = () => {
  useStoreLastRoute();

  return (
    <>
      <Routes>
        <Route path="/" element={<WidgetHome />} />
        <Route path="/play" element={<PageCampaignExplorer />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <PageAccount />
            </ProtectedRoute>
          }
        />
        <Route path="/explore" element={<WidgetExplore />} />
        <Route path="/campaign/:id?" element={<PageCampaign />} />
        <Route path="/online/:id?" element={<WidgetOnline />} />
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
