import { GAME_CONFIG } from './config.js'

export function createPlayer() {
  return {
    x: GAME_CONFIG.player.x,
    y: GAME_CONFIG.groundY - GAME_CONFIG.player.height,
    width: GAME_CONFIG.player.width,
    height: GAME_CONFIG.player.height,
    vy: 0,
    onGround: true,
  }
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

export function createObstacle() {
  const width = randomBetween(GAME_CONFIG.obstacle.minWidth, GAME_CONFIG.obstacle.maxWidth)
  const height = randomBetween(GAME_CONFIG.obstacle.minHeight, GAME_CONFIG.obstacle.maxHeight)

  return {
    x: GAME_CONFIG.canvasWidth + width,
    y: GAME_CONFIG.groundY - height,
    width,
    height,
  }
}