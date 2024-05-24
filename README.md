## Neo-Snake

This is the frontend part of the project, look at the [backend repo](https://github.com/Ninhache/NeoSnakeApi.git)

# Installation

Simply install using :

```
git clone https://github.com/Ninhache/NeoSnake.git
cd NeoSnake
yarn
```

# Setup & Run

**Environment Variables:**

**Then** you need to create a `.env` file at the root of the project with the following skeleton :

```.env
VITE_API_URL=http://localhost:3000
```

> You can also use the hosted prod. API route, which is `https://snakeapi.ninhache.fr`
> as `VITE_SNAKE_API_ROUTE=https://snakeapi.ninhache.fr`

There's no more particular setup to do, you've access to 2 major commands :

- `yarn dev` : Starts a local web server with Hot Module Replacement
- `yarn prod` : Builds the project, and outputs to the folder `./dist`.. and starts a local web server that serves the built solution

# _History_

Considering Cobra's company's ambition to make the game universally accessible, I need a tech stack that can efficiently render the game on the web:

- TypeScript for its robust and type-safe code, which helps in maintaining large-scale projects.
- React & Vite to streamline front-end development and ensure a responsive user experience.
- While Canvas is likely sufficient for our current graphic needs, WebGL remains a consideration for more complex visual effects in the future.

So it will be powered by [**React**](https://fr.react.dev/) & [**TypeScript**](https://www.typescriptlang.org/) with [_Vite_](https://vitejs.dev/)

## Final Idea

This game is a competitive snake game that requires skill to master. It's inspired by [Trackmania](https://www.ubisoft.com/fr-fr/game/trackmania/trackmania) and [Happy Wheels](https://fr.wikipedia.org/wiki/Happy_Wheels), where the primary goal are "speed" and "skills".

I also encourage players to express their creativity by designing and sharing their own levels with the community.

This is the final concept chosen after considering various ideas from previous brainstorming sessions.

## Improvement Track

Given that the project had a deadline, certain features had to be limited. For instance, the "leaderboard" had to be canceled due to the inability to validate each player's times. The system that was retained is therefore simpler, with a time associated with a map and a user. I've a potential solution but I needed more time to develop + I wasnt sure it could be "that" strong

Talking about that, some requests are too large and need to be compressed. I tried this, and it was working well. However, I needed to conduct benchmarks before deploying it, but I was too busy to do so..

If we consider that the general style needs to be revisited, we cannot overlook the performance of HTML canvases. Switching to WebGL could solve many of these issues.

What is certain is that if I were to start over, I would definitely write more tests to validate certain functions, but I think I would also review a significant part of the data model. I'm not too sure how the game functions currently, even though it works well.
