import {NavLink} from "react-router-dom";

type Props = {
    path: string;
    text: string;
};

const UINavLink: React.FC<Props> = ({ path, text }) => {
    return (
        <NavLink to={path} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>

            {text}
        </NavLink>
    )
};

export default UINavLink;