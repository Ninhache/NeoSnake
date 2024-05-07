import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import WidgetHeader from "./components/Widgets/WidgetHeader";
import NavBar from "./components/Widgets/WidgetNavbar";

import WidgetArticle from "./components/Widgets/WidgetArticle";
import WidgetCreate from "./components/Widgets/WidgetCreate";
import WidgetFaq from "./components/Widgets/WidgetFaq";
import WidgetFooter from "./components/Widgets/WidgetFooter";
import WidgetGame from "./components/Widgets/WidgetGame";
import WidgetHome from "./components/Widgets/WidgetLandingPage";
import "./styles/App.css";

const App: React.FC<{}> = ({}) => {
  return (
    <>
      <div className="flex justify-center items-center flex-col">
        <WidgetHeader />
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<WidgetHome />} />
            <Route path="/play" element={<WidgetGame />} />
            <Route path="/create" element={<WidgetCreate />} />
            <Route path="/faq" element={<WidgetFaq />} />
            <Route path="/article/:id" element={<WidgetArticle />} />
          </Routes>
        </Router>
        <WidgetFooter />
      </div>
    </>
  );
};

export default App;
