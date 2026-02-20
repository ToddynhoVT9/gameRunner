# Dino React Game --- Planejamento Técnico Completo

## 1. Visão Geral

Este projeto consiste em um jogo estilo "Dino Runner" (inspirado no
dinossauro do Google), desenvolvido com:

-   Vite
-   React
-   Canvas 2D (API nativa do navegador)
-   JavaScript moderno (ES Modules)

O jogo será totalmente client-side, sem backend, sem comunicação com
servidor e sem multiplayer.

------------------------------------------------------------------------

## 2. Objetivos do Projeto

### 2.1 Objetivo Principal

Desenvolver um jogo 2D simples, performático e organizado, utilizando
React apenas como camada estrutural e o Canvas como motor de
renderização.

### 2.2 Objetivos Técnicos

-   Separação clara entre UI (React) e Game Engine (JS puro)
-   Loop de jogo baseado em requestAnimationFrame
-   Sistema básico de física (gravidade + pulo)
-   Sistema de colisão (AABB)
-   Geração procedural simples de obstáculos
-   Sistema de pontuação
-   Recorde salvo no localStorage
-   Arquitetura organizada e escalável

------------------------------------------------------------------------

## 3. Arquitetura do Projeto

### Estrutura de Pastas

    src/
     ├─ pages/
     │   └─ Game.jsx
     │
     ├─ components/
     │   └─ GameCanvas.jsx
     │
     ├─ game/
     │   ├─ engine.js
     │   ├─ entities.js
     │   ├─ physics.js
     │   ├─ collision.js
     │   └─ config.js
     │
     └─ main.jsx

------------------------------------------------------------------------

## 4. Responsabilidades por Camada

### 4.1 React (Camada de Interface)

Responsável por: - Renderizar layout - Exibir score - Exibir recorde -
Botão Start / Restart - Gerenciar estado de "Game Over" - Comunicação
com engine via callbacks

React NÃO será responsável por: - Renderizar sprites - Atualizar posição
de entidades - Rodar lógica do jogo frame a frame

------------------------------------------------------------------------

### 4.2 Game Engine (JavaScript Puro)

Responsável por: - Loop principal do jogo - Atualização de entidades -
Renderização no Canvas - Física - Colisões - Spawn de obstáculos

------------------------------------------------------------------------

## 5. Loop do Jogo

Estrutura do Loop:

1.  requestAnimationFrame
2.  Calcular deltaTime (dt)
3.  update(dt)
4.  render(ctx)
5.  Repetir

Pseudoestrutura:

    function gameLoop(timestamp) {
        const dt = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        update(dt);
        render();

        requestAnimationFrame(gameLoop);
    }

------------------------------------------------------------------------

## 6. Sistema de Física

### 6.1 Gravidade

Variáveis principais: - y (posição vertical) - vy (velocidade
vertical) - gravity - jumpStrength

Fórmulas:

-   vy += gravity \* dt
-   y += vy \* dt

Quando pular: - Se estiver no chão → vy = -jumpStrength

------------------------------------------------------------------------

## 7. Sistema de Colisão

Modelo AABB (Axis-Aligned Bounding Box):

Verificação:

    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      gameOver();
    }

------------------------------------------------------------------------

## 8. Sistema de Obstáculos

-   Obstáculos se movem da direita para a esquerda
-   x -= speed \* dt
-   Quando saem da tela → remover do array
-   Spawn com distância mínima aleatória

Controle: - Timer interno de spawn - Dificuldade aumenta com o tempo
(velocidade crescente)

------------------------------------------------------------------------

## 9. Sistema de Pontuação

Score aumenta com o tempo:

-   score += dt \* multiplicador

Recorde salvo em:

    localStorage.setItem("dino_highscore", value)

------------------------------------------------------------------------

## 10. Estados do Jogo

Estados possíveis:

-   idle
-   running
-   gameOver

Engine controla estado interno e React responde visualmente.

------------------------------------------------------------------------

## 11. Configuração Central

Arquivo config.js conterá:

-   gravity
-   jumpStrength
-   gameSpeed
-   spawnIntervalMin
-   spawnIntervalMax
-   canvasWidth
-   canvasHeight

Permite fácil ajuste de dificuldade.

------------------------------------------------------------------------

## 12. Melhorias Futuras (Opcional)

-   Sprites animados
-   Parallax no fundo
-   Sistema de partículas
-   Sons (Web Audio API)
-   Sistema de pause
-   Sistema de níveis

------------------------------------------------------------------------

## 13. Critérios de Aceite

O projeto estará concluído quando:

-   O jogador puder pular
-   Obstáculos aparecerem continuamente
-   Colisão causar Game Over
-   Score aumentar automaticamente
-   Recorde persistir após reload
-   O jogo rodar suave (\~60fps)

------------------------------------------------------------------------

## 14. Filosofia Técnica

Este projeto segue princípios de:

-   Separação de responsabilidades
-   Arquitetura modular
-   Engine desacoplada da UI
-   Simplicidade antes de complexidade
-   Escalabilidade futura

------------------------------------------------------------------------

## 15. Conclusão

Este jogo serve como:

-   Laboratório de arquitetura front-end
-   Introdução a game loops
-   Exercício de física básica
-   Base para jogos maiores

Projeto simples, porém estruturado como aplicação profissional.
