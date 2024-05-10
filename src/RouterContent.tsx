import { Route, Routes } from "react-router-dom";
import { useStoreLastRoute } from "./components/hooks/useStoreLastRoute";
import "./styles/App.css";
import WidgetHome from "./components/Widgets/WidgetLandingPage";
import WidgetGame from "./components/Widgets/WidgetGame";
import WidgetCreate from "./components/Widgets/WidgetCreate";
import WidgetFaq from "./components/Widgets/WidgetFaq";
import WidgetLogin from "./components/Widgets/WidgetLogin";
import WidgetSignup from "./components/Widgets/WidgetSignup";
import WidgetArticle from "./components/Widgets/WidgetArticle";
import WidgetLogout from "./components/Widgets/WidgetLogout";
import { EditorContextProvider } from "./components/contexts/EditorContext";

const RouterContent: React.FC<{}> = ({}) => {
  useStoreLastRoute();

  return (
    <>
      <Routes>
        <Route path="/" element={<WidgetHome />} />
        <Route path="/play" element={<WidgetGame />} />
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
