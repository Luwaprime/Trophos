import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchRecipes } from '../services/Api'
import RecipeCard from '../components/RecipeCard'

const DIET_FILTERS = ['balanced', 'high-protein', 'low-fat', 'vegan']

export default function Recipes() {
  const [searchParams] = useSearchParams()
  const [results, setResults] = useState([])
  const [activeFilter, setActiveFilter] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = searchParams.get('q') || 'healthy'
    setLoading(true)
    setError(null)

    searchRecipes(q, activeFilter ? { diet: activeFilter } : {})
      .then((data) => {
        setResults(data || [])
      })
      .catch((err) => {
        console.error('Search error:', err)
        setError('Failed to load recipes. Please try again.')
        setResults([])
      })
      .finally(() => setLoading(false))
  }, [searchParams, activeFilter])

  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      {/* Sidebar Filters */}
      <aside style={{
        width: '200px',
        minWidth: '200px',
        background: 'white',
        borderRadius: '12px',
        padding: '16px',
        height: 'fit-content',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px',
          color: 'var(--text-dark)',
        }}>
          Diet Type
        </h3>
        {DIET_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
            className={`btn ${activeFilter === filter ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              width: '100%',
              marginBottom: '6px',
              textAlign: 'left',
              textTransform: 'capitalize',
            }}>
            {filter}
          </button>
        ))}
      </aside>

      {/* Results Grid */}
      <div style={{ flex: 1 }}>
        {error && (
          <div style={{
            padding: '16px',
            background: '#ffebee',
            color: '#c62828',
            borderRadius: '8px',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading recipes...</p>
          </div>
        )}

        {!loading && results.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No recipes found. Try a different search.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-2">
            {results.map((recipe) => (
              <RecipeCard key={recipe.id || recipe.label} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}