import { useCallback, useState } from 'react'
import GameCanvas from '../components/GameCanvas.jsx'

const HIGH_SCORE_STORAGE_KEY = 'dino_highscore'

function Game() {
  const [status, setStatus] = useState('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const savedValue = Number(localStorage.getItem(HIGH_SCORE_STORAGE_KEY) ?? '0')
    return Number.isFinite(savedValue) ? savedValue : 0
  })
  const [runSignal, setRunSignal] = useState(0)

  const handleScoreChange = useCallback((nextScore) => {
    setScore(nextScore)
  }, [])

  const handleGameOver = useCallback((finalScore) => {
    setStatus('gameOver')
    setScore(finalScore)

    setHighScore((currentHighScore) => {
      const nextHighScore = Math.max(currentHighScore, finalScore)
      localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(nextHighScore))
      return nextHighScore
    })
  }, [])

  const handleStateChange = useCallback((nextState) => {
    setStatus(nextState)
  }, [])

  const handleStart = () => {
    setScore(0)
    setStatus('running')
    setRunSignal((currentSignal) => currentSignal + 1)
  }

  const actionLabel = status === 'idle' ? 'Start' : status === 'gameOver' ? 'Restart' : 'Running...'

  return (
    <main className="game-page">
      <header className="game-header">
        <h1>Dino React Runner</h1>
        <p>Space, Arrow Up or click/tap on the canvas to jump.</p>
      </header>

      <section className="game-stats" aria-label="Game stats">
        <div>
          <span>Status</span>
          <strong>{status}</strong>
        </div>
        <div>
          <span>Score</span>
          <strong>{score}</strong>
        </div>
        <div>
          <span>High Score</span>
          <strong>{highScore}</strong>
        </div>
      </section>

      <div className="game-actions">
        <button type="button" onClick={handleStart} disabled={status === 'running'}>
          {actionLabel}
        </button>
      </div>

      <GameCanvas
        runSignal={runSignal}
        onScoreChange={handleScoreChange}
        onGameOver={handleGameOver}
        onStateChange={handleStateChange}
      />
    </main>
  )
}

export default Game
