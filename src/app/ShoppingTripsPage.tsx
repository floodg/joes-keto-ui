import { useState } from 'react'
import { Plus, ShoppingBag, ChevronDown, ChevronRight, Trash2, Calendar, DollarSign, MapPin, Package } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface TripItem {
  id: string
  name: string
  qty: string
  price?: number
  category: string
}

interface ShoppingTrip {
  id: string
  date: string          // ISO date string YYYY-MM-DD
  store: string
  total?: number        // total spend AUD
  notes?: string
  items: TripItem[]
}

// ── Sample data (replace with Supabase in production) ─────────────────────────

const INITIAL_TRIPS: ShoppingTrip[] = [
  {
    id: 'trip-1',
    date: '2026-03-15',
    store: 'Coles',
    total: 87.40,
    notes: 'Weekly keto shop',
    items: [
      { id: 'i1', name: 'Chicken thighs', qty: '1 kg', price: 9.50,  category: 'Meat' },
      { id: 'i2', name: 'Avocados',        qty: '4',    price: 5.00,  category: 'Produce' },
      { id: 'i3', name: 'Eggs (free range)', qty: '12', price: 6.90,  category: 'Dairy & Eggs' },
      { id: 'i4', name: 'Heavy cream',      qty: '300ml', price: 3.50, category: 'Dairy & Eggs' },
      { id: 'i5', name: 'Spinach',          qty: '120g', price: 3.00,  category: 'Produce' },
      { id: 'i6', name: 'Parmesan',         qty: '100g', price: 5.50,  category: 'Deli' },
      { id: 'i7', name: 'Almond flour',     qty: '500g', price: 12.00, category: 'Pantry' },
      { id: 'i8', name: 'Butter',           qty: '250g', price: 4.50,  category: 'Dairy & Eggs' },
      { id: 'i9', name: 'Beef mince',       qty: '500g', price: 8.90,  category: 'Meat' },
      { id: 'i10', name: 'Broccoli',        qty: '1 head', price: 2.50, category: 'Produce' },
    ],
  },
  {
    id: 'trip-2',
    date: '2026-03-08',
    store: 'Coles',
    total: 62.15,
    notes: 'Top-up mid-week',
    items: [
      { id: 'j1', name: 'Salmon fillets',  qty: '2',    price: 14.00, category: 'Meat' },
      { id: 'j2', name: 'Cream cheese',    qty: '250g', price: 4.50,  category: 'Dairy & Eggs' },
      { id: 'j3', name: 'Zucchini',        qty: '3',    price: 3.00,  category: 'Produce' },
      { id: 'j4', name: 'Olive oil',       qty: '1L',   price: 9.50,  category: 'Pantry' },
      { id: 'j5', name: 'Coconut aminos',  qty: '250ml', price: 7.00, category: 'Pantry' },
      { id: 'j6', name: 'Cauliflower',     qty: '1 head', price: 4.50, category: 'Produce' },
    ],
  },
  {
    id: 'trip-3',
    date: '2026-03-01',
    store: 'Woolworths',
    total: 45.80,
    items: [
      { id: 'k1', name: 'Pork belly',       qty: '600g', price: 11.00, category: 'Meat' },
      { id: 'k2', name: 'Macadamia nuts',   qty: '200g', price: 8.50,  category: 'Pantry' },
      { id: 'k3', name: 'MCT oil',          qty: '500ml', price: 18.00, category: 'Pantry' },
      { id: 'k4', name: 'Baby bok choy',    qty: '2',    price: 3.00,  category: 'Produce' },
    ],
  },
]

