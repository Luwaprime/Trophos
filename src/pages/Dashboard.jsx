import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useNutritionStore, PRESET_PLANS } from '../store/nutritionStore'
import { useFavorites } from '../context/Favoritecontext'

const GoalBar = ({ label, current, target, unit, color }) => {
  const pct = Math.min(Math.round((current / target) * 100), 100)
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-dark)' }}>{label}</h3>
        <span style={{ fontSize: '13px', fontWeight: '700', color }}>{pct}%</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-light)', marginBottom: '6px' }}>
        <span>{current} {unit}</span>
        <span>Goal: {target} {unit}</span>
      </div>
      <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? '#4caf50' : color, borderRadius: '4px', transition: 'width 0.4s' }} />
      </div>
      <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '6px' }}>
        {pct >= 100 ? '✅ Goal reached!' : `${target - current} ${unit} remaining`}
      </p>
    </div>
  )
}

export default function Dashboard() {
  const { getWeeklyCalories, getTodayProgress, lastAnalyzed, activePlan, meals } = useNutritionStore()
  const { favs } = useFavorites()

  const weeklyData = getWeeklyCalories()
  const todayProgress = getTodayProgress()
  const totalWeekCal = weeklyData.reduce((s, d) => s + d.calories, 0)
  const avgDailyCal = Math.round(totalWeekCal / 7)

  // Calorie goal based on active plan
  const calGoal = activePlan && activePlan !== 'custom'
    ? Math.round(Object.values(PRESET_PLANS[activePlan].caloriesPerDay).reduce((a, b) => a + b, 0) / 7)
    : 2000

  // Today's estimated calories from planner
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const todayKey = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
  const todayCalories = weeklyData.find((d) => d.day === todayKey)?.calories || 0

  // Macros from last analyzed recipe in calculator
  const protein = lastAnalyzed?.protein || 0
  const fat = lastAnalyzed?.fat || 0
  const carbs = lastAnalyzed?.carbs || 0

  const planInfo = activePlan && activePlan !== 'custom' ? PRESET_PLANS[activePlan] : null

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: 'var(--green-primary)', marginBottom: '4px' }}>Your Dashboard</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>
            {planInfo
              ? `${planInfo.emoji} Active plan: ${planInfo.label}`
              : activePlan === 'custom'
              ? '✏️ Custom plan active'
              : 'No plan loaded — go to Meal Planner to get started'}
          </p>
        </div>
        {lastAnalyzed && (
          <div style={{ fontSize: '12px', color: 'var(--text-light)', background: 'white', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            Last analyzed: <strong style={{ color: 'var(--text-dark)' }}>{lastAnalyzed.label}</strong> · {lastAnalyzed.calories} cal
          </div>
        )}
      </div>

      {/* Summary stat cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: "Today's Calories", value: todayCalories || '—', unit: 'cal', color: 'var(--yellow-accent)', note: todayCalories ? `goal ${calGoal}` : 'no meals planned today' },
          { label: 'Meals Today', value: `${todayProgress.filled}/${todayProgress.total}`, unit: '', color: 'var(--green-primary)', note: todayProgress.filled === 3 ? 'All meals planned ✅' : `${todayProgress.total - todayProgress.filled} slots empty` },
          { label: 'Weekly Avg', value: avgDailyCal || '—', unit: 'cal/day', color: '#1565c0', note: `${totalWeekCal} total this week` },
          { label: 'Saved Recipes', value: favs.length, unit: '', color: '#c62828', note: favs.length ? `${favs.length} favourites` : 'None saved yet' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '28px', fontWeight: '700', color: s.color, margin: '0 0 2px' }}>
              {s.value}<span style={{ fontSize: '13px', fontWeight: '400' }}> {s.unit}</span>
            </p>
            <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '2px' }}>{s.label}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-light)' }}>{s.note}</p>
          </div>
        ))}
      </div>

      {/* Weekly Calorie Chart */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600' }}>Weekly Calorie Intake</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
            {activePlan && activePlan !== 'custom' ? 'From preset plan' : activePlan === 'custom' ? 'Estimated from your meals' : 'Load a plan to see data'}
          </span>
        </div>
        {totalWeekCal === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)', fontSize: '14px' }}>
            No meal data yet. Go to <strong>Meal Planner</strong> and load a plan or fill in your meals.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${v} cal`, 'Calories']} />
              <Bar dataKey="calories" fill="var(--green-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Goals */}
      <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Today's Goals</h2>
      <div className="grid grid-3" style={{ marginBottom: '24px' }}>
        <GoalBar label="Calories" current={todayCalories} target={calGoal} unit="cal" color="var(--yellow-accent)" />
        <GoalBar label="Protein" current={protein} target={planInfo?.label === 'High Protein' ? 150 : 80} unit="g" color="var(--green-primary)" />
        <GoalBar label="Meals Planned" current={todayProgress.filled} target={3} unit="meals" color="#1565c0" />
      </div>

      {/* Macros from calculator */}
      {lastAnalyzed ? (
        <>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
            Last Analyzed: <span style={{ color: 'var(--green-primary)' }}>{lastAnalyzed.label}</span>
          </h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Calories', value: lastAnalyzed.calories, unit: 'cal', color: 'var(--yellow-accent)' },
              { label: 'Protein', value: protein, unit: 'g', color: 'var(--green-primary)' },
              { label: 'Fat', value: fat, unit: 'g', color: '#fbc02d' },
              { label: 'Carbs', value: carbs, unit: 'g', color: '#66bb6a' },
            ].map((m) => (
              <div key={m.label} className="card" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '26px', fontWeight: '700', color: m.color, margin: '0 0 2px' }}>
                  {m.value}<span style={{ fontSize: '13px', fontWeight: '400' }}>{m.unit}</span>
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>{m.label}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '20px', textAlign: 'center', color: 'var(--text-light)', fontSize: '14px', border: '1px dashed var(--border-color)' }}>
          Use the <strong>Nutrition Calculator</strong> to analyze a recipe — macros will appear here.
        </div>
      )}

      {/* Saved favourites preview */}
      {favs.length > 0 && (
        <>
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '24px 0 16px' }}>Saved Favourites</h2>
          <div className="grid grid-3">
            {favs.slice(0, 3).map((r) => (
              <div key={r.id} className="card" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px' }}>
                <img src={r.image} alt={r.label} style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>{r.calories ? `${Math.round(r.calories)} cal` : '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
