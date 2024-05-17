import UIFaqQuestion from "../UI/UIFaqQuestion";
import LayoutComponent from "../layouts/LayoutComponent";

type Props = {};
const WidgetFaq: React.FC<Props> = ({}) => {
  return (
    <LayoutComponent>
      <h1 className="text-3xl text-center font-bold my-8 text-amber-400">
        Frequently Asked Questions
      </h1>
      <div className="border-2 mx-16 mb-8 border-opacity-45 border-gray-500"></div>

      <UIFaqQuestion title="Que pensez-vous de la situation d'alternant">
        <p>
          I don't think there is a good or bad situation. There are situations
          that are more or less suitable for each person. It is important to
          feel good in your work environment to be fulfilled.
        </p>
      </UIFaqQuestion>
      <UIFaqQuestion title="Un avis honnête sur la société ?">
        <p>Non</p>
      </UIFaqQuestion>
      <UIFaqQuestion title="Un pit' mot pour finir ?">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </UIFaqQuestion>
    </LayoutComponent>
  );
};

export default WidgetFaq;
