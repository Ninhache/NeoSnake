
import { Route, BrowserRouter as Router, Routes, } from 'react-router-dom'
import NavBar from './components/Widgets/WidgetNavbar'
import WidgetHeader from './components/Widgets/WidgetHeader'

import './styles/App.css'
import GameCanvas from './components/GameCanvas'
import WidgetFooter from './components/Widgets/WidgetFooter'
import WidgetGame from './components/Widgets/WidgetGame'

const App: React.FC<{ }> = ({ }) => {
  return (
      <>
      <WidgetHeader />
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<div>blablabla cobra a été fondée en 2024</div>} />
          <Route path="/play" element={<WidgetGame />} />
          <Route path="/faq" element={<div>faq</div>} />
        </Routes>
      </Router>
      <WidgetFooter />
      </>
  )
}

export default App
