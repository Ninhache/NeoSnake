import UIFaqQuestion from "../UI/UIFaqQuestion";
import LayoutComponent from "../layouts/LayoutComponent";

type Props = {};
const WidgetFaq: React.FC<Props> = ({}) => {
  return (
    <LayoutComponent>
      <h1 className="faq-title">Foire aux questions</h1>
      <UIFaqQuestion title="Que pensez-vous de la situation d'alternant">
        <p>
          Je ne pense pas qu'il y ait de bonne ou de mauvaise situation. Il y a
          des situations qui sont plus ou moins adaptées à chacun. Il est
          important de se sentir bien dans son environnement de travail pour
          être épanoui.
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
