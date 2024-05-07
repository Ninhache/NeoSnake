import { EditorContextProvider } from "../contexts/EditorContext";
import LayoutComponent from "../layouts/LayoutComponent";
import WidgetEditableGrid from "./WidgetEditableGrid";
import WidgetEditableOptions from "./WidgetEditableOptions";

import WidgetToolSelector from "./WidgetToolSelector";

const WidgetCreate: React.FC = () => {
  return (
    <LayoutComponent>
      <EditorContextProvider>
        <div className="flex">
          <div>
            <WidgetToolSelector />
            <WidgetEditableGrid width={800} height={800} />
          </div>
          <WidgetEditableOptions />
        </div>
      </EditorContextProvider>
    </LayoutComponent>
  );
};

export default WidgetCreate;
