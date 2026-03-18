import { Clock, Flame, ChevronRight } from 'lucide-react'

const recipes = [
  {
    emoji: '🥑',
    title: 'Smashed Avocado Egg Bowl',
    time: '10 min',
    calories: 420,
    macros: { fat: 34, protein: 22, carbs: 4 },
    tag: 'Breakfast',
    tagColor: 'bg-brand-100 text-brand-800',
  },
  {
    emoji: '🥩',
    title: 'Garlic Butter Ribeye Steak',
    time: '20 min',
    calories: 680,
    macros: { fat: 52, protein: 48, carbs: 0 },
    tag: 'Dinner',
    tagColor: 'bg-charcoal/10 text-charcoal',
  },
  {
    emoji: '🍗',
    title: 'Crispy Parmesan Chicken Thighs',
    time: '35 min',
    calories: 510,
    macros: { fat: 38, protein: 44, carbs: 2 },
    tag: 'Dinner',
    tagColor: 'bg-charcoal/10 text-charcoal',
  },
  {
    emoji: '🥗',
    title: 'Bacon & Blue Cheese Caesar',
    time: '15 min',
    calories: 380,
    macros: { fat: 30, protein: 18, carbs: 3 },
    tag: 'Lunch',
    tagColor: 'bg-brand-200 text-brand-900',
  },
  {
    emoji: '🍳',
    title: 'Almond Flour Keto Pancakes',
    time: '15 min',
    calories: 310,
    macros: { fat: 22, protein: 14, carbs: 6 },
    tag: 'Breakfast',
    tagColor: 'bg-brand-100 text-brand-800',
  },
  {
    emoji: '🧀',
    title: 'Zucchini & Chorizo Frittata',
    time: '25 min',
    calories: 440,
    macros: { fat: 36, protein: 26, carbs: 3 },
    tag: 'Lunch',
    tagColor: 'bg-brand-200 text-brand-900',
  },
]

export default function Recipes() {
  return (
    <section id="recipes" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="section-label mb-3">Popular picks</p>
            <h2 className="font-display text-4xl md:text-5xl font-black text-charcoal">
              Featured <em>Recipes</em>
            </h2>
          </div>
          <a href="#" className="btn-outline self-start sm:self-auto">
            View all recipes <ChevronRight size={16} />
          </a>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.title} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RecipeCard({ recipe }) {
  const { emoji, title, time, calories, macros, tag, tagColor } = recipe

  return (
    <article className="card group cursor-pointer">
      {/* Emoji hero area */}
      <div className="h-44 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
        {emoji}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`macro-badge py-1 px-2.5 ${tagColor}`}>{tag}</span>
          <span className="flex items-center gap-1 text-xs text-charcoal/40 font-mono ml-auto">
            <Clock size={12} />
            {time}
          </span>
          <span className="flex items-center gap-1 text-xs text-charcoal/40 font-mono">
            <Flame size={12} />
            {calories}
          </span>
        </div>

        <h3 className="font-display font-bold text-lg text-charcoal mb-4 leading-snug">
          {title}
        </h3>

        {/* Macro bar */}
        <div className="space-y-1.5">
          <MacroBar label="Fat" value={macros.fat} max={60} color="bg-brand-500" unit="g" />
          <MacroBar label="Protein" value={macros.protein} max={60} color="bg-charcoal" unit="g" />
          <MacroBar label="Carbs" value={macros.carbs} max={60} color="bg-brand-300" unit="g" />
        </div>
      </div>
    </article>
  )
}

function MacroBar({ label, value, max, color, unit }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-charcoal/40 w-12 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-brand-50 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-mono font-medium text-charcoal/70 w-8 text-right">
        {value}{unit}
      </span>
    </div>
  )
}
