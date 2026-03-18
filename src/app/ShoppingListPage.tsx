import { useState } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, ShoppingCart, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type Category =
  | 'Produce'
  | 'Meat & Seafood'
  | 'Dairy & Eggs'
  | 'Deli & Cheese'
  | 'Pantry'
  | 'Frozen'
  | 'Bakery'
  | 'Other'

interface ShoppingItem {
  id: string
  name: string
  qty: string
  category: Category
  checked: boolean
  note?: string
}

// ── Sample data (replace with Supabase in production) ─────────────────────────

const INITIAL_ITEMS: ShoppingItem[] = [
  { id: '1',  name: 'Avocados',             qty: '4',       category: 'Produce',       checked: false },
  { id: '2',  name: 'Spinach (baby)',        qty: '120g',    category: 'Produce',       checked: false },
  { id: '3',  name: 'Broccoli',             qty: '1 head',  category: 'Produce',       checked: false },
  { id: '4',  name: 'Zucchini',             qty: '2',       category: 'Produce',       checked: false },
  { id: '5',  name: 'Chicken thighs',       qty: '1 kg',    category: 'Meat & Seafood', checked: false },
  { id: '6',  name: 'Beef mince',           qty: '500g',    category: 'Meat & Seafood', checked: false },
  { id: '7',  name: 'Salmon fillets',       qty: '2',       category: 'Meat & Seafood', checked: false },
  { id: '8',  name: 'Eggs (free range)',     qty: '12',      category: 'Dairy & Eggs',  checked: false },
  { id: '9',  name: 'Cream cheese',         qty: '250g',    category: 'Dairy & Eggs',  checked: false },
  { id: '10', name: 'Heavy cream',          qty: '300ml',   category: 'Dairy & Eggs',  checked: false },
  { id: '11', name: 'Butter (unsalted)',     qty: '250g',    category: 'Dairy & Eggs',  checked: false },
  { id: '12', name: 'Parmesan',             qty: '100g',    category: 'Deli & Cheese', checked: false },
  { id: '13', name: 'Olive oil (extra virgin)', qty: '1 bottle', category: 'Pantry',   checked: false },
  { id: '14', name: 'Almond flour',         qty: '500g',    category: 'Pantry',        checked: false },
  { id: '15', name: 'Coconut aminos',       qty: '1 bottle', category: 'Pantry',       checked: false },
]

const CATEGORIES: Category[] = [
  'Produce',
  'Meat & Seafood',
  'Dairy & Eggs',
  'Deli & Cheese',
  'Pantry',
  'Frozen',
  'Bakery',
  'Other',
]

