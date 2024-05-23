## Neo-Snake

# Installation

Simply install using :

```
https://github.com/Ninhache/PitSnake.git
cd PitSnake
yarn
```

# Setup & Run

You need to create and populate the .env file with the following structure, where I've provided the default value for the API:

```.env
VITE_SNAKE_API_ROUTE=http://localhost:3000
```

There's no particular setup to do, you've access to 2 major commands :

- `yarn dev` starts a local web server with Hot Module Replacement for development
- `yarn build & yarn preview` builds the project, and outputs to the folder `./dist`.. and starts a local web server that serves the built solution from `./dist` for previewing

# _History_

Considering Cobra's company's ambition to make the game universally accessible, I need a tech stack that can efficiently render the game on the web:

- TypeScript for its robust and type-safe code, which helps in maintaining large-scale projects.
- React & Vite to streamline front-end development and ensure a responsive user experience.
- While Canvas is likely sufficient for our current graphic needs, WebGL remains a consideration for more complex visual effects in the future.

So it will be powered by [**React**](https://fr.react.dev/) & [**TypeScript**](https://www.typescriptlang.org/) with [_Vite_](https://vitejs.dev/)

## Final Idea

_that will change sometimes..._

This game is a competitive snake game that requires skill to master. It's inspired by [Trackmania](https://www.ubisoft.com/fr-fr/game/trackmania/trackmania) and [Happy Wheels](https://fr.wikipedia.org/wiki/Happy_Wheels), where the primary goal is "speed". In this game, the objective is to be the fastest at consuming all the fruits in various scenarios.

I also encourage players to express their creativity by designing and sharing their own levels with the community.

This is the final concept chosen after considering various ideas from previous brainstorming sessions.

## Brainstorm Ideas

**Ideas :**

- a snek...
- Obstacles / Enemies
- Different skins (+ custom)
- Boosts (Speed / Growth / ?)
- Solo / Multi

**_Vibing_ Ideas :**

- Mods (that you can write in random languages to modify the game ?)
- Score handling/Leaderboard (+ anti cheat lol)
- Multiplayer / Multiple Snake ?
