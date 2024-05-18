import { NavLink } from "react-router-dom";
import LayoutComponent from "../layouts/LayoutComponent";

const WidgetRestrictedPage: React.FC = () => (
  <LayoutComponent>
    <h1 className="text-3xl font-bold text-amber-400 mb-6 text-center">
      Hey!
      <br></br>
      Want to play our game?
    </h1>

    <div className="border-2 mx-16 mb-8 border-opacity-45 border-gray-500"></div>

    <h2 className="text-xl text-center text-white mb-3">
      Unfortunately, you need to be on a computer to play. We haven't designed
      it for mobile devices yet. (and we don't plan to do it soon)
    </h2>

    <h2 className="text-xl text-center text-white mb-4">
      Feel free to read our articles to learn more about the game or check our
      (still growing) FAQ.
    </h2>

    <div className="border-2 mx-16 my-8 border-opacity-45 border-gray-500"></div>

    <div className="flex justify-center gap-4">
      <button className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
        <NavLink to="/">Read Articles</NavLink>
      </button>
      <button className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-400 transition duration-300">
        <NavLink to="/faq">Visit FAQ</NavLink>
      </button>
    </div>
  </LayoutComponent>
);

export default WidgetRestrictedPage;
