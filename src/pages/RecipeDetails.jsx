import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchRecipes } from '../services/api'
import RecipeCard from '../components/RecipeCard'

const DIET_FILTERS = ['balanced', 'high-protein', 'low-fat', 'vegan']

const Recipes = () => {
  const [params]    = useSearchParams()
  const [results, setResults] = useState([])
  const [activeFilter, setFilter] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = params.get('q') ?? 'healthy'
    setLoading(true)
    searchRecipes(q, activeFilter ? { diet: activeFilter } : {})
      .then(setResults).finally(() => setLoading(false))
  }, [params, activeFilter])

  return (
    <div style={{ display: 'flex', gap: '24px', padding: '24px' }}>
      /* Filter sidebar */
      <aside style={{ width: '200px', minWidth: '200px',
        background: 'var(--bg-secondary)', borderRadius: '12px',
        padding: '16px', height: 'fit-content' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Diet</h3>
        {DIET_FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f === activeFilter ? null : f)}
            style={{ display: 'block', width: '100%', textAlign: 'left',
              padding: '8px 12px', marginBottom: '6px', borderRadius: '8px',
              border: 'none', cursor: 'pointer', fontSize: '13px',
              background: activeFilter===f ? 'var(--yellow-accent)' : 'white',
              color: activeFilter===f ? 'var(--text-dark)' : 'var(--text-light)',
              fontWeight: activeFilter===f ? '600' : '400' }}>
            {f}
          </button>
        ))}
      </aside>
      /* Grid */
      <div style={{ flex: 1, display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px',
        alignContent: 'start' }}>
        {loading ? <p>Loading...</p> : results.map((r,i) => (
          <RecipeCard key={i} recipe={r} />
        ))}
      </div>
    </div>
  )
}
export default Recipes