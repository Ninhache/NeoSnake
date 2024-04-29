import GameCanvas from '../GameCanvas';
import LayoutComponent from '../layouts/LayoutComponent';

const WidgetGame: React.FC = () => {
  return (
    <LayoutComponent>
      <GameCanvas width={800} height={800} />
    </LayoutComponent>
  );
};

export default WidgetGame;
