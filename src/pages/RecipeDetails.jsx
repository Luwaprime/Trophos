import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRecipeById } from '../services/Api'
import { useFavorites } from '../context/Favoritecontext'

const COLORS = {
  Protein: 'var(--green-primary)',
  Fat: '#fbc02d',
  Carbs: '#66bb6a',
}

export default function RecipeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { favs, toggle } = useFavorites()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getRecipeById(id)
      .then(setRecipe)
      .catch(() => setError('Failed to load recipe details.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <p>Loading recipe...</p>
    </div>
  )

  if (error) return (
    <div style={{ textAlign: 'center', padding: '60px', color: '#c62828' }}>
      <p>{error}</p>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginTop: '16px' }}>
        Go Back
      </button>
    </div>
  )

  if (!recipe) return null

  const isFavorite = favs.some((f) => f.label === recipe.label)
  const macros = [
    { name: 'Protein', value: Math.round(recipe.totalNutrients?.PROCNT?.quantity || 0), unit: 'g' },
    { name: 'Fat',     value: Math.round(recipe.totalNutrients?.FAT?.quantity    || 0), unit: 'g' },
    { name: 'Carbs',   value: Math.round(recipe.totalNutrients?.CHOCDF?.quantity || 0), unit: 'g' },
  ]

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary"
        style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        ← Back
      </button>

      {/* Hero */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={recipe.image}
            alt={recipe.label}
            style={{ width: '100%', height: '320px', objectFit: 'cover' }}
          />
          <button
            onClick={() => toggle(recipe)}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(255,255,255,0.9)', border: 'none',
              borderRadius: '50%', width: '44px', height: '44px',
              cursor: 'pointer', fontSize: '22px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '8px' }}>
            {recipe.label}
          </h1>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {recipe.cuisineType?.[0] && (
              <span style={{ fontSize: '13px', color: 'var(--green-primary)', fontWeight: '600', textTransform: 'capitalize' }}>
                🌍 {recipe.cuisineType[0]}
              </span>
            )}
            {recipe.mealType?.[0] && (
              <span style={{ fontSize: '13px', color: 'var(--text-light)', textTransform: 'capitalize' }}>
                🍽 {recipe.mealType[0]}
              </span>
            )}
            <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
              👥 Serves {recipe.yield}
            </span>
            {recipe.url && (
              <a href={recipe.url} target="_blank" rel="noreferrer"
                style={{ fontSize: '13px', color: 'var(--green-primary)' }}>
                🔗 {recipe.source}
              </a>
            )}
          </div>

          {/* Health labels */}
          {recipe.healthLabels?.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {recipe.healthLabels.map((label) => (
                <span key={label} style={{
                  background: 'var(--bg-secondary)', color: 'var(--green-primary)',
                  fontSize: '11px', fontWeight: '600', padding: '3px 10px',
                  borderRadius: '20px', border: '1px solid var(--border-color)',
                }}>
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nutrition */}
      <div className="grid grid-4" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--yellow-accent)', margin: 0 }}>
            {recipe.calories}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: '4px 0 0' }}>Calories</p>
        </div>
        {macros.map((m) => (
          <div key={m.name} className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '28px', fontWeight: '700', color: COLORS[m.name], margin: 0 }}>
              {m.value}<span style={{ fontSize: '14px' }}>{m.unit}</span>
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: '4px 0 0' }}>{m.name}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Ingredients */}
        <div className="card">
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-dark)' }}>
            🥦 Ingredients
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {recipe.ingredientLines.map((line, i) => (
              <li key={i} style={{
                padding: '8px 0',
                borderBottom: i < recipe.ingredientLines.length - 1 ? '1px solid var(--border-color)' : 'none',
                fontSize: '14px', color: 'var(--text-dark)',
                display: 'flex', alignItems: 'flex-start', gap: '8px',
              }}>
                <span style={{ color: 'var(--green-primary)', marginTop: '2px' }}>•</span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="card">
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-dark)' }}>
            📋 Instructions
          </h2>
          {recipe.instructions ? (
            <ol style={{ paddingLeft: '20px', margin: 0 }}>
              {recipe.instructions
                .split(/\n+/)
                .filter((s) => s.trim())
                .map((step, i) => (
                  <li key={i} style={{
                    fontSize: '14px', color: 'var(--text-dark)',
                    marginBottom: '12px', lineHeight: '1.6',
                  }}>
                    {step.replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
            </ol>
          ) : (
            <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>
              No instructions available.{' '}
              {recipe.url && (
                <a href={recipe.url} target="_blank" rel="noreferrer" style={{ color: 'var(--green-primary)' }}>
                  View on {recipe.source || 'source website'} →
                </a>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