const CATEGORY_EMOJI: Record<Category, string> = {
  'Produce':       '🥦',
  'Meat & Seafood':'🥩',
  'Dairy & Eggs':  '🥚',
  'Deli & Cheese': '🧀',
  'Pantry':        '🫙',
  'Frozen':        '🧊',
  'Bakery':        '🍞',
  'Other':         '🛒',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingItem[]>(INITIAL_ITEMS)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<Category>>(new Set())
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newQty, setNewQty] = useState('')
  const [newCategory, setNewCategory] = useState<Category>('Other')
  const [hideChecked, setHideChecked] = useState(false)

  // Stats
  const total = items.length
  const checked = items.filter(i => i.checked).length
  const remaining = total - checked
  const pct = total === 0 ? 0 : Math.round((checked / total) * 100)

  // Group by category, filter if needed
  const visibleItems = hideChecked ? items.filter(i => !i.checked) : items
  const grouped = CATEGORIES.reduce<Record<Category, ShoppingItem[]>>((acc, cat) => {
    acc[cat] = visibleItems.filter(i => i.category === cat)
    return acc
  }, {} as Record<Category, ShoppingItem[]>)
  const activeCategories = CATEGORIES.filter(cat => grouped[cat].length > 0)

  function toggleItem(id: string) {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, checked: !i.checked } : i))
    )
  }

  function deleteItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function resetAll() {
    setItems(prev => prev.map(i => ({ ...i, checked: false })))
  }

  function clearChecked() {
    setItems(prev => prev.filter(i => !i.checked))
  }

  function toggleCategory(cat: Category) {
    setCollapsedCategories(prev => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  function addItem(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    const item: ShoppingItem = {
      id: uid(),
      name: newName.trim(),
      qty: newQty.trim(),
      category: newCategory,
      checked: false,
    }
    setItems(prev => [...prev, item])
    setNewName('')
    setNewQty('')
    setShowAddForm(false)
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="page-header-bar">
        <div>
          <div className="page-eyebrow">Coles Run</div>
          <h1 className="page-title">🛒 Shopping <em>List</em></h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setHideChecked(h => !h)}
            className="btn-app-secondary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem' }}
          >
            {hideChecked ? 'Show all' : 'Hide done'}
          </button>
          <button
            onClick={() => setShowAddForm(s => !s)}
            className="btn-app-primary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem' }}
          >
            <Plus size={14} /> Add item
          </button>
        </div>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────── */}
      <div className="app-card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ padding: '1rem 1.25rem' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: '0.5rem',
          }}>
            <span style={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
              fontSize: '0.85rem', color: 'var(--charcoal)',
            }}>
              {checked} of {total} items
            </span>
            <span style={{
              fontFamily: 'DM Sans, monospace', fontSize: '0.75rem',
              fontWeight: 700, color: checked === total && total > 0 ? 'var(--protein-color)' : 'var(--brand)',
            }}>
              {pct}%
            </span>
          </div>
          <div style={{
            height: 8, borderRadius: 100, background: 'var(--app-border)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 100,
              width: `${pct}%`,
              background: checked === total && total > 0
                ? 'var(--protein-color)'
                : 'var(--brand)',
              transition: 'width 0.3s ease',
            }} />
          </div>
          {checked === total && total > 0 && (
            <p style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem',
              color: 'var(--protein-color)', fontWeight: 600,
              marginTop: '0.5rem', textAlign: 'center',
            }}>
              ✅ All done — great shop!
            </p>
          )}
        </div>

        {/* Actions row */}
        {checked > 0 && (
          <div style={{
            borderTop: '1px solid var(--app-border)',
            padding: '0.625rem 1.25rem',
            display: 'flex', gap: '0.5rem',
          }}>
            <button onClick={clearChecked} className="btn-app-ghost" style={{ fontSize: '0.75rem' }}>
              <Trash2 size={12} /> Clear {checked} done
            </button>
            <button onClick={resetAll} className="btn-app-ghost" style={{ fontSize: '0.75rem' }}>
              <RotateCcw size={12} /> Uncheck all
            </button>
          </div>
        )}
      </div>

      {/* ── Add item form ─────────────────────────────────────────────── */}
      {showAddForm && (
        <div className="app-card" style={{ marginBottom: '1.25rem' }}>
          <div className="app-card-header">
            <span className="app-card-title">New item</span>
          </div>
          <div className="app-card-body">
            <form onSubmit={addItem}>
              <div className="form-group">
                <label className="app-label">Item name</label>
                <input
                  className="app-input"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Chicken thighs"
                  autoFocus
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="app-label">Qty / amount</label>
                  <input
                    className="app-input"
                    value={newQty}
                    onChange={e => setNewQty(e.target.value)}
                    placeholder="e.g. 500g"
                  />
                </div>
                <div className="form-group">
                  <label className="app-label">Category</label>
                  <select
                    className="app-input"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as Category)}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{CATEGORY_EMOJI[c]} {c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-app-secondary"
                  style={{ fontSize: '0.875rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-app-primary"
                  style={{ fontSize: '0.875rem' }}
                  disabled={!newName.trim()}
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────────── */}
      {activeCategories.length === 0 && (
        <div className="app-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <ShoppingCart size={40} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem' }} />
          <p style={{
            fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)',
            fontSize: '0.95rem',
          }}>
            {hideChecked ? 'All items checked off! 🎉' : 'No items yet. Tap "Add item" to get started.'}
          </p>
        </div>
      )}

      {/* ── Category groups ───────────────────────────────────────────── */}
      {activeCategories.map(cat => {
        const catItems = grouped[cat]
        const catChecked = catItems.filter(i => i.checked).length
        const isCollapsed = collapsedCategories.has(cat)

        return (
          <div key={cat} style={{ marginBottom: '0.75rem' }}>
            {/* Category header */}
            <button
              onClick={() => toggleCategory(cat)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 8,
                marginBottom: isCollapsed ? 0 : '0.25rem',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{CATEGORY_EMOJI[cat]}</span>
              <span style={{
                fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
                fontSize: '0.8rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--text-muted)',
                flex: 1, textAlign: 'left',
              }}>
                {cat}
              </span>
              <span style={{
                fontFamily: 'DM Sans, monospace', fontSize: '0.7rem',
                fontWeight: 600, color: catChecked === catItems.length ? 'var(--protein-color)' : 'var(--text-subtle)',
                background: catChecked === catItems.length ? '#e8f5ee' : 'var(--app-border)',
                padding: '0.15rem 0.5rem',
                borderRadius: 100,
              }}>
                {catChecked}/{catItems.length}
              </span>
              {isCollapsed
                ? <ChevronRight size={14} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
                : <ChevronDown size={14} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
              }
            </button>

            {/* Items */}
            {!isCollapsed && (
              <div className="app-card" style={{ overflow: 'hidden' }}>
                {catItems.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.875rem 1rem',
                      borderBottom: idx < catItems.length - 1 ? '1px solid var(--app-border)' : 'none',
                      background: item.checked ? '#f9f6f1' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleItem(item.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: 0, flexShrink: 0, display: 'flex', alignItems: 'center',
                        color: item.checked ? 'var(--protein-color)' : 'var(--app-border-strong)',
                        transition: 'color 0.15s',
                      }}
                      aria-label={item.checked ? 'Uncheck' : 'Check'}
                    >
                      {item.checked
                        ? <CheckCircle2 size={26} />
                        : <Circle size={26} />
                      }
                    </button>

                    {/* Name + qty */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: item.checked ? 'var(--text-subtle)' : 'var(--charcoal)',
                        textDecoration: item.checked ? 'line-through' : 'none',
                        transition: 'all 0.15s',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {item.name}
                      </div>
                      {item.qty && (
                        <div style={{
                          fontFamily: 'DM Sans, monospace',
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          marginTop: '0.1rem',
                        }}>
                          {item.qty}
                        </div>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => deleteItem(item.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '0.25rem', flexShrink: 0, display: 'flex',
                        alignItems: 'center',
                        color: 'var(--text-subtle)',
                        opacity: 0.5,
                        transition: 'opacity 0.15s',
                      }}
                      aria-label="Remove item"
                      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Bottom spacer for mobile scrolling past last item */}
      <div style={{ height: '3rem' }} />

      {/* ── Mobile-friendly responsive styles ────────────────────────── */}
      <style>{`
        @media (max-width: 640px) {
          .page-header-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}