const STORES = ['Coles', 'Woolworths', 'ALDI', 'IGA', 'Harris Farm', 'Other']
const CATEGORIES = ['Produce', 'Meat', 'Dairy & Eggs', 'Deli', 'Pantry', 'Frozen', 'Other']

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2, 9) }

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function formatRelative(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  const now = new Date()
  const diffDays = Math.round((now.getTime() - d.getTime()) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return '1 week ago'
  return `${Math.round(diffDays / 7)} weeks ago`
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TripCard({ trip, onDelete }: { trip: ShoppingTrip; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const itemCount = trip.items.length

  return (
    <div className="app-card" style={{ marginBottom: '0.75rem' }}>
      {/* Header row */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '1rem 1.125rem', textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: '0.875rem',
        }}
      >
        {/* Store icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: trip.store === 'Coles' ? '#e8f0fe'
            : trip.store === 'Woolworths' ? '#e8f5ee'
            : 'var(--brand-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.25rem',
        }}>
          🛒
        </div>

        {/* Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
            fontSize: '0.95rem', color: 'var(--charcoal)',
            display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap',
          }}>
            {trip.store}
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', background: 'var(--app-border)',
              color: 'var(--text-muted)', padding: '0.15rem 0.5rem', borderRadius: 100,
            }}>
              {itemCount} item{itemCount !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{
            display: 'flex', gap: '0.875rem', marginTop: '0.2rem', flexWrap: 'wrap',
          }}>
            <span style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem',
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem',
            }}>
              <Calendar size={11} />
              {formatRelative(trip.date)} · {formatDate(trip.date)}
            </span>
          </div>
        </div>

        {/* Spend + expand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {trip.total !== undefined && (
            <div style={{
              fontFamily: 'DM Sans, monospace', fontWeight: 700,
              fontSize: '1rem', color: 'var(--charcoal)',
            }}>
              ${trip.total.toFixed(2)}
            </div>
          )}
          {expanded
            ? <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
            : <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          }
        </div>
      </button>

      {/* Expanded: notes + items */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--app-border)' }}>
          {trip.notes && (
            <div style={{
              padding: '0.625rem 1.125rem',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem',
              color: 'var(--text-muted)', fontStyle: 'italic',
              borderBottom: '1px solid var(--app-border)',
            }}>
              {trip.notes}
            </div>
          )}

          {/* Items list */}
          {trip.items.map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.625rem 1.125rem',
                borderBottom: idx < trip.items.length - 1 ? '1px solid var(--app-border)' : 'none',
                background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
              }}
            >
              <Package size={13} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem',
                color: 'var(--charcoal)', flex: 1,
              }}>
                {item.name}
              </span>
              <span style={{
                fontFamily: 'DM Sans, monospace', fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}>
                {item.qty}
              </span>
              {item.price !== undefined && (
                <span style={{
                  fontFamily: 'DM Sans, monospace', fontSize: '0.8rem',
                  fontWeight: 600, color: 'var(--charcoal)', minWidth: 48, textAlign: 'right',
                }}>
                  ${item.price.toFixed(2)}
                </span>
              )}
            </div>
          ))}

          {/* Footer: total + delete */}
          <div style={{
            padding: '0.75rem 1.125rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: '1px solid var(--app-border)',
          }}>
            <button
              onClick={() => onDelete(trip.id)}
              className="btn-app-ghost btn-danger"
              style={{ fontSize: '0.75rem' }}
            >
              <Trash2 size={12} /> Delete trip
            </button>
            {trip.total !== undefined && (
              <div style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}>
                Total: <strong style={{ color: 'var(--charcoal)' }}>${trip.total.toFixed(2)}</strong>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ShoppingTripsPage() {
  const [trips, setTrips] = useState<ShoppingTrip[]>(INITIAL_TRIPS)
  const [showForm, setShowForm] = useState(false)

  // New trip form state
  const [newStore, setNewStore] = useState('Coles')
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10))
  const [newTotal, setNewTotal] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [newItems, setNewItems] = useState<TripItem[]>([
    { id: uid(), name: '', qty: '', category: 'Produce' }
  ])

  // Summary stats
  const totalSpend = trips.reduce((sum, t) => sum + (t.total ?? 0), 0)
  const avgSpend = trips.length > 0 ? totalSpend / trips.length : 0
  const totalItems = trips.reduce((sum, t) => sum + t.items.length, 0)

  function deleteTrip(id: string) {
    setTrips(prev => prev.filter(t => t.id !== id))
  }

  function addItemRow() {
    setNewItems(prev => [...prev, { id: uid(), name: '', qty: '', category: 'Produce' }])
  }

  function updateItem(id: string, field: keyof TripItem, value: string) {
    setNewItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  function removeItemRow(id: string) {
    if (newItems.length <= 1) return
    setNewItems(prev => prev.filter(i => i.id !== id))
  }

  function saveTrip(e: React.FormEvent) {
    e.preventDefault()
    const trip: ShoppingTrip = {
      id: uid(),
      date: newDate,
      store: newStore,
      total: newTotal ? parseFloat(newTotal) : undefined,
      notes: newNotes.trim() || undefined,
      items: newItems.filter(i => i.name.trim()),
    }
    setTrips(prev => [trip, ...prev].sort((a, b) => b.date.localeCompare(a.date)))
    // Reset form
    setShowForm(false)
    setNewStore('Coles')
    setNewDate(new Date().toISOString().slice(0, 10))
    setNewTotal('')
    setNewNotes('')
    setNewItems([{ id: uid(), name: '', qty: '', category: 'Produce' }])
  }

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="page-header-bar">
        <div>
          <div className="page-eyebrow">History</div>
          <h1 className="page-title">🧾 Shopping <em>Trips</em></h1>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="btn-app-primary"
          style={{ fontSize: '0.875rem' }}
        >
          <Plus size={15} /> Log trip
        </button>
      </div>

      {/* ── Summary cards ──────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        marginBottom: '1.5rem',
      }}>
        {[
          { icon: <ShoppingBag size={16} />, label: 'Total trips',  value: trips.length.toString(),         color: 'var(--brand)' },
          { icon: <DollarSign size={16} />,  label: 'Total spend',  value: `$${totalSpend.toFixed(2)}`,     color: 'var(--protein-color)' },
          { icon: <DollarSign size={16} />,  label: 'Avg per trip', value: `$${avgSpend.toFixed(2)}`,       color: 'var(--fat-color)' },
        ].map(card => (
          <div key={card.label} className="app-card" style={{ padding: '0.875rem 1rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              color: card.color, marginBottom: '0.25rem',
            }}>
              {card.icon}
              <span style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: '0.65rem',
                fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                {card.label}
              </span>
            </div>
            <div style={{
              fontFamily: 'DM Sans, monospace', fontWeight: 800,
              fontSize: '1.25rem', color: 'var(--charcoal)',
            }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Log trip form ───────────────────────────────────────────────── */}
      {showForm && (
        <div className="app-card" style={{ marginBottom: '1.5rem' }}>
          <div className="app-card-header">
            <span className="app-card-title">Log a trip</span>
          </div>
          <div className="app-card-body">
            <form onSubmit={saveTrip}>
              {/* Store, date, total */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="app-label">Store</label>
                  <select className="app-input" value={newStore} onChange={e => setNewStore(e.target.value)}>
                    {STORES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="app-label">Date</label>
                  <input type="date" className="app-input" value={newDate} onChange={e => setNewDate(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="app-label">Total ($)</label>
                  <input
                    type="number" step="0.01" min="0" className="app-input"
                    value={newTotal} onChange={e => setNewTotal(e.target.value)}
                    placeholder="e.g. 87.40"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="app-label">Notes (optional)</label>
                <input
                  className="app-input" value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="e.g. Weekly keto shop"
                />
              </div>

              {/* Items */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}>
                  <label className="app-label" style={{ marginBottom: 0 }}>Items bought</label>
                  <button
                    type="button" onClick={addItemRow}
                    className="btn-app-ghost" style={{ fontSize: '0.75rem' }}
                  >
                    <Plus size={12} /> Add row
                  </button>
                </div>

                <div style={{
                  border: '1.5px solid var(--app-border)', borderRadius: 10, overflow: 'hidden',
                }}>
                  {/* Column headers */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 80px 100px 32px',
                    gap: '0.5rem', padding: '0.375rem 0.625rem',
                    background: 'var(--app-bg)',
                    borderBottom: '1px solid var(--app-border)',
                  }}>
                    {['Item name', 'Qty', 'Category', ''].map(h => (
                      <span key={h} style={{
                        fontFamily: 'DM Sans, sans-serif', fontSize: '0.65rem',
                        fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                      }}>{h}</span>
                    ))}
                  </div>

                  {newItems.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'grid', gridTemplateColumns: '1fr 80px 100px 32px',
                        gap: '0.5rem', padding: '0.375rem 0.625rem',
                        borderBottom: idx < newItems.length - 1 ? '1px solid var(--app-border)' : 'none',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
                        alignItems: 'center',
                      }}
                    >
                      <input
                        className="app-input" style={{ padding: '0.375rem 0.5rem', fontSize: '0.85rem' }}
                        value={item.name}
                        onChange={e => updateItem(item.id, 'name', e.target.value)}
                        placeholder="e.g. Chicken thighs"
                      />
                      <input
                        className="app-input" style={{ padding: '0.375rem 0.5rem', fontSize: '0.85rem' }}
                        value={item.qty}
                        onChange={e => updateItem(item.id, 'qty', e.target.value)}
                        placeholder="500g"
                      />
                      <select
                        className="app-input" style={{ padding: '0.375rem 0.5rem', fontSize: '0.82rem' }}
                        value={item.category}
                        onChange={e => updateItem(item.id, 'category', e.target.value)}
                      >
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeItemRow(item.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--text-subtle)', padding: 4,
                          opacity: newItems.length === 1 ? 0.3 : 0.6,
                        }}
                        disabled={newItems.length === 1}
                        aria-label="Remove row"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn-app-secondary" style={{ fontSize: '0.875rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-app-primary" style={{ fontSize: '0.875rem' }}>
                  <ShoppingBag size={14} /> Save trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────────────────────── */}
      {trips.length === 0 && (
        <div className="app-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <ShoppingBag size={40} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem' }} />
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            No trips logged yet. Tap "Log trip" after your next Coles run.
          </p>
        </div>
      )}

      {/* ── Trip cards ──────────────────────────────────────────────────── */}
      {trips.map(trip => (
        <TripCard key={trip.id} trip={trip} onDelete={deleteTrip} />
      ))}

      <div style={{ height: '2rem' }} />

      <style>{`
        @media (max-width: 640px) {
          .page-header-bar { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          /* collapse summary cards to 1 column */
          .trips-summary { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
