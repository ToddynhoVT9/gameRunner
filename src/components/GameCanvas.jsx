import { useEffect, useRef } from 'react'
import { GameEngine } from '../game/engine.js'

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tagName = target.tagName
  return target.isContentEditable || tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT'
}

function GameCanvas({ playerName, runSignal, onScoreChange, onGameOver, onStateChange }) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const callbacksRef = useRef({ onScoreChange, onGameOver, onStateChange })

  useEffect(() => {
    callbacksRef.current = { onScoreChange, onGameOver, onStateChange }
  }, [onScoreChange, onGameOver, onStateChange])

  useEffect(() => {
    if (!canvasRef.current) {
      return undefined
    }

    const engine = new GameEngine(canvasRef.current, {
      onScoreChange: (score) => callbacksRef.current.onScoreChange?.(score),
      onGameOver: (finalScore, scoreboard) => callbacksRef.current.onGameOver?.(finalScore, scoreboard),
      onStateChange: (state) => callbacksRef.current.onStateChange?.(state),
    })

    engineRef.current = engine

    const handleKeyDown = (event) => {
      if (isTypingTarget(event.target)) {
        return
      }

      if (event.code === 'ArrowDown') {
        event.preventDefault()
        engine.startCrouch()
        return
      }

      if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault()
        engine.jump()
        return
      }

      if (event.code === 'ArrowRight' || event.code === 'KeyE' || event.code === 'KeyD') {
        event.preventDefault()
        engine.longJump()
      }
    }

    const handleKeyUp = (event) => {
      if (isTypingTarget(event.target)) {
        return
      }

      if (event.code === 'ArrowDown') {
        event.preventDefault()
        engine.endCrouch()
      }
    }

    const handleWindowBlur = () => {
      engine.endCrouch()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleWindowBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleWindowBlur)
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    engineRef.current?.setPlayerName(playerName)
  }, [playerName])

  useEffect(() => {
    if (runSignal <= 0) {
      return
    }

    engineRef.current?.start(playerName)
  }, [runSignal, playerName])

  const handlePointerDown = () => {
    engineRef.current?.jump()
  }

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      onPointerDown={handlePointerDown}
      role="img"
      aria-label="Dino runner game canvas"
    />
  )
}

export default GameCanvas
