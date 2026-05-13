import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { searchRecipes } from '../services/Api'
import { useNutritionStore } from '../store/nutritionStore'

const COLORS = ['#2e7d32', '#fbc02d', '#66bb6a']

export default function Calculator() {
  const [input, setInput] = useState('')
  const [chartData, setChartData] = useState(null)
  const [recipeName, setRecipeName] = useState('')
  const [calories, setCalories] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { setLastAnalyzed } = useNutritionStore()

  const handleAnalyze = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    try {
      const results = await searchRecipes(input)
      if (!results.length) {
        setError('No recipes found for that ingredient.')
        return
      }
      const recipe = results[0]
      const protein = Math.round(recipe.totalNutrients?.PROCNT?.quantity || 0)
      const fat     = Math.round(recipe.totalNutrients?.FAT?.quantity    || 0)
      const carbs   = Math.round(recipe.totalNutrients?.CHOCDF?.quantity || 0)
      const cal     = Math.round(recipe.calories || 0)

      setChartData([
        { name: 'Protein', value: protein },
        { name: 'Fat',     value: fat },
        { name: 'Carbs',   value: carbs },
      ])
      setRecipeName(recipe.label)
      setCalories(cal)

      // Save to store so Dashboard can read it
      setLastAnalyzed({ label: recipe.label, calories: cal, protein, fat, carbs })
    } catch {
      setError('Failed to analyze. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ color: 'var(--green-primary)', marginBottom: '24px' }}>Nutrition Calculator</h1>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter ingredient or dish name..."
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            style={{ flex: 1, padding: '10px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '14px' }}
          />
          <button onClick={handleAnalyze} disabled={loading} className="btn btn-primary">
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '16px', background: '#ffebee', color: '#c62828', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {chartData && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600' }}>
              Macros for: <span style={{ color: 'var(--green-primary)' }}>{recipeName}</span>
            </h2>
            {calories > 0 && (
              <span style={{ background: 'var(--yellow-accent)', color: '#3d2e00', fontWeight: '700', fontSize: '13px', padding: '4px 14px', borderRadius: '20px' }}>
                {calories} cal
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {chartData.map((m, i) => (
              <div key={m.name} style={{ flex: '1', minWidth: '100px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '12px' }}>
                <p style={{ fontSize: '22px', fontWeight: '700', color: COLORS[i], margin: 0 }}>{m.value}g</p>
                <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>{m.name}</p>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}g`}
                outerRadius={100}
                dataKey="value">
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}g`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '8px', textAlign: 'center' }}>
            💡 This data has been saved to your Dashboard
          </p>
        </div>
      )}
    </div>
  )
}
