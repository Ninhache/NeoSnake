
import cobra from '../../assets/cobra.png';

type Props = { };
const WidgetHeader: React.FC<Props> = ({  }) => {
    // // center image
    return (<div className="flex justify-center p-4">
        <img src={cobra} alt="placeholder" />
    </div>)
};

export default WidgetHeader;