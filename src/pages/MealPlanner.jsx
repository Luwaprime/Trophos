import { useState, useEffect } from 'react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SLOTS = ['Breakfast', 'Lunch', 'Dinner']

export default function MealPlanner() {
  const [meals, setMeals] = useState(() =>
    JSON.parse(localStorage.getItem('nutriapp-meals') || '{}')
  )

  useEffect(() => {
    localStorage.setItem('nutriapp-meals', JSON.stringify(meals))
  }, [meals])

  const setMeal = (day, slot, value) => {
    setMeals((prev) => ({
      ...prev,
      [`${day}-${slot}`]: value,
    }))
  }

  const clearAll = () => {
    if (confirm('Clear all meals?')) {
      setMeals({})
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: 'var(--green-primary)' }}>Weekly Meal Planner</h1>
        <button onClick={clearAll} className="btn btn-secondary">
          Clear All
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Meal</th>
              {DAYS.map((day) => (
                <th key={day} style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot) => (
              <tr key={slot} style={{ borderTop: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: '500' }}>{slot}</td>
                {DAYS.map((day) => (
                  <td key={`${day}-${slot}`} style={{ padding: '8px' }}>
                    <input
                      type="text"
                      value={meals[`${day}-${slot}`] || ''}
                      onChange={(e) => setMeal(day, slot, e.target.value)}
                      placeholder="Add meal..."
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        fontSize: '13px',
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}