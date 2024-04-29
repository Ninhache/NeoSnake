
import cobra from '../../assets/cobra.png';

type Props = {};
const WidgetHeader: React.FC<Props> = ({ }) => {
    return (
        <header className="flex justify-center p-4">
            <img src={cobra} alt="placeholder" />
        </header>
    )
};

export default WidgetHeader;