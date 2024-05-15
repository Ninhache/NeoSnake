import { NavLink } from "react-router-dom";
import { ScenariosName } from "../../@types/ApiType";

type Props = {
  scenario: ScenariosName;
};
const UIScenarioPreview: React.FC<Props> = ({ scenario }) => {
  return (
    <div
      className={`border-2 ${
        scenario.completed ? "border-blue-600" : "border-black"
      }`}
    >
      <NavLink to={`/game/${scenario.id}`}>{scenario.name}</NavLink>
    </div>
  );
};

export default UIScenarioPreview;
