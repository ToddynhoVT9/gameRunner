# Dino React Runner

Projeto base para um jogo estilo Dino Runner com:

- `Vite`
- `React`
- `Canvas 2D`
- Engine desacoplada em JavaScript puro

## Como rodar

```bash
npm install
npm run dev
```

Build de producao:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Estrutura

```text
src/
  pages/
    Game.jsx
  components/
    GameCanvas.jsx
  game/
    engine.js
    entities.js
    physics.js
    collision.js
    config.js
  main.jsx
```

## Controles

- `Space` ou `ArrowUp`: pular
- Clique/toque no canvas: pular
