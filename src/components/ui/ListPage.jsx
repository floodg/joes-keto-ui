import { useState } from 'react'
import { Search, Plus, X } from 'lucide-react'

/**
 * Reusable ListPage component.
 * 
 * Props:
 *  - eyebrow: string
 *  - title: string (supports <em> via renderTitle)
 *  - items: array of { id, ...data }
 *  - renderListItem: (item, isSelected, onSelect) => JSX
 *  - renderDetail: (item | null, onClose) => JSX — null means "new item" form
 *  - searchPlaceholder: string
 *  - searchFilter: (item, query) => boolean
 *  - addLabel: string
 *  - emptyIcon: string
 *  - emptyText: string
 */
export default function ListPage({
  eyebrow,
  title,
  items = [],
  renderListItem,
  renderDetail,
  searchPlaceholder = 'Search…',
  searchFilter,
  addLabel = 'Add New',
  emptyIcon = '📋',
  emptyText = 'No items yet',
}) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)   // null = closed, 'new' = new form, or item
  const [panelMode, setPanelMode] = useState(null)  // null | 'view' | 'edit' | 'new'

  const filtered = searchFilter && query.trim()
    ? items.filter(item => searchFilter(item, query.trim()))
    : items

  const handleSelect = (item) => {
    setSelected(item)
    setPanelMode('view')
  }

  const handleAddNew = () => {
    setSelected(null)
    setPanelMode('new')
  }

  const handleClose = () => {
    setSelected(null)
    setPanelMode(null)
  }

  const panelOpen = panelMode !== null

  return (
    <div>
      {/* Header */}
      <div className="page-header-bar">
        <div>
          {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
          <h1 className="page-title"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
        <button className="btn-app-primary" onClick={handleAddNew}>
          <Plus size={16} />
          {addLabel}
        </button>
      </div>

      {/* Two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: panelOpen ? '320px 1fr' : '1fr',
        gap: '1.25rem',
        alignItems: 'start',
        transition: 'grid-template-columns 0.3s ease',
      }}>
        {/* List column */}
        <div>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '0.875rem' }}>
            <Search
              size={15}
              style={{
                position: 'absolute', left: '0.75rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-subtle)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="app-input"
              style={{ paddingLeft: '2.25rem', paddingRight: '0.875rem' }}
            />
          </div>

          {/* Count */}
          <div style={{
            fontSize: '0.7rem', color: 'var(--text-subtle)', fontFamily: 'DM Sans, sans-serif',
            marginBottom: '0.625rem', letterSpacing: '0.05em',
          }}>
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            {query && ` matching "${query}"`}
          </div>

          {/* Items */}
          {filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '3rem 1rem',
              color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.5 }}>{emptyIcon}</div>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                {query ? `No results for "${query}"` : emptyText}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filtered.map(item => renderListItem(
                item,
                selected?.id === item.id && panelMode !== 'new',
                handleSelect,
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {panelOpen && (
          <div className="app-card" style={{ position: 'sticky', top: '72px' }}>
            <div style={{
              padding: '1rem 1.25rem 0.75rem',
              borderBottom: '1px solid var(--app-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--text-subtle)',
                fontFamily: 'DM Sans, sans-serif',
              }}>
                {panelMode === 'new' ? 'New Item' : selected?.name || 'Details'}
              </span>
              <button className="btn-app-ghost" onClick={handleClose} style={{ padding: '0.25rem' }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: '1.25rem' }}>
              {renderDetail(panelMode === 'new' ? null : selected, handleClose, panelMode, setPanelMode)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
