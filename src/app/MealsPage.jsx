import { useState } from 'react'
import { Clock, Flame, Plus, Trash2 } from 'lucide-react'
import ListPage from '../components/ui/ListPage'

// Mock meals data
const INITIAL_MEALS = [
  {
    id: '1', name: 'Black Coffee / Water', emoji: '☕',
    tags: ['keto', 'morning', 'fasting'],
    prepTimeMins: 0, cookTimeMins: 0,
    macros: { fat: 0, protein: 0, carbs: 0, calories: 0 },
    ingredients: [],
    instructions: ['Brew black coffee (no milk, sugar, or cream).', 'Aim for 3–4L of water throughout the day.'],
  },
  {
    id: '2', name: '250g Mince Taco Bowl', emoji: '🌮',
    tags: ['keto', 'mince', 'taco'],
    prepTimeMins: 5, cookTimeMins: 10,
    macros: { fat: 30, protein: 55, carbs: 8, calories: 522 },
    ingredients: [
      { name: 'Beef mince', quantity: '250g' },
      { name: 'Lettuce', quantity: '1 serving' },
      { name: 'Shredded cheese', quantity: '30g' },
      { name: 'Sour cream', quantity: '2 tbsp' },
      { name: 'Avocado', quantity: '0.5' },
    ],
    instructions: [
      'Brown beef mince over medium-high heat.',
      'Season with taco spices to taste.',
      'Assemble over shredded lettuce.',
      'Top with cheese, sour cream, and sliced avocado.',
    ],
  },
  {
    id: '3', name: 'Steak + Greens', emoji: '🥩',
    tags: ['keto', 'steak', 'protein-focused'],
    prepTimeMins: 5, cookTimeMins: 12,
    macros: { fat: 22, protein: 48, carbs: 4, calories: 394 },
    ingredients: [
      { name: 'Beef steak', quantity: '200g' },
      { name: 'Mixed greens', quantity: '2 cups' },
      { name: 'Olive oil', quantity: '1 tbsp' },
    ],
    instructions: [
      'Season steak with salt and pepper.',
      'Sear in hot pan 3–4 mins each side.',
      'Rest 2 mins, serve over greens.',
    ],
  },
  {
    id: '4', name: 'Salmon Salad', emoji: '🐟',
    tags: ['keto', 'salad', 'salmon'],
    prepTimeMins: 10, cookTimeMins: 10,
    macros: { fat: 18, protein: 38, carbs: 5, calories: 330 },
    ingredients: [
      { name: 'Salmon fillet', quantity: '1 serving' },
      { name: 'Lettuce', quantity: '1 serving' },
      { name: 'Cucumber', quantity: '0.5' },
      { name: 'Cherry tomatoes', quantity: '4–6' },
      { name: 'Avocado', quantity: '0.5' },
    ],
    instructions: [
      'Pan-fry salmon 4–5 mins each side.',
      'Assemble salad base.',
      'Top with salmon and olive oil dressing.',
    ],
  },
  {
    id: '5', name: 'Chicken + Avocado Salad', emoji: '🥗',
    tags: ['keto', 'chicken', 'salad'],
    prepTimeMins: 10, cookTimeMins: 15,
    macros: { fat: 20, protein: 42, carbs: 4, calories: 356 },
    ingredients: [
      { name: 'Chicken breast', quantity: '200g' },
      { name: 'Avocado', quantity: '1 medium' },
      { name: 'Mixed greens', quantity: '2 cups' },
    ],
    instructions: [
      'Season and grill chicken 6–7 mins each side.',
      'Slice chicken and avocado.',
      'Assemble with greens and lemon dressing.',
    ],
  },
]

const EMPTY_FORM = {
  name: '', emoji: '🍽️', tags: '',
  prepTimeMins: '', cookTimeMins: '',
  calories: '', fat: '', protein: '', carbs: '',
  ingredients: [],
  instructions: [],
}

