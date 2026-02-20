import { GAME_CONFIG } from './config.js'

function randomBetween(min, max) {
  if (max <= min) {
    return min
  }

  return Math.random() * (max - min) + min
}

export function createPlayer() {
  const standHeight = GAME_CONFIG.player.height
  const crouchHeight = standHeight * GAME_CONFIG.player.crouchHeightRatio

  return {
    x: GAME_CONFIG.player.x,
    baseX: GAME_CONFIG.player.x,
    y: GAME_CONFIG.groundY - standHeight,
    width: GAME_CONFIG.player.width,
    height: standHeight,
    standHeight,
    crouchHeight,
    vy: 0,
    onGround: true,
    isLongJumping: false,
    isCrouching: false,
  }
}

export function createGroundShort() {
  const { minWidth, maxWidth, minHeight, maxHeight } = GAME_CONFIG.obstacle.groundShort
  const width = randomBetween(minWidth, maxWidth)
  const height = randomBetween(minHeight, maxHeight)

  return {
    type: 'groundShort',
    x: GAME_CONFIG.canvasWidth + width,
    y: GAME_CONFIG.groundY - height,
    width,
    height,
    speedMultiplier: 1,
  }
}

export function createGroundLong() {
  const { minWidth, maxWidth, minHeight, maxHeight } = GAME_CONFIG.obstacle.groundLong
  const width = randomBetween(minWidth, maxWidth)
  const height = randomBetween(minHeight, maxHeight)

  return {
    type: 'groundLong',
    x: GAME_CONFIG.canvasWidth + width,
    y: GAME_CONFIG.groundY - height,
    width,
    height,
    speedMultiplier: 1,
    hitboxPadding: { left: 2, right: 2, top: 1, bottom: 0 },
  }
}

export function createFloating() {
  const { minWidth, maxWidth, minHeight, maxHeight } = GAME_CONFIG.obstacle.floating
  const width = randomBetween(minWidth, maxWidth)
  const playerHeightLimitY =
    GAME_CONFIG.groundY -
    GAME_CONFIG.player.height * GAME_CONFIG.floatingBottomLimitPlayerHeightRatio

  const maxHeightByLimit = Math.max(minHeight, playerHeightLimitY - GAME_CONFIG.floatingMinY)
  const constrainedMaxHeight = Math.min(maxHeight, maxHeightByLimit)
  const height = randomBetween(minHeight, constrainedMaxHeight)

  const maxYByBottomLimit = playerHeightLimitY - height
  const constrainedMaxY = Math.min(GAME_CONFIG.floatingMaxY, maxYByBottomLimit)
  const minY = Math.min(GAME_CONFIG.floatingMinY, constrainedMaxY)
  const y = randomBetween(minY, constrainedMaxY)

  return {
    type: 'floating',
    x: GAME_CONFIG.canvasWidth + width,
    y,
    width,
    height,
    speedMultiplier: 1,
    hitboxPadding: { left: 1, right: 1, top: 1, bottom: 1 },
  }
}
