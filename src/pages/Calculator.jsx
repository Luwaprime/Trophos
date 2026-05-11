import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { searchRecipes } from '../services/Api'

const COLORS = ['#fbc02d', '#2e7d32', '#66bb6a', '#81c784']

export default function Calculator() {
  const [input, setInput] = useState('')
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
      setChartData([
        { name: 'Protein', value: Math.round(recipe.totalNutrients?.PROCNT?.quantity || 0) },
        { name: 'Fat', value: Math.round(recipe.totalNutrients?.FAT?.quantity || 0) },
        { name: 'Carbs', value: Math.round(recipe.totalNutrients?.CHOCDF?.quantity || 0) },
      ])
    } catch (err) {
      console.error('Analysis error:', err)
      setError('Failed to analyze. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ color: 'var(--green-primary)', marginBottom: '24px' }}>
        Nutrition Calculator
      </h1>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter ingredient or dish name..."
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn btn-primary">
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

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

      {chartData && (
        <div className="card">
          <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>Macronutrients</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}g`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value">
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}g`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}