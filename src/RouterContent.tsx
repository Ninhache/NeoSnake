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

import React, { ReactNode, useState } from "react";
import WidgetRestrictedPage from "./components/Widgets/WidgetRestrictedPage.tsx";
import PageProfile from "./components/account/PageProfile.tsx";
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

const RestrictedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isMobile, _] = useState(window.innerWidth < 1280);
  return isMobile ? <WidgetRestrictedPage /> : <>{children}</>;
};

const RouterContent: React.FC = () => {
  useStoreLastRoute();

  return (
    <>
      <Routes>
        <Route path="/" element={<WidgetHome />} />

        <Route path="/faq" element={<WidgetFaq />} />
        <Route path="/article/:id" element={<WidgetArticle />} />
        <Route
          path="/play"
          element={
            <RestrictedRoute>
              <PageCampaignExplorer />
            </RestrictedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <RestrictedRoute>
              <ProtectedRoute>
                <PageAccount />
              </ProtectedRoute>
            </RestrictedRoute>
          }
        />
        <Route
          path="/profile/:username?"
          element={
            <RestrictedRoute>
              <PageProfile />
            </RestrictedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <RestrictedRoute>
              <WidgetExplore />
            </RestrictedRoute>
          }
        />
        <Route
          path="/campaign/:id?"
          element={
            <RestrictedRoute>
              <PageCampaign />
            </RestrictedRoute>
          }
        />
        <Route
          path="/online/:id?"
          element={
            <RestrictedRoute>
              <WidgetOnline />
            </RestrictedRoute>
          }
        />
        <Route
          path="/create/:uuid?"
          element={
            <RestrictedRoute>
              <EditorContextProvider>
                <WidgetCreate />
              </EditorContextProvider>
            </RestrictedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <RestrictedRoute>
              <WidgetLogin />
            </RestrictedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <RestrictedRoute>
              <WidgetLogout />
            </RestrictedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RestrictedRoute>
              <WidgetSignup />
            </RestrictedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default RouterContent;
