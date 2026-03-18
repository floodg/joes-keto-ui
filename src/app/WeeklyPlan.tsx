import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Check } from 'lucide-react'
import type { MealTime, MealStatus, MealCatalogEntry, WeekPlan } from './types'

const MEAL_TIMES: MealTime[] = ['breakfast', 'lunch', 'dinner', 'snack']

const TIME_EMOJIS: Record<MealTime, string> = {
  breakfast: '☀️', lunch: '🌤️', dinner: '🌙', snack: '⚡',
}

const TIME_LABELS: Record<MealTime, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack',
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const MEALS_CATALOG: MealCatalogEntry[] = [
  { id: 'bw', name: 'Black Coffee / Water',    emoji: '☕', macros: { fat: 0,  protein: 0,  carbs: 0 } },
  { id: 'mt', name: 'Mince Taco Bowl',         emoji: '🌮', macros: { fat: 30, protein: 55, carbs: 8 } },
  { id: 'sg', name: 'Steak + Greens',          emoji: '🥩', macros: { fat: 22, protein: 48, carbs: 4 } },
  { id: 'ss', name: 'Salmon Salad',            emoji: '🐟', macros: { fat: 18, protein: 38, carbs: 5 } },
  { id: 'ca', name: 'Chicken + Avocado Salad', emoji: '🥗', macros: { fat: 20, protein: 42, carbs: 4 } },
  { id: 'mb', name: 'Mince Bowl',              emoji: '🥩', macros: { fat: 28, protein: 52, carbs: 3 } },
  { id: 'sa', name: 'Salmon + Avocado Salad',  emoji: '🍣', macros: { fat: 22, protein: 36, carbs: 3 } },
  { id: 'dt', name: 'Daily Targets',           emoji: '🎯', macros: { fat: 0,  protein: 0,  carbs: 0 } },
]

type DaySchedule = Partial<Record<MealTime, string>>

const INITIAL_DAY_PLANS: DaySchedule[] = [
  { breakfast: 'bw', lunch: 'mt', dinner: 'sg', snack: 'dt' },
  { breakfast: 'bw', lunch: 'mt', dinner: 'ca', snack: 'dt' },
  { breakfast: 'bw', lunch: 'mt', dinner: 'mb', snack: 'dt' },
  { breakfast: 'bw', lunch: 'mt', dinner: 'sg', snack: 'dt' },
  { breakfast: 'bw', lunch: 'ss', dinner: 'sa', snack: 'dt' },
  { breakfast: 'bw', lunch: 'mt', dinner: 'mb', snack: 'dt' },
  { breakfast: 'bw', lunch: 'mt', dinner: 'ca', snack: 'dt' },
]

function buildInitialPlan(): WeekPlan {
  const plan: WeekPlan = {}
  for (let d = 0; d < 7; d++) {
    plan[d] = {}
    for (const time of MEAL_TIMES) {
      const mealId = INITIAL_DAY_PLANS[d][time]
      if (mealId) {
        plan[d][time] = {
          id: `${d}-${time}`,
          mealId,
          status: (d === 0 && time === 'breakfast') ? 'completed' : 'planned',
        }
      }
    }
  }
  return plan
}

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString()
}

interface AddSlot { dayIdx: number; time: MealTime }