export default function MealsPage() {
  const [meals, setMeals] = useState(INITIAL_MEALS)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)

  const handleSelect = (meal) => {
    setEditingId(meal.id)
    setForm({
      name: meal.name,
      emoji: meal.emoji,
      tags: meal.tags.join(', '),
      prepTimeMins: meal.prepTimeMins ?? '',
      cookTimeMins: meal.cookTimeMins ?? '',
      calories: meal.macros.calories ?? '',
      fat: meal.macros.fat ?? '',
      protein: meal.macros.protein ?? '',
      carbs: meal.macros.carbs ?? '',
      ingredients: meal.ingredients.map(i => ({ ...i })),
      instructions: [...meal.instructions],
    })
  }

  const handleSave = (onClose) => {
    if (!form.name.trim()) return
    const mealData = {
      name: form.name.trim(),
      emoji: form.emoji || '🍽️',
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      prepTimeMins: parseInt(form.prepTimeMins) || 0,
      cookTimeMins: parseInt(form.cookTimeMins) || 0,
      macros: {
        calories: parseInt(form.calories) || 0,
        fat: parseInt(form.fat) || 0,
        protein: parseInt(form.protein) || 0,
        carbs: parseInt(form.carbs) || 0,
      },
      ingredients: form.ingredients.filter(i => i.name.trim()),
      instructions: form.instructions.filter(i => i.trim()),
    }

    if (editingId) {
      setMeals(prev => prev.map(m => m.id === editingId ? { ...m, ...mealData } : m))
    } else {
      setMeals(prev => [...prev, { ...mealData, id: Date.now().toString() }])
    }
    setForm(EMPTY_FORM)
    setEditingId(null)
    onClose()
  }

  const handleDelete = (id, onClose) => {
    setMeals(prev => prev.filter(m => m.id !== id))
    onClose()
  }

  // List item renderer
  const renderListItem = (meal, isSelected, onSelect) => (
    <button
      key={meal.id}
      onClick={() => { onSelect(meal); handleSelect(meal) }}
      style={{
        width: '100%', textAlign: 'left', background: 'none', border: 'none',
        cursor: 'pointer', padding: 0,
      }}
    >
      <div className="app-card" style={{
        padding: '0.875rem 1rem',
        borderLeft: isSelected ? '3px solid var(--brand)' : '3px solid transparent',
        background: isSelected ? 'rgba(185,90,16,0.04)' : 'var(--app-surface)',
        transition: 'all 0.15s',
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>{meal.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.9rem',
              color: 'var(--charcoal)', marginBottom: '0.25rem',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {meal.name}
            </div>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
              {meal.tags.slice(0, 3).map(tag => (
                <span key={tag} style={{
                  fontSize: '0.6rem', fontFamily: 'DM Sans, monospace', fontWeight: 600,
                  background: 'var(--app-bg)', color: 'var(--text-muted)',
                  padding: '0.15rem 0.4rem', borderRadius: 4,
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {meal.macros.carbs > 0 && (
                <span className="macro-tag carbs">{meal.macros.carbs}g C</span>
              )}
              {meal.macros.protein > 0 && (
                <span className="macro-tag protein">{meal.macros.protein}g P</span>
              )}
              {(meal.prepTimeMins > 0 || meal.cookTimeMins > 0) && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.65rem', color: 'var(--text-subtle)', fontFamily: 'DM Sans, sans-serif' }}>
                  <Clock size={11} />
                  {(meal.prepTimeMins || 0) + (meal.cookTimeMins || 0)}m
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  )

  // Detail / form renderer
  const renderDetail = (selectedMeal, onClose, panelMode, setPanelMode) => {
    if (panelMode === 'view' && selectedMeal) {
      const meal = meals.find(m => m.id === selectedMeal.id) || selectedMeal
      return (
        <div>
          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button
              className="btn-app-primary"
              style={{ flex: 1 }}
              onClick={() => { handleSelect(meal); setPanelMode('edit') }}
            >
              Edit Meal
            </button>
            <button
              className="btn-app-secondary btn-danger"
              onClick={() => handleDelete(meal.id, onClose)}
              style={{ padding: '0.5rem 0.75rem' }}
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          </div>

          {/* Meal info */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{meal.emoji}</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: 'var(--charcoal)', margin: '0 0 0.5rem' }}>
              {meal.name}
            </h3>
            <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {meal.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: '0.65rem', background: 'var(--app-bg)', color: 'var(--text-muted)',
                  padding: '0.2rem 0.5rem', borderRadius: 4, fontFamily: 'DM Sans, monospace', fontWeight: 600,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Macros */}
          {meal.macros.calories > 0 && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem',
              background: 'var(--app-bg)', borderRadius: 12, padding: '0.875rem',
              marginBottom: '1.25rem',
            }}>
              {[
                { label: 'Cal', value: meal.macros.calories, unit: '' },
                { label: 'Fat', value: meal.macros.fat, unit: 'g', color: 'var(--fat-color)' },
                { label: 'Protein', value: meal.macros.protein, unit: 'g', color: 'var(--protein-color)' },
                { label: 'Carbs', value: meal.macros.carbs, unit: 'g', color: 'var(--carb-color)' },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 900,
                    color: m.color || 'var(--charcoal)',
                  }}>
                    {m.value}{m.unit}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-subtle)', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Time */}
          {(meal.prepTimeMins > 0 || meal.cookTimeMins > 0) && (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
              {meal.prepTimeMins > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
                  <Clock size={14} /> Prep: {meal.prepTimeMins}m
                </div>
              )}
              {meal.cookTimeMins > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
                  <Flame size={14} /> Cook: {meal.cookTimeMins}m
                </div>
              )}
            </div>
          )}

          {/* Ingredients */}
          {meal.ingredients.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 0.625rem' }}>
                Ingredients ({meal.ingredients.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {meal.ingredients.map((ing, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.4rem 0.625rem', background: 'var(--app-bg)', borderRadius: 8,
                    fontSize: '0.85rem', fontFamily: 'DM Sans, sans-serif',
                  }}>
                    <span style={{ color: 'var(--charcoal)', fontWeight: 500 }}>{ing.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{ing.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {meal.instructions.length > 0 && (
            <div>
              <h4 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 0.625rem' }}>
                Instructions
              </h4>
              <ol style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {meal.instructions.map((step, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', color: 'var(--charcoal)', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )
    }

    // Edit / New form
    return (
      <MealForm
        form={form}
        setForm={setForm}
        onSave={() => handleSave(onClose)}
        onCancel={onClose}
        isNew={panelMode === 'new'}
      />
    )
  }

  return (
    <ListPage
      eyebrow="Food Library"
      title="My <em>Meals</em>"
      items={meals}
      renderListItem={renderListItem}
      renderDetail={renderDetail}
      searchPlaceholder="Search meals…"
      searchFilter={(meal, query) =>
        meal.name.toLowerCase().includes(query.toLowerCase()) ||
        meal.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      }
      addLabel="Add Meal"
      emptyIcon="🍽️"
      emptyText="No meals yet — add your first keto recipe!"
    />
  )
}

function MealForm({ form, setForm, onSave, onCancel, isNew }) {
  const setIng = (idx, field, val) => {
    setForm(f => {
      const ings = [...f.ingredients]
      ings[idx] = { ...ings[idx], [field]: val }
      return { ...f, ingredients: ings }
    })
  }

  const addIng = () => setForm(f => ({ ...f, ingredients: [...f.ingredients, { name: '', quantity: '' }] }))
  const removeIng = (idx) => setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, i) => i !== idx) }))

  const setStep = (idx, val) => {
    setForm(f => {
      const steps = [...f.instructions]
      steps[idx] = val
      return { ...f, instructions: steps }
    })
  }
  const addStep = () => setForm(f => ({ ...f, instructions: [...f.instructions, ''] }))
  const removeStep = (idx) => setForm(f => ({ ...f, instructions: f.instructions.filter((_, i) => i !== idx) }))

  return (
    <div>
      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--charcoal)', margin: '0 0 1.25rem' }}>
        {isNew ? 'New Meal' : 'Edit Meal'}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '3rem 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
        <div>
          <label className="app-label">Icon</label>
          <input
            className="app-input"
            value={form.emoji}
            onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
            style={{ textAlign: 'center', fontSize: '1.25rem', padding: '0.4rem' }}
            maxLength={2}
          />
        </div>
        <div>
          <label className="app-label">Meal Name *</label>
          <input
            className="app-input"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Mince Taco Bowl"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="app-label">Tags (comma-separated)</label>
        <input
          className="app-input"
          value={form.tags}
          onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
          placeholder="keto, mince, quick"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <label className="app-label">Prep (mins)</label>
          <input className="app-input" type="number" min="0" value={form.prepTimeMins}
            onChange={e => setForm(f => ({ ...f, prepTimeMins: e.target.value }))} />
        </div>
        <div>
          <label className="app-label">Cook (mins)</label>
          <input className="app-input" type="number" min="0" value={form.cookTimeMins}
            onChange={e => setForm(f => ({ ...f, cookTimeMins: e.target.value }))} />
        </div>
      </div>

      {/* Macros */}
      <div style={{ background: 'var(--app-bg)', borderRadius: 12, padding: '0.875rem', marginBottom: '1rem' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 0.625rem' }}>
          Macros (per serve)
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {[
            { key: 'calories', label: 'Calories' },
            { key: 'protein', label: 'Protein (g)' },
            { key: 'fat', label: 'Fat (g)' },
            { key: 'carbs', label: 'Carbs (g)' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="app-label" style={{ fontSize: '0.55rem' }}>{label}</label>
              <input
                className="app-input"
                type="number" min="0"
                style={{ padding: '0.4rem 0.5rem', fontSize: '0.85rem' }}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <p className="app-label" style={{ margin: 0 }}>Ingredients</p>
          <button className="btn-app-ghost" onClick={addIng} style={{ fontSize: '0.75rem', gap: '0.25rem' }}>
            <Plus size={13} /> Add
          </button>
        </div>
        {form.ingredients.length === 0 && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontFamily: 'DM Sans, sans-serif', fontStyle: 'italic' }}>No ingredients yet</p>
        )}
        {form.ingredients.map((ing, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 0.6fr auto', gap: '0.375rem', marginBottom: '0.375rem' }}>
            <input className="app-input" value={ing.name} placeholder="Ingredient"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.625rem' }}
              onChange={e => setIng(idx, 'name', e.target.value)} />
            <input className="app-input" value={ing.quantity} placeholder="Qty"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.625rem' }}
              onChange={e => setIng(idx, 'quantity', e.target.value)} />
            <button className="btn-app-ghost" onClick={() => removeIng(idx)} style={{ padding: '0.375rem', color: '#dc2626' }}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <p className="app-label" style={{ margin: 0 }}>Instructions</p>
          <button className="btn-app-ghost" onClick={addStep} style={{ fontSize: '0.75rem', gap: '0.25rem' }}>
            <Plus size={13} /> Add step
          </button>
        </div>
        {form.instructions.map((step, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5rem 1fr auto', gap: '0.375rem', marginBottom: '0.375rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontFamily: 'DM Sans, monospace', textAlign: 'center' }}>
              {idx + 1}.
            </span>
            <input
              className="app-input"
              value={step}
              onChange={e => setStep(idx, e.target.value)}
              placeholder={`Step ${idx + 1}`}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.625rem' }}
            />
            <button className="btn-app-ghost" onClick={() => removeStep(idx)} style={{ padding: '0.375rem', color: '#dc2626' }}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.625rem' }}>
        <button className="btn-app-primary" style={{ flex: 1 }} onClick={onSave} disabled={!form.name.trim()}>
          {isNew ? 'Add Meal' : 'Save Changes'}
        </button>
        <button className="btn-app-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}
