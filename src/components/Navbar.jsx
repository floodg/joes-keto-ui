import { useState, useEffect } from 'react'
import { Menu, X, Flame } from 'lucide-react'

const links = ['Recipes', 'Meal Plans', 'Macros', 'About', 'Blog']

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center group-hover:bg-brand-700 transition-colors">
            <Flame size={16} className="text-white" />
          </span>
          <span className="font-display font-bold text-xl text-charcoal">
            Joe's <span className="text-brand-600">Keto</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="text-sm font-medium text-charcoal/70 hover:text-brand-600 transition-colors"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors">
            Sign in
          </a>
          <a href="#" className="btn-primary text-sm py-2">
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-brand-50 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-cream/98 backdrop-blur-sm border-t border-brand-100 px-6 py-4 animate-fade-in">
          <ul className="space-y-3 mb-4">
            {links.map(link => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase().replace(' ', '-')}`}
                  className="block py-1 font-medium text-charcoal/70 hover:text-brand-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
          <a href="#" className="btn-primary w-full justify-center text-sm">
            Get Started
          </a>
        </div>
      )}
    </header>
  )
}
