import { CheckCircle2 } from 'lucide-react'

const days = [
  {
    day: 'Mon',
    meals: [
      { label: 'Breakfast', name: 'Bacon & Eggs', carbs: 1 },
      { label: 'Lunch', name: 'Tuna Lettuce Wraps', carbs: 3 },
      { label: 'Dinner', name: 'Ribeye + Broccoli', carbs: 5 },
    ],
  },
  {
    day: 'Tue',
    meals: [
      { label: 'Breakfast', name: 'Keto Pancakes', carbs: 6 },
      { label: 'Lunch', name: 'Caesar Salad', carbs: 3 },
      { label: 'Dinner', name: 'Chicken Thighs', carbs: 2 },
    ],
  },
  {
    day: 'Wed',
    meals: [
      { label: 'Breakfast', name: 'Avocado Egg Bowl', carbs: 4 },
      { label: 'Lunch', name: 'BLT Lettuce Wrap', carbs: 4 },
      { label: 'Dinner', name: 'Salmon & Asparagus', carbs: 3 },
    ],
  },
  {
    day: 'Thu',
    meals: [
      { label: 'Breakfast', name: 'Cheese Omelette', carbs: 2 },
      { label: 'Lunch', name: 'Cobb Salad', carbs: 5 },
      { label: 'Dinner', name: 'Pork Belly Bowl', carbs: 4 },
    ],
  },
  {
    day: 'Fri',
    meals: [
      { label: 'Breakfast', name: 'Smoked Salmon Toast', carbs: 3 },
      { label: 'Lunch', name: 'Chicken Soup', carbs: 4 },
      { label: 'Dinner', name: 'Lamb Chops', carbs: 2 },
    ],
  },
  {
    day: 'Sat',
    meals: [
      { label: 'Breakfast', name: 'Frittata Slice', carbs: 3 },
      { label: 'Lunch', name: 'Beef Stuffed Peppers', carbs: 6 },
      { label: 'Dinner', name: 'Grilled Prawns', carbs: 2 },
    ],
  },
  {
    day: 'Sun',
    meals: [
      { label: 'Breakfast', name: 'Full Keto Fry-Up', carbs: 2 },
      { label: 'Lunch', name: 'Zucchini Fritters', carbs: 5 },
      { label: 'Dinner', name: 'Roast Chicken', carbs: 3 },
    ],
  },
]

const features = [
  'Under 20g net carbs daily',
  'Shopping list included',
  'Prep-ahead tips',
  'Nutritionist reviewed',
]

export default function MealPlan() {
  return (
    <section id="meal-plans" className="py-24 px-6 bg-brand-950 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-start">
          {/* Left */}
          <div>
            <p className="section-label text-brand-400 mb-3">Planned & prepped</p>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-4">
              Your 7-Day <em className="text-brand-400">Meal Plan</em>
            </h2>
            <p className="text-white/50 mb-6 max-w-md">
              A full week of satisfying keto meals, planned so you never have to think about it.
            </p>
            <ul className="space-y-2 mb-8">
              {features.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                  <CheckCircle2 size={16} className="text-brand-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <a href="#" className="btn-primary">Download PDF Plan</a>
          </div>

          {/* Calendar grid */}
          <div className="w-full lg:w-auto overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[560px]">
              {days.map(({ day, meals }) => (
                <div key={day} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                  <div className="bg-brand-600 text-center py-1.5">
                    <p className="text-xs font-mono font-bold text-white tracking-wider uppercase">{day}</p>
                  </div>
                  <div className="p-2 space-y-1.5">
                    {meals.map(({ label, name, carbs }) => (
                      <div key={label} className="bg-white/5 rounded-lg p-1.5">
                        <p className="text-[9px] font-mono text-white/30 uppercase tracking-wider">{label}</p>
                        <p className="text-[11px] font-medium text-white/80 leading-tight mt-0.5">{name}</p>
                        <p className="text-[9px] font-mono text-brand-400 mt-0.5">{carbs}g carbs</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
