import { useState } from 'react'
import { useNutritionStore, PRESET_PLANS } from '../store/nutritionStore'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SLOTS = ['Breakfast', 'Lunch', 'Dinner']

const SLOT_COLORS = {
  Breakfast: { bg: '#fff8e1', border: '#fbc02d', dot: '#f9a825' },
  Lunch:     { bg: '#e8f5e9', border: '#66bb6a', dot: '#2e7d32' },
  Dinner:    { bg: '#e3f2fd', border: '#64b5f6', dot: '#1565c0' },
}

export default function MealPlanner() {
  const { meals, activePlan, setMeal, loadPreset, startCustomPlan, clearPlan } = useNutritionStore()
  const [view, setView] = useState('planner') // 'planner' | 'presets'
  const [confirmClear, setConfirmClear] = useState(false)

  const handleClear = () => {
    if (confirmClear) {
      clearPlan()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
    }
  }

  const handleLoadPreset = (key) => {
    loadPreset(key)
    setView('planner')
  }

  const handleCustom = () => {
    startCustomPlan()
    setView('planner')
  }

  const filledCount = Object.values(meals).filter((v) => v?.trim()).length
  const totalSlots = DAYS.length * SLOTS.length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: 'var(--green-primary)', marginBottom: '4px' }}>Weekly Meal Planner</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>
            {filledCount}/{totalSlots} meals planned
            {activePlan && activePlan !== 'custom' && (
              <span style={{ marginLeft: '8px', background: 'var(--green-primary)', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                {PRESET_PLANS[activePlan]?.emoji} {PRESET_PLANS[activePlan]?.label} Plan
              </span>
            )}
            {activePlan === 'custom' && (
              <span style={{ marginLeft: '8px', background: 'var(--yellow-accent)', color: '#3d2e00', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                ✏️ Custom Plan
              </span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setView(view === 'presets' ? 'planner' : 'presets')}
            className="btn btn-accent"
            style={{ fontSize: '13px' }}>
            {view === 'presets' ? '← Back to Planner' : '📋 Browse Plans'}
          </button>
          <button onClick={handleClear} className="btn btn-secondary" style={{ fontSize: '13px', color: confirmClear ? '#c62828' : undefined }}>
            {confirmClear ? 'Confirm Clear?' : 'Clear All'}
          </button>
        </div>
      </div>

      {/* Preset plans browser */}
      {view === 'presets' && (
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-dark)' }}>
            Choose a Plan
          </h2>

          {/* Custom plan card */}
          <div
            onClick={handleCustom}
            className="card"
            style={{
              marginBottom: '16px',
              cursor: 'pointer',
              border: activePlan === 'custom' ? '2px solid var(--yellow-accent)' : '2px dashed var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px',
            }}>
            <div style={{ fontSize: '36px' }}>✏️</div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>Custom Plan</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                Start from scratch — fill in your own meals for each day and slot.
              </p>
            </div>
            <button className="btn btn-secondary" style={{ marginLeft: 'auto', whiteSpace: 'nowrap', fontSize: '13px' }}>
              Start Fresh
            </button>
          </div>

          {/* Preset plan cards */}
          <div className="grid grid-2">
            {Object.entries(PRESET_PLANS).map(([key, plan]) => (
              <div
                key={key}
                className="card"
                style={{
                  cursor: 'pointer',
                  border: activePlan === key ? '2px solid var(--green-primary)' : '2px solid transparent',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '28px' }}>{plan.emoji}</span>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '700' }}>{plan.label}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>{plan.description}</p>
                    </div>
                  </div>
                  {activePlan === key && (
                    <span style={{ fontSize: '11px', background: 'var(--green-primary)', color: 'white', padding: '2px 8px', borderRadius: '20px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                      Active
                    </span>
                  )}
                </div>

                {/* Sample meals preview */}
                <div style={{ marginBottom: '14px' }}>
                  {['Mon-Breakfast', 'Mon-Lunch', 'Mon-Dinner'].map((key2) => {
                    const [, slot] = key2.split('-')
                    return (
                      <div key={key2} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: SLOT_COLORS[slot].dot, flexShrink: 0 }} />
                        <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '500' }}>{slot}:</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-dark)' }}>{plan.meals[key2]}</span>
                      </div>
                    )
                  })}
                  <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>+ 18 more meals...</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                    ~{Math.round(Object.values(plan.caloriesPerDay).reduce((a, b) => a + b, 0) / 7)} cal/day avg
                  </span>
                  <button
                    onClick={() => handleLoadPreset(key)}
                    className={activePlan === key ? 'btn btn-secondary' : 'btn btn-primary'}
                    style={{ fontSize: '13px' }}>
                    {activePlan === key ? '✓ Loaded' : 'Load Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Planner grid */}
      {view === 'planner' && (
        <>
          {!activePlan && (
            <div style={{ background: '#fff8e1', border: '1px solid #fbc02d', borderRadius: '8px', padding: '14px 18px', marginBottom: '20px', fontSize: '14px', color: '#5d4037', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>💡</span>
              No plan loaded. Click <strong>Browse Plans</strong> to load a preset or start a custom plan.
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', fontSize: '13px', width: '100px' }}>Meal</th>
                  {DAYS.map((day) => (
                    <th key={day} style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SLOTS.map((slot) => (
                  <tr key={slot} style={{ borderTop: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 16px', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: SLOT_COLORS[slot].dot, flexShrink: 0 }} />
                        {slot}
                      </div>
                    </td>
                    {DAYS.map((day) => {
                      const val = meals[`${day}-${slot}`] || ''
                      return (
                        <td key={`${day}-${slot}`} style={{ padding: '6px' }}>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => setMeal(day, slot, e.target.value)}
                            placeholder="Add meal..."
                            style={{
                              width: '100%',
                              padding: '7px 8px',
                              border: `1px solid ${val ? SLOT_COLORS[slot].border : 'var(--border-color)'}`,
                              borderRadius: '6px',
                              fontSize: '12px',
                              background: val ? SLOT_COLORS[slot].bg : 'white',
                              color: 'var(--text-dark)',
                              outline: 'none',
                              transition: 'border-color 0.2s, background 0.2s',
                              minWidth: '110px',
                            }}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
