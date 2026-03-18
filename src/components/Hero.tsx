import { ArrowRight, ChevronDown } from 'lucide-react'

const stats = [
  { value: '200+', label: 'Keto Recipes' },
  { value: '< 20g', label: 'Carbs / day' },
  { value: '50k+', label: 'Community members' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-cream to-cream pointer-events-none" />

      {/* Decorative circle */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] rounded-full bg-brand-100/40 blur-3xl -translate-x-1/4 pointer-events-none" />
      <div className="absolute -left-20 bottom-1/4 w-[300px] h-[300px] rounded-full bg-brand-200/20 blur-2xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left column */}
        <div>
          <p className="section-label mb-4 animate-fade-up">Real food. Real results.</p>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] text-charcoal mb-6 animate-fade-up delay-100 text-balance">
            Keto living,{' '}
            <span className="text-brand-600 italic">simplified</span>{' '}
            for you.
          </h1>

          <p className="text-lg text-charcoal/60 leading-relaxed mb-8 max-w-lg animate-fade-up delay-200">
            Delicious low-carb recipes, easy meal plans, and macro tracking — everything you need to thrive on keto without the guesswork.
          </p>

          <div className="flex flex-wrap gap-3 animate-fade-up delay-300">
            <a href="#recipes" className="btn-primary">
              Browse Recipes <ArrowRight size={16} />
            </a>
            <a href="#meal-plans" className="btn-outline">
              7-Day Meal Plan
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-12 flex flex-wrap gap-8 animate-fade-up delay-400">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="font-display text-3xl font-black text-brand-600">{value}</p>
                <p className="text-sm text-charcoal/50 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — food cards mosaic */}
        <div className="relative hidden lg:block animate-fade-in delay-300">
          <div className="grid grid-cols-2 gap-4">
            <FoodCard
              emoji="🥑"
              name="Avocado Egg Bowl"
              macros={{ fat: 32, protein: 18, carbs: 4 }}
              className="mt-8"
            />
            <FoodCard
              emoji="🥩"
              name="Ribeye & Butter"
              macros={{ fat: 48, protein: 42, carbs: 0 }}
            />
            <FoodCard
              emoji="🥗"
              name="Bacon Caesar"
              macros={{ fat: 22, protein: 15, carbs: 3 }}
            />
            <FoodCard
              emoji="🍳"
              name="Keto Pancakes"
              macros={{ fat: 18, protein: 12, carbs: 5 }}
              className="mt-8"
            />
          </div>

          {/* Floating macro pill */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg px-5 py-3 flex items-center gap-4 border border-brand-50">
            <span className="text-xs font-mono text-charcoal/40 uppercase tracking-wider">Daily macros</span>
            <MacroPill label="Fat" value="75%" color="bg-brand-400" />
            <MacroPill label="Protein" value="20%" color="bg-charcoal" />
            <MacroPill label="Carbs" value="5%" color="bg-brand-200" />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-charcoal/30 animate-bounce">
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} />
      </div>
    </section>
  )
}

interface FoodCardProps {
  emoji: string
  name: string
  macros: { fat: number; protein: number; carbs: number }
  className?: string
}

function FoodCard({ emoji, name, macros, className = '' }: FoodCardProps) {
  return (
    <div className={`card p-4 ${className}`}>
      <div className="text-4xl mb-3">{emoji}</div>
      <p className="font-display font-bold text-charcoal text-sm mb-2">{name}</p>
      <div className="flex gap-2 flex-wrap">
        <span className="macro-badge bg-brand-50 text-brand-700">{macros.fat}g fat</span>
        <span className="macro-badge bg-charcoal/5 text-charcoal/70">{macros.protein}g prot</span>
        <span className="macro-badge bg-brand-100 text-brand-800">{macros.carbs}g carbs</span>
      </div>
    </div>
  )
}

interface MacroPillProps {
  label: string
  value: string
  color: string
}

function MacroPill({ label, value, color }: MacroPillProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs font-sans text-charcoal/60">{label}</span>
      <span className="text-xs font-mono font-medium text-charcoal">{value}</span>
    </div>
  )
}
