import { isAabbCollision } from './collision.js'
import { GAME_CONFIG } from './config.js'
import { createObstacle, createPlayer } from './entities.js'
import { applyGravity, resolveGroundCollision, tryJump } from './physics.js'

function randomSpawnInterval() {
  const { spawnIntervalMin, spawnIntervalMax } = GAME_CONFIG
  return Math.random() * (spawnIntervalMax - spawnIntervalMin) + spawnIntervalMin
}

export class GameEngine {
  constructor(canvas, callbacks = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.callbacks = callbacks

    this.rafId = 0
    this.lastTime = 0
    this.state = 'idle'

    this.player = createPlayer()
    this.obstacles = []

    this.score = 0
    this.visibleScore = 0
    this.elapsed = 0
    this.speed = GAME_CONFIG.gameSpeed
    this.spawnTimer = randomSpawnInterval()

    this.setupCanvas()
    this.render()
  }

  setupCanvas() {
    this.canvas.width = GAME_CONFIG.canvasWidth
    this.canvas.height = GAME_CONFIG.canvasHeight
  }

  start() {
    this.stopLoop()
    this.resetWorld()
    this.state = 'running'
    this.lastTime = performance.now()

    this.callbacks.onStateChange?.(this.state)
    this.callbacks.onScoreChange?.(this.visibleScore)

    this.rafId = requestAnimationFrame(this.loop)
  }

  destroy() {
    this.stopLoop()
  }

  stopLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }

  resetWorld() {
    this.player = createPlayer()
    this.obstacles = []

    this.score = 0
    this.visibleScore = 0
    this.elapsed = 0
    this.speed = GAME_CONFIG.gameSpeed
    this.spawnTimer = randomSpawnInterval()

    this.render()
  }

  jump() {
    if (this.state !== 'running') {
      return
    }

    tryJump(this.player, GAME_CONFIG.jumpStrength)
  }

  loop = (timestamp) => {
    if (this.state !== 'running') {
      return
    }

    const dtRaw = (timestamp - this.lastTime) / 1000
    const dt = Math.min(dtRaw, GAME_CONFIG.maxDeltaTime)
    this.lastTime = timestamp

    this.update(dt)
    this.render()

    if (this.state === 'running') {
      this.rafId = requestAnimationFrame(this.loop)
    }
  }

  update(dt) {
    this.elapsed += dt
    this.speed = GAME_CONFIG.gameSpeed + this.elapsed * GAME_CONFIG.speedIncreasePerSecond

    applyGravity(this.player, GAME_CONFIG.gravity, dt)
    resolveGroundCollision(this.player, GAME_CONFIG.groundY)

    this.updateObstacles(dt)
    this.updateScore(dt)

    if (this.hasCollision()) {
      this.finishGame()
    }
  }

  updateObstacles(dt) {
    this.spawnTimer -= dt

    if (this.spawnTimer <= 0) {
      this.obstacles.push(createObstacle())
      this.spawnTimer = randomSpawnInterval()
    }

    this.obstacles = this.obstacles
      .map((obstacle) => ({
        ...obstacle,
        x: obstacle.x - this.speed * dt,
      }))
      .filter((obstacle) => obstacle.x + obstacle.width >= 0)
  }

  updateScore(dt) {
    this.score += dt * GAME_CONFIG.scorePerSecond
    const nextVisibleScore = Math.floor(this.score)

    if (nextVisibleScore !== this.visibleScore) {
      this.visibleScore = nextVisibleScore
      this.callbacks.onScoreChange?.(this.visibleScore)
    }
  }

  hasCollision() {
    return this.obstacles.some((obstacle) => isAabbCollision(this.player, obstacle))
  }

  finishGame() {
    this.state = 'gameOver'
    this.stopLoop()
    this.callbacks.onStateChange?.(this.state)
    this.callbacks.onGameOver?.(this.visibleScore)
    this.render()
  }

  render() {
    const ctx = this.ctx
    const { canvasWidth, canvasHeight, groundY, palette, obstacle, player } = GAME_CONFIG

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    ctx.fillStyle = palette.background
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    ctx.strokeStyle = palette.accent
    ctx.lineWidth = 2
    for (let x = 0; x < canvasWidth; x += 48) {
      ctx.beginPath()
      ctx.moveTo(x, groundY + 8)
      ctx.lineTo(x + 20, groundY + 8)
      ctx.stroke()
    }

    ctx.fillStyle = palette.ground
    ctx.fillRect(0, groundY, canvasWidth, canvasHeight - groundY)

    ctx.fillStyle = player.color
    ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height)

    ctx.fillStyle = obstacle.color
    this.obstacles.forEach((item) => {
      ctx.fillRect(item.x, item.y, item.width, item.height)
    })

    if (this.state === 'idle') {
      this.drawCenterText('Press Start')
    }

    if (this.state === 'gameOver') {
      this.drawCenterText('Game Over')
    }
  }

  drawCenterText(label) {
    const ctx = this.ctx
    ctx.fillStyle = '#111827'
    ctx.font = 'bold 36px Verdana, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(label, GAME_CONFIG.canvasWidth / 2, GAME_CONFIG.canvasHeight / 2)
  }
}