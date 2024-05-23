import UIFaqQuestion from "../UI/UIFaqQuestion";
import LayoutComponent from "../layouts/LayoutComponent";

const WidgetFaq: React.FC = () => {
  return (
    <LayoutComponent>
      <h1 className="text-3xl text-center font-bold my-8 text-amber-400">
        Frequently Asked Questions
      </h1>

      <div className="border-2 mx-16 mb-8 border-opacity-45 border-gray-500"></div>

      <UIFaqQuestion title={`What is Neo-Snake?`}>
        <p>
          Neo-Snake is a speedrun game named after its creator, "Neo", and
          symbolizes a new or revolutionary take on the classic Snake game. In
          Neo-Snake, players can create their own levels and share them with the
          community. The main objective is to complete these levels as quickly
          as possible. The term 'neo', meaning new, emphasizes that Neo-Snake
          aims to revolutionize the traditional gameplay experience. The game is
          currently in its beta phase.
        </p>
      </UIFaqQuestion>

      <UIFaqQuestion title={`What are the inspirations for the game?`}>
        <p>
          The game is inspired by the classic Snake game and the trackmania
          community.
          <br />
          The speedrun is the main focus of the game.
        </p>
      </UIFaqQuestion>

      <UIFaqQuestion
        title={`A "snake speedrun"? But where does this crazy idea come from?`}
      >
        <p>
          I don't think there is a good or bad situation. There are situations
          that are more or less suitable for each person. It is important to
          feel good in your work environment to be fulfilled.
        </p>
      </UIFaqQuestion>

      <UIFaqQuestion
        title={`Speedrun means competition, do we gain something?`}
      >
        <p>
          Yoo, here's a crazy question! First of all, it's only a beta; there's
          nothing to win. We haven't planned to create a competitive scene for
          the game yet, so let's wait until the beta ends for now.
        </p>
      </UIFaqQuestion>

      <UIFaqQuestion title={`Will the beta end one day to make way for a V1?`}>
        <p>
          Yes, probably, but we don't have a specific timeline yet. We are
          currently collecting feedback and improving the game. We will keep you
          updated! 🤠
        </p>
      </UIFaqQuestion>

      <UIFaqQuestion title={`What are your plans for the future?`}>
        <p>
          Firstly, we aim to enhance the editor as the user experience is
          currently lacking. Additionally, we plan to introduce more features to
          the game and improve the graphics.
        </p>
      </UIFaqQuestion>
    </LayoutComponent>
  );
};

export default WidgetFaq;
