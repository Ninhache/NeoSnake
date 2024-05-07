import UINavLink from "../UI/UINavLink";
import LayoutComponent from "../layouts/LayoutComponent";

const NavBar: React.FC = () => {
  return (
    <LayoutComponent>
      <nav className="text-white md:rounded-lg ">
        <ul className="flex gap-10 items-center justify-center">
          <li>
            <UINavLink path="/" text="Accueil" />
          </li>
          <li>
            <UINavLink path="/play" text="Jouer" />
          </li>
          <li>
            <UINavLink path="/create" text="Créer" />
          </li>
          <li>
            <UINavLink path="/faq" text="FAQ" />
          </li>
        </ul>
      </nav>
    </LayoutComponent>
  );
};

export default NavBar;
