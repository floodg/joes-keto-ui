import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Flame, Menu, X, LogOut } from 'lucide-react'
import './app.css'

const NAV = [
  {
    section: 'Today',
    links: [
      { to: '/app/dashboard', icon: '🏠', label: 'Dashboard' },
      { to: '/app/plan',      icon: '📅', label: 'Weekly Plan' },
    ],
  },
  {
    section: 'Food',
    links: [
      { to: '/app/meals',    icon: '🍽️', label: 'Meals' },
      { to: '/app/shopping', icon: '🛒', label: 'Shopping' },
    ],
  },
  {
    section: 'Health',
    links: [
      { to: '/app/workouts', icon: '💪', label: 'Workouts' },
      { to: '/app/macros',   icon: '📊', label: 'My Macros' },
    ],
  },
]

const PAGE_TITLES = {
  '/app/dashboard': 'Dashboard',
  '/app/plan': 'Weekly Plan',
  '/app/meals': 'My Meals',
  '/app/shopping': 'Shopping List',
  '/app/workouts': 'Workouts',
  '/app/macros': 'My Macros',
}

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Joe's Keto"

  const handleSignOut = () => {
    // In real app: call supabase.auth.signOut()
    navigate('/')
  }

  const today = new Date().toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 99, display: 'none',
          }}
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`app-sidebar${sidebarOpen ? ' open' : ''}`}>
        {/* Brand */}
        <Link to="/app/dashboard" className="sidebar-brand" onClick={() => setSidebarOpen(false)}>
          <span className="sidebar-brand-icon">
            <Flame size={16} color="white" />
          </span>
          <div>
            <div className="sidebar-brand-text">Joe's Keto</div>
            <div className="sidebar-brand-sub">App</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV.map(section => (
            <div key={section.section}>
              <div className="sidebar-section-label">{section.section}</div>
              {section.links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`sidebar-link${location.pathname === link.to ? ' active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sidebar-link-icon">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link" style={{ marginBottom: '0.25rem' }}>
            <span className="sidebar-link-icon">🌐</span>
            Public Site
          </Link>
          <button
            onClick={handleSignOut}
            className="sidebar-link"
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <span className="sidebar-link-icon"><LogOut size={15} /></span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="app-main">
        {/* Topbar */}
        <header className="app-topbar">
          <button
            className="btn-app-ghost"
            style={{ display: 'none', padding: '0.375rem' }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="topbar-title">{pageTitle}</h1>
          <span className="topbar-date">{today}</span>
        </header>

        {/* Page content */}
        <div className="app-content">
          <Outlet />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .app-sidebar { transform: translateX(-100%); }
          .app-sidebar.open { transform: translateX(0); }
          .mobile-overlay { display: block !important; }
          .app-topbar button { display: inline-flex !important; }
        }
      `}</style>
    </div>
  )
}
