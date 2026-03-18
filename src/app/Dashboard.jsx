import { useState } from 'react'
import { Check, ChevronRight, Droplets, Flame, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

// Mock data - in real app from Supabase
const todaysMeals = [
  {
    id: '1',
    time: 'breakfast',
    name: 'Black Coffee / Water',
    macros: { fat: 0, protein: 0, carbs: 0, calories: 0 },
    status: 'completed',
    emoji: '☕',
  },
  {
    id: '2',
    time: 'lunch',
    name: '250g Mince Taco Bowl',
    macros: { fat: 30, protein: 55, carbs: 8, calories: 522 },
    status: 'planned',
    emoji: '🌮',
  },
  {
    id: '3',
    time: 'dinner',
    name: 'Steak + Greens',
    macros: { fat: 22, protein: 48, carbs: 4, calories: 394 },
    status: 'planned',
    emoji: '🥩',
  },
  {
    id: '4',
    time: 'snack',
    name: 'Daily Targets Check-in',
    macros: { fat: 0, protein: 0, carbs: 0, calories: 0 },
    status: 'planned',
    emoji: '🎯',
  },
]

const DAILY_TARGETS = { protein: 180, carbs: 30, fat: 110, calories: 2400, water: 4 }

const TIME_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' }

export default function Dashboard() {
  const [meals, setMeals] = useState(todaysMeals)
  const [water, setWater] = useState(2.5)

  const totals = meals.reduce((acc, m) => {
    if (m.status === 'completed') {
      acc.protein += m.macros.protein
      acc.carbs += m.macros.carbs
      acc.fat += m.macros.fat
      acc.calories += m.macros.calories
    }
    return acc
  }, { protein: 0, carbs: 0, fat: 0, calories: 0 })

  const toggleMealStatus = (id) => {
    setMeals(prev => prev.map(m =>
      m.id === id
        ? { ...m, status: m.status === 'completed' ? 'planned' : 'completed' }
        : m
    ))
  }

  const today = new Date()
  const dayName = today.toLocaleDateString('en-AU', { weekday: 'long' })

  return (
    <div>
      {/* Header */}
      <div className="page-header-bar">
        <div>
          <p className="page-eyebrow">Today · {dayName}</p>
          <h1 className="page-title">Good <em>morning</em>, Joe 👋</h1>
        </div>
        <Link to="/app/plan" className="btn-app-secondary">
          View Week <ChevronRight size={15} />
        </Link>
      </div>

      {/* Macro summary cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.875rem',
        marginBottom: '1.75rem',
      }}>
        <MacroCard
          label="Calories"
          value={totals.calories}
          target={DAILY_TARGETS.calories}
          unit="kcal"
          icon={<Flame size={16} />}
          color="#d97416"
        />
        <MacroCard
          label="Protein"
          value={totals.protein}
          target={DAILY_TARGETS.protein}
          unit="g"
          icon="🥩"
          color="#1c6b3a"
        />
        <MacroCard
          label="Carbs"
          value={totals.carbs}
          target={DAILY_TARGETS.carbs}
          unit="g"
          icon="🌾"
          color="#9b4dca"
        />
        <MacroCard
          label="Fat"
          value={totals.fat}
          target={DAILY_TARGETS.fat}
          unit="g"
          icon={<Zap size={16} />}
          color="#d97416"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem', alignItems: 'start' }}>
        {/* Today's meals */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '0.875rem',
          }}>
            <h2 style={{
              font: '700 1rem/1 "Playfair Display", serif',
              color: 'var(--charcoal)', margin: 0,
            }}>
              Today's Meals
            </h2>
            <Link to="/app/plan" className="btn-app-ghost" style={{ fontSize: '0.75rem' }}>
              Edit plan →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {meals.map((meal) => (
              <MealRow key={meal.id} meal={meal} onToggle={toggleMealStatus} />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Water tracker */}
          <div className="app-card">
            <div className="app-card-header">
              <span className="app-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Droplets size={16} style={{ color: '#3b82f6' }} /> Water
              </span>
              <span style={{ fontSize: '0.8rem', fontFamily: 'DM Sans, monospace', color: 'var(--text-muted)' }}>
                {water}L / {DAILY_TARGETS.water}L
              </span>
            </div>
            <div className="app-card-body">
              <div style={{
                background: '#eff6ff', borderRadius: 100, height: 8, overflow: 'hidden', marginBottom: '0.875rem',
              }}>
                <div style={{
                  background: '#3b82f6',
                  width: `${Math.min(100, (water / DAILY_TARGETS.water) * 100)}%`,
                  height: '100%', borderRadius: 100, transition: 'width 0.4s ease',
                }} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[0.25, 0.5, 1].map(amt => (
                  <button
                    key={amt}
                    className="btn-app-secondary"
                    style={{ flex: 1, fontSize: '0.75rem', padding: '0.375rem 0.5rem' }}
                    onClick={() => setWater(w => Math.min(DAILY_TARGETS.water, +(w + amt).toFixed(2)))}
                  >
                    +{amt}L
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Today's targets */}
          <div className="app-card">
            <div className="app-card-header">
              <span className="app-card-title">🎯 Daily Targets</span>
            </div>
            <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { label: 'Protein', value: totals.protein, target: DAILY_TARGETS.protein, color: '#1c6b3a' },
                { label: 'Net Carbs', value: totals.carbs, target: DAILY_TARGETS.carbs, color: '#9b4dca' },
                { label: 'Fat', value: totals.fat, target: DAILY_TARGETS.fat, color: '#d97416' },
              ].map(({ label, value, target, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>{label}</span>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'DM Sans, monospace', color: 'var(--charcoal)' }}>
                      {value}g / {target}g
                    </span>
                  </div>
                  <div style={{ background: 'var(--app-border)', borderRadius: 100, height: 5, overflow: 'hidden' }}>
                    <div style={{
                      background: color,
                      width: `${Math.min(100, (value / target) * 100)}%`,
                      height: '100%', borderRadius: 100, transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="app-card">
            <div className="app-card-header">
              <span className="app-card-title">Quick Links</span>
            </div>
            <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {[
                { to: '/app/meals', label: '🍽️ Browse Meals' },
                { to: '/app/shopping', label: '🛒 Shopping List' },
                { to: '/app/workouts', label: '💪 Log Workout' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="btn-app-ghost" style={{
                  justifyContent: 'flex-start', padding: '0.5rem 0.625rem',
                  borderRadius: 8, fontFamily: 'DM Sans, sans-serif',
                }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function MacroCard({ label, value, target, unit, icon, color }) {
  const pct = Math.min(100, (value / target) * 100)
  return (
    <div className="app-card" style={{ padding: '1rem 1.125rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <span style={{ color, fontSize: '0.9rem' }}>
          {typeof icon === 'string' ? icon : icon}
        </span>
      </div>
      <div style={{
        fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 900,
        color: 'var(--charcoal)', lineHeight: 1, marginBottom: '0.25rem',
      }}>
        {value}
        <span style={{ fontSize: '0.75rem', fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.25rem' }}>
          {unit}
        </span>
      </div>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-subtle)', fontFamily: 'DM Sans, sans-serif', marginBottom: '0.5rem' }}>
        of {target}{unit} target
      </div>
      <div style={{ background: 'var(--app-border)', borderRadius: 100, height: 4, overflow: 'hidden' }}>
        <div style={{
          background: color, width: `${pct}%`,
          height: '100%', borderRadius: 100, transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  )
}

function MealRow({ meal, onToggle }) {
  const done = meal.status === 'completed'
  const skipped = meal.status === 'skipped'
  const hasCalories = meal.macros.calories > 0

  return (
    <div className="app-card" style={{
      padding: '0.875rem 1.125rem',
      display: 'flex', alignItems: 'center', gap: '0.875rem',
      opacity: skipped ? 0.5 : 1,
      borderLeft: done ? '3px solid #16a34a' : '3px solid transparent',
    }}>
      {/* Check button */}
      <button
        onClick={() => onToggle(meal.id)}
        style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          border: done ? 'none' : '2px solid var(--app-border-strong)',
          background: done ? '#16a34a' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
        title={done ? 'Mark unfinished' : 'Mark eaten'}
      >
        {done && <Check size={14} color="white" strokeWidth={3} />}
      </button>

      {/* Emoji */}
      <span style={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>{meal.emoji}</span>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className={`meal-time-badge ${meal.time}`}>{TIME_LABELS[meal.time]}</span>
        </div>
        <div style={{
          fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.9rem',
          color: 'var(--charcoal)', lineHeight: 1.2,
          textDecoration: done ? 'line-through' : 'none',
          textDecorationColor: '#16a34a',
        }}>
          {meal.name}
        </div>
      </div>

      {/* Macros */}
      {hasCalories && (
        <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span className="macro-tag protein">{meal.macros.protein}g P</span>
          <span className="macro-tag carbs">{meal.macros.carbs}g C</span>
          <span className="macro-tag fat">{meal.macros.fat}g F</span>
        </div>
      )}
    </div>
  )
}
