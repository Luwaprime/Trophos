import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/recipes?q=${encodeURIComponent(query)}`)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hero-section"
        style={{
          background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
          padding: '80px 2rem',
          textAlign: 'center',
          color: 'white',
          borderRadius: '12px',
        }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            marginBottom: '1rem',
          }}>
          Eat Smarter. Live Better.
        </motion.h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem' }}>
          Search recipes, track nutrition, and plan your meals
        </p>

        <div style={{
          display: 'flex',
          maxWidth: '500px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '50px',
          overflow: 'hidden',
          border: '2px solid rgba(255,255,255,0.3)',
        }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search recipes, ingredients..."
            style={{
              flex: 1,
              padding: '14px 20px',
              border: 'none',
              outline: 'none',
              fontSize: '15px',
            }}
          />
          <button
            onClick={handleSearch}
            className="btn btn-accent"
            style={{
              borderRadius: 0,
              padding: '14px 24px',
              fontSize: '14px',
            }}>
            Search
          </button>
        </div>
      </motion.section>
    </div>
  )
}