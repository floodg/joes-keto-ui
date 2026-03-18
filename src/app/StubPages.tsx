import { Link } from 'react-router-dom'

interface ComingSoonProps {
  emoji: string
  title: string
  description: string
  links?: Array<{ to: string; label: string }>
}

function ComingSoon({ emoji, title, description, links = [] }: ComingSoonProps) {
  return (
    <div>
      <div className="page-header-bar">
        <div>
          <h1 className="page-title" dangerouslySetInnerHTML={{ __html: `${emoji} <em>${title}</em>` }} />
        </div>
      </div>
      <div className="app-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{emoji}</div>
        <h2 style={{
          fontFamily: 'Playfair Display, serif', fontSize: '1.5rem',
          color: 'var(--charcoal)', margin: '0 0 0.75rem',
        }}>
          {title}
        </h2>
        <p style={{
          fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)',
          fontSize: '0.95rem', maxWidth: 400, margin: '0 auto 1.5rem',
        }}>
          {description}
        </p>
        {links.length > 0 && (
          <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {links.map(link => (
              <Link key={link.to} to={link.to} className="btn-app-primary">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function ShoppingPage() {
  return (
    <ComingSoon
      emoji="🛒"
      title="Shopping List"
      description="Your shopping list is auto-generated from your weekly meal plan. Add a shopping trip to track what you've bought and keep your pantry up to date."
      links={[{ to: '/app/plan', label: 'View Meal Plan' }]}
    />
  )
}

export function WorkoutsPage() {
  return (
    <ComingSoon
      emoji="💪"
      title="Workouts"
      description="Track your strength training sessions, schedule workouts for the week, and log your progress. Your workout library lives here."
      links={[{ to: '/app/dashboard', label: 'Back to Dashboard' }]}
    />
  )
}

export function MacrosPage() {
  return (
    <ComingSoon
      emoji="📊"
      title="My Macros"
      description="Track your daily macros, set custom targets, and see how your food choices stack up against your keto goals."
      links={[{ to: '/app/meals', label: 'Browse Meals' }]}
    />
  )
}
