import { useEffect, useRef } from 'react'
import { GameEngine } from '../game/engine.js'

function GameCanvas({ runSignal, onScoreChange, onGameOver, onStateChange }) {
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
      onGameOver: (finalScore) => callbacksRef.current.onGameOver?.(finalScore),
      onStateChange: (state) => callbacksRef.current.onStateChange?.(state),
    })

    engineRef.current = engine

    const handleKeyDown = (event) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault()
        engine.jump()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    if (runSignal <= 0) {
      return
    }

    engineRef.current?.start()
  }, [runSignal])

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