export default function WeeklyPlan() {
  const [weekStart, setWeekStart] = useState<Date>(() => getMondayOfWeek(new Date()))
  const [plan, setPlan] = useState<WeekPlan>(buildInitialPlan)
  const [addingSlot, setAddingSlot] = useState<AddSlot | null>(null)
  const [pickingMeal, setPickingMeal] = useState('')

  const today = new Date()
  const weekDates = DAYS.map((_, i) => addDays(weekStart, i))

  const getMeal = (mealId: string): MealCatalogEntry | undefined =>
    MEALS_CATALOG.find(m => m.id === mealId)

  const toggleStatus = (dayIdx: number, time: MealTime) => {
    setPlan(prev => {
      const slot = prev[dayIdx]?.[time]
      if (!slot) return prev
      const next: MealStatus = slot.status === 'completed' ? 'planned' : 'completed'
      return { ...prev, [dayIdx]: { ...prev[dayIdx], [time]: { ...slot, status: next } } }
    })
  }

  const removeSlot = (dayIdx: number, time: MealTime) => {
    setPlan(prev => {
      const day = { ...prev[dayIdx] }
      delete day[time]
      return { ...prev, [dayIdx]: day }
    })
  }

  const addMeal = () => {
    if (!addingSlot || !pickingMeal) return
    const { dayIdx, time } = addingSlot
    setPlan(prev => ({
      ...prev,
      [dayIdx]: {
        ...prev[dayIdx],
        [time]: { id: `${Date.now()}`, mealId: pickingMeal, status: 'planned' },
      },
    }))
    setAddingSlot(null)
    setPickingMeal('')
  }

  const getDayCarbs = (dayIdx: number): number => {
    const dayPlan = plan[dayIdx] ?? {}
    return Object.values(dayPlan).reduce((sum, slot) => {
      return sum + (getMeal(slot.mealId)?.macros.carbs ?? 0)
    }, 0)
  }

  return (
    <div>
      <div className="page-header-bar">
        <div>
          <p className="page-eyebrow">Meal Planning</p>
          <h1 className="page-title">Weekly <em>Plan</em></h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="btn-app-ghost" onClick={() => setWeekStart(d => addDays(d, -7))}>
            <ChevronLeft size={18} />
          </button>
          <button className="btn-app-secondary" onClick={() => setWeekStart(getMondayOfWeek(new Date()))}
            style={{ fontSize: '0.8rem', padding: '0.375rem 0.875rem' }}>
            Today
          </button>
          <button className="btn-app-ghost" onClick={() => setWeekStart(d => addDays(d, 7))}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        {formatDate(weekDates[0])} → {formatDate(weekDates[6])}
      </p>

      {/* Grid */}
      <div style={{ overflowX: 'auto', borderRadius: 16, boxShadow: 'var(--card-shadow)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `80px repeat(7, minmax(130px, 1fr))`,
          background: 'var(--app-surface)',
          border: '1px solid var(--app-border)',
          borderRadius: 16, overflow: 'hidden', minWidth: 760,
        }}>
          {/* Header */}
          <div style={{ background: 'var(--charcoal)', padding: '0.875rem 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
              Meal
            </span>
          </div>

          {weekDates.map((date, i) => {
            const isToday = isSameDay(date, today)
            const carbs = getDayCarbs(i)
            return (
              <div key={i} style={{
                background: isToday ? 'rgba(185,90,16,0.18)' : 'var(--charcoal)',
                padding: '0.625rem 0.5rem', textAlign: 'center',
                borderLeft: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: isToday ? '#efaa52' : 'rgba(255,255,255,0.5)', marginBottom: '0.125rem' }}>
                  {DAYS[i]}
                </div>
                <div style={{ fontSize: '0.75rem', color: isToday ? '#efaa52' : 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                  {date.getDate()}/{date.getMonth() + 1}
                </div>
                <div style={{ fontSize: '0.6rem', fontFamily: 'DM Sans, monospace', color: carbs > 25 ? '#fca5a5' : 'rgba(255,255,255,0.35)', marginTop: '0.125rem' }}>
                  {carbs}g carbs
                </div>
              </div>
            )
          })}

          {/* Rows */}
          {MEAL_TIMES.map(time => (
            <>
              <div key={`label-${time}`} style={{
                padding: '0.75rem 0.5rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                borderTop: '1px solid var(--app-border)', background: 'var(--app-bg)', gap: '0.2rem',
              }}>
                <span style={{ fontSize: '1rem' }}>{TIME_EMOJIS[time]}</span>
                <span style={{ fontSize: '0.55rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                  {TIME_LABELS[time]}
                </span>
              </div>

              {weekDates.map((date, dayIdx) => {
                const slot = plan[dayIdx]?.[time]
                const meal = slot ? getMeal(slot.mealId) : undefined
                const isToday = isSameDay(date, today)

                return (
                  <div key={`${dayIdx}-${time}`} style={{
                    padding: '0.375rem',
                    borderTop: '1px solid var(--app-border)',
                    borderLeft: '1px solid var(--app-border)',
                    background: isToday ? 'rgba(185,90,16,0.04)' : 'transparent',
                    minHeight: 80, display: 'flex', alignItems: 'stretch',
                  }}>
                    {meal && slot ? (
                      <div style={{
                        width: '100%', borderRadius: 10, padding: '0.5rem',
                        background: slot.status === 'completed' ? '#f0fdf4' : slot.status === 'skipped' ? '#f9fafb' : '#eff6ff',
                        border: `1px solid ${slot.status === 'completed' ? '#bbf7d0' : slot.status === 'skipped' ? '#e5e7eb' : '#bfdbfe'}`,
                        display: 'flex', flexDirection: 'column', gap: '0.3rem', position: 'relative',
                      }}>
                        <button
                          onClick={() => removeSlot(dayIdx, time)}
                          className="plan-remove-btn"
                          style={{
                            position: 'absolute', top: 3, right: 3,
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#cbd5e1', fontSize: '0.7rem', lineHeight: 1,
                            padding: 2, borderRadius: 4,
                          }}
                        >
                          ✕
                        </button>
                        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{meal.emoji}</span>
                        <span style={{
                          fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.7rem',
                          color: slot.status === 'completed' ? '#15803d' : 'var(--charcoal)',
                          lineHeight: 1.2,
                          textDecoration: slot.status === 'completed' ? 'line-through' : 'none',
                          textDecorationColor: '#86efac',
                        }}>
                          {meal.name}
                        </span>
                        {meal.macros.carbs > 0 && (
                          <span style={{ fontSize: '0.6rem', fontFamily: 'DM Sans, monospace', color: 'var(--text-muted)' }}>
                            {meal.macros.carbs}g C · {meal.macros.protein}g P
                          </span>
                        )}
                        {slot.status === 'planned' ? (
                          <button
                            onClick={() => toggleStatus(dayIdx, time)}
                            style={{
                              marginTop: 'auto', background: '#16a34a', color: 'white',
                              border: 'none', borderRadius: 4, padding: '0.175rem 0.375rem',
                              fontSize: '0.6rem', fontWeight: 700, cursor: 'pointer',
                              letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.2rem',
                            }}
                          >
                            <Check size={10} /> Eat
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.6rem', color: '#15803d', fontWeight: 700, letterSpacing: '0.04em' }}>
                            ✓ Eaten
                          </span>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingSlot({ dayIdx, time })}
                        className="plan-add-btn"
                        style={{
                          width: '100%', minHeight: 70, background: 'transparent',
                          border: '1.5px dashed var(--app-border)',
                          color: 'var(--text-subtle)', borderRadius: 10,
                          cursor: 'pointer', fontSize: '1.125rem', transition: 'all 0.15s',
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </div>

      {/* Add meal modal */}
      {addingSlot && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(28,26,23,0.6)',
            backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000, padding: '1rem',
          }}
          onClick={() => setAddingSlot(null)}
        >
          <div className="app-card" style={{ maxWidth: 400, width: '100%', padding: '1.5rem' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', margin: 0, color: 'var(--charcoal)' }}>
                  Add Meal
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.125rem 0 0', fontFamily: 'DM Sans, sans-serif' }}>
                  {TIME_LABELS[addingSlot.time]} · {DAYS[addingSlot.dayIdx]} {formatDate(weekDates[addingSlot.dayIdx])}
                </p>
              </div>
              <button className="btn-app-ghost" onClick={() => setAddingSlot(null)} style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            <label className="app-label">Choose a meal</label>
            <select
              className="app-input"
              value={pickingMeal}
              onChange={e => setPickingMeal(e.target.value)}
              style={{ marginBottom: '1rem' }}
            >
              <option value="">Select a meal…</option>
              {MEALS_CATALOG.map(m => (
                <option key={m.id} value={m.id}>
                  {m.emoji} {m.name} {m.macros.carbs > 0 ? `· ${m.macros.carbs}g carbs` : ''}
                </option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end' }}>
              <button className="btn-app-secondary" onClick={() => setAddingSlot(null)}>Cancel</button>
              <button className="btn-app-primary" onClick={addMeal} disabled={!pickingMeal}>
                Add to Plan
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .plan-remove-btn { opacity: 0; transition: opacity 0.15s; }
        div:hover > .plan-remove-btn { opacity: 1; }
        .plan-add-btn:hover {
          border-color: var(--brand) !important;
          color: var(--brand) !important;
          background: var(--brand-light) !important;
        }
      `}</style>
    </div>
  )
}
