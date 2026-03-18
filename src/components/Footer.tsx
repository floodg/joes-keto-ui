import { Flame } from 'lucide-react'

const links: Record<string, string[]> = {
  Recipes: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts'],
  Tools: ['Macro Calculator', '7-Day Plan', 'Shopping List', 'Keto Guide'],
  About: ["Joe's Story", 'Blog', 'Contact', 'Press'],
}

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center">
                <Flame size={16} className="text-white" />
              </span>
              <span className="font-display font-bold text-xl">
                Joe's <span className="text-brand-400">Keto</span>
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              Real food. Real results. No gimmicks.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="font-mono text-xs uppercase tracking-widest text-white/30 mb-4">{heading}</h4>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/60 hover:text-brand-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30 font-mono">
          <p>© {new Date().getFullYear()} Joe's Keto. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
