export function applyGravity(entity, gravity, dt) {
  entity.vy += gravity * dt
  entity.y += entity.vy * dt
}

export function resolveGroundCollision(entity, groundY) {
  const floorY = groundY - entity.height

  if (entity.y >= floorY) {
    entity.y = floorY
    entity.vy = 0
    entity.onGround = true
    return
  }

  entity.onGround = false
}

export function tryJump(entity, jumpStrength) {
  if (!entity.onGround) {
    return false
  }

  entity.vy = -jumpStrength
  entity.onGround = false
  return true
}