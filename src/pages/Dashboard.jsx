import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const mockWeeklyData = [
  { day: 'Mon', calories: 1800 },
  { day: 'Tue', calories: 2100 },
  { day: 'Wed', calories: 1950 },
  { day: 'Thu', calories: 2300 },
  { day: 'Fri', calories: 1700 },
  { day: 'Sat', calories: 2500 },
  { day: 'Sun', calories: 1600 },
]

const goals = [
  { label: 'Calories', current: 1800, target: 2000, unit: 'cal' },
  { label: 'Protein', current: 85, target: 120, unit: 'g' },
  { label: 'Water', current: 6, target: 8, unit: 'cups' },
]

export default function Dashboard() {
  return (
    <div>
      <h1 style={{ color: 'var(--green-primary)', marginBottom: '24px' }}>
        Your Dashboard
      </h1>

      {/* Weekly Chart */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>Weekly Calorie Intake</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockWeeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="calories" fill="var(--green-primary)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Goals Grid */}
      <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>Today's Goals</h2>
      <div className="grid grid-3">
        {goals.map((goal) => {
          const percentage = Math.round((goal.current / goal.target) * 100)
          return (
            <div key={goal.label} className="card">
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                {goal.label}
              </h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  marginBottom: '6px',
                }}>
                  <span>
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                  <span style={{ fontWeight: '600' }}>{percentage}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <div
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      height: '100%',
                      background: percentage >= 100 ? '#4caf50' : 'var(--green-primary)',
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                {percentage >= 100
                  ? '✓ Goal reached!'
                  : `${goal.target - goal.current} ${goal.unit} left`}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}