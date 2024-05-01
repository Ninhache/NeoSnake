## PitSnake

# Installation

Simply install using :  
```
https://github.com/Ninhache/PitSnake.git
cd PitSnake
yarn
```

# Setup & Run

There's no particular setup to do, you've access to 2 major commands :
- `yarn dev` starts a local web server with Hot Module Replacement for development
- `yarn build & yarn preview` builds the project, and outputs to the folder `./dist`.. and starts a local web server that serves the built solution from `./dist` for previewing

# _History_ 

## Tech choice

According to the text i've read, the Cobra's company wants to make his game globally accessible, so, I need something to render it on the Internet :

- TypeScript
- React & Vite
- WebGL ? (Canvas will be enough imo)

So it will be powered by [**React**](https://fr.react.dev/) & [**TypeScript**](https://www.typescriptlang.org/) with [_Vite_](https://vitejs.dev/)

## Final Idea

For a V1 :  
Solo Snake with a Story mode..
Where you go through the levels 1,2,3... (more and more complicated)
Every 5 levels, you're against a BOT (Pit's contender) that's also want to eat fruit (money?).. (so you've to be faster or kill him)

UI, A Left menu to show EVERY levels that's are available (Maybe not EVERY, only a part..)  
\+ special fruits (Thanks @BlueSlime59 for the idea ;))

## Brainstorm Ideas

__Ideas :__
- a snek...
- Obstacles / Ennemies
- Differents skins (+ custom)
- Boosts (Speed / Growth / ?)
- Solo / Multi

__*Vibing* Ideas :__
- Mods (that you can wrote in random langages to modify the game ?)
- Score handling (+ anticheat lol)
- Multiplayer / Multiple Snake ?

------
## Bullshit i've to read so modify 

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

