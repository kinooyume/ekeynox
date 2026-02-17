# ekeynox

Typing game inspired by [monkeytype](https://monkeytype.com/), built with SolidJS.

[![SolidJS](https://img.shields.io/badge/SolidJS-1.9-2C4F7C?logo=solid&logoColor=white)](https://www.solidjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)

[Live](https://ekeynox.kinoo.dev)


## Getting Started

```bash
git clone https://github.com/kinooyume/ekeynox.git
cd ekeynox
pnpm install
```

## Commands

| Command | Action |
|---------|--------|
| `pnpm --filter front dev` | Dev server (vinxi) |
| `pnpm --filter front build` | Production build |
| `pnpm --filter front test` | Run tests (vitest) |
| `pnpm --filter front eslint` | Lint |


## Game Modes

| Mode | Alias | Goal |
|------|-------|------|
| Speed | Monkey | Type a set number of words as fast as possible |
| Timer | Bunny | Type as many words as you can before time runs out |

**Speed** params: 10 / 25 / 50 / 100 words

**Timer** params: 10s / 30s / 1m / 2m

Both modes support words (top 1k), quotes, or custom text in English and French.


## Features

- Light / dark theme
- QWERTY and AZERTY keyboard layouts
- English and French (UI + content)
- Virtual keyboard with key highlighting
- Post-game stats: WPM, accuracy, consistency, per-key breakdown
- Charts: speed over time, accuracy doughnut, word-level WPM, character stats


## Tech Stack

**Core**: SolidJS, SolidStart, TypeScript

**UI**: solid-styled (CSS-in-JS), Anime.js, Chart.js

**Forms**: Modular Forms + Zod

**Dev**: pnpm, Vitest, ESLint, Cocogitto


## Project Structure

```
packages/
  common/             shared types
  front/              SolidStart app
    src/
      components/     UI by domain (typing, statistics, header, settings...)
      contexts/       SolidJS providers
      cursor/         cursor position + navigation
      timer/          timer state machine
      typingContent/  content parsing (paragraphs, words, characters)
      typingGame/     game lifecycle
      typingKeyboard/ keyboard layouts (qwerty/azerty)
      typingOptions/  game options (mode, category, language)
      typingState/    typing state machine + keypress handler
      typingStatistics/ metrics, WPM, accuracy, charts
      i18n/           translations (en/fr)
      routes/         file-based routing
      styles/         global CSS + fonts
```


## CI/CD

```
feature/* → develop → main
              │         │
           CI tests   Release
```

Feature branches merge into `develop`, `develop` merges into `main` for releases.

- **CI** (on develop): lint → test → build
- **Release** (on main): cocogitto version bump, changelog, GitHub release

Commits follow [Conventional Commits](https://www.conventionalcommits.org):
```
feat(typing): add quote mode
fix(cursor): handle single-char words
```


## License

MIT
