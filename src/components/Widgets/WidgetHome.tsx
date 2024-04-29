import LayoutComponent from "../layouts/LayoutComponent";

type Props = {};
const WidgetHome: React.FC<Props> = ({ }) => {
    return (
        <LayoutComponent>
            <p className="text-white">Blablabla cobra a été créé en 2024</p>
        </LayoutComponent>
    )
};

export default WidgetHome;