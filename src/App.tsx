import { BrowserRouter as Router } from "react-router-dom";
import WidgetHeader from "./components/Widgets/WidgetHeader";
import NavBar from "./components/Widgets/WidgetNavbar";

import RouterContent from "./RouterContent";
import WidgetFooter from "./components/Widgets/WidgetFooter";
import "./styles/App.css";
import { AuthContextProvider } from "./components/contexts/AuthContext";

const App: React.FC = () => {
  return (
    <>
      <AuthContextProvider>
        <div className="flex justify-center items-center flex-col">
          <WidgetHeader />
          <Router>
            <NavBar />
            <RouterContent />
            <WidgetFooter />
          </Router>
        </div>
      </AuthContextProvider>
    </>
  );
};

export default App;
