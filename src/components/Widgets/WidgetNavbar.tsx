import { useEffect } from "react";
import UINavLink from "../UI/UINavLink";
import { useAuth } from "../contexts/AuthContext";
import LayoutComponent from "../layouts/LayoutComponent";

const NavBar: React.FC = () => {
  const { username } = useAuth();
  useEffect(() => {}, [username]);

  return (
    <LayoutComponent>
      <nav className="text-white md:rounded-lg flex justify-between">
        <br></br>
        <ul className="flex gap-10 items-center justify-center">
          <li>
            <UINavLink path="/" text="Accueil" />
          </li>
          <li>
            <UINavLink path="/play" text="Jouer" />
          </li>
          <li>
            <UINavLink path="/explore" text="Explorer" />
          </li>
          <li>
            <UINavLink path="/create" text="Créer" />
          </li>
          <li>
            <UINavLink path="/faq" text="FAQ" />
          </li>
        </ul>
        <div className="mr-2">
          <UINavLink
            path={username ? "/account" : "/login"}
            text={username ? `${username}` : "Se connecter"}
          />
        </div>
      </nav>
    </LayoutComponent>
  );
};

export default NavBar;
