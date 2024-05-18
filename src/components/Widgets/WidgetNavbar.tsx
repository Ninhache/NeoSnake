import { useEffect, useState } from "react";
import UINavLink from "../UI/UINavLink";
import { useAuth } from "../contexts/AuthContext";
import LayoutComponent from "../layouts/LayoutComponent";

const NavBar: React.FC = () => {
  const { username } = useAuth();
  const [isMobile, _] = useState(window.innerWidth < 768);

  useEffect(() => {}, [username]);

  return (
    <LayoutComponent>
      <nav className="text-white md:rounded-lg flex justify-between">
        <br></br>
        <ul className="flex gap-10 items-center justify-center">
          <li>
            <UINavLink path="/" text="Home" />
          </li>
          <li>
            <UINavLink path="/play" text="Play" />
          </li>
          {!isMobile && (
            <>
              <li>
                <UINavLink path="/explore" text="Explore" />
              </li>
              <li>
                <UINavLink path="/create" text="Create" />
              </li>
            </>
          )}
          <li>
            <UINavLink path="/faq" text="FAQ" />
          </li>
        </ul>
        <div className="mr-2">
          {!isMobile && (
            <div className="flex gap-4 items-center">
              <UINavLink
                path={username ? "/account" : "/login"}
                text={username ? `${username}` : "Login"}
              />
            </div>
          )}
        </div>
      </nav>
    </LayoutComponent>
  );
};

export default NavBar;
