import { useState } from 'react'
import { Calculator } from 'lucide-react'

const ACTIVITY = [
  { label: 'Sedentary', factor: 1.2 },
  { label: 'Lightly active', factor: 1.375 },
  { label: 'Moderately active', factor: 1.55 },
  { label: 'Very active', factor: 1.725 },
]

const GOALS = [
  { label: 'Lose weight', modifier: -500 },
  { label: 'Maintain', modifier: 0 },
  { label: 'Gain muscle', modifier: 250 },
]

export default function MacroCalculator() {
  const [form, setForm] = useState({
    age: 30,
    weight: 80,
    height: 175,
    sex: 'male',
    activity: 1,
    goal: 0,
  })
  const [results, setResults] = useState(null)

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const calculate = () => {
    const { age, weight, height, sex, activity, goal } = form
    // Mifflin–St Jeor BMR
    const bmr =
      sex === 'male'
        ? 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) + 5
        : 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) - 161

    const tdee = bmr * ACTIVITY[activity].factor + GOALS[goal].modifier
    const calories = Math.round(tdee)

    // Standard keto macros: 70% fat, 25% protein, 5% carbs
    const fat = Math.round((calories * 0.70) / 9)
    const protein = Math.round((calories * 0.25) / 4)
    const carbs = Math.round((calories * 0.05) / 4)

    setResults({ calories, fat, protein, carbs })
  }

  return (
    <section id="macros" className="py-24 px-6 bg-charcoal">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label text-brand-400 mb-3">Know your numbers</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white">
            Keto Macro <em className="text-brand-400">Calculator</em>
          </h2>
          <p className="mt-4 text-white/50 max-w-md mx-auto">
            Get your personalised daily targets in seconds.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <Field label="Age" unit="years">
              <input
                type="number"
                value={form.age}
                onChange={e => set('age', e.target.value)}
                className="input-dark"
                min={15} max={100}
              />
            </Field>
            <Field label="Weight" unit="kg">
              <input
                type="number"
                value={form.weight}
                onChange={e => set('weight', e.target.value)}
                className="input-dark"
                min={30} max={300}
              />
            </Field>
            <Field label="Height" unit="cm">
              <input
                type="number"
                value={form.height}
                onChange={e => set('height', e.target.value)}
                className="input-dark"
                min={100} max={250}
              />
            </Field>
            <Field label="Sex">
              <div className="flex gap-2">
                {['male', 'female'].map(s => (
                  <button
                    key={s}
                    onClick={() => set('sex', s)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                      form.sex === s
                        ? 'bg-brand-600 text-white'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field label="Activity level" className="mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ACTIVITY.map((a, i) => (
                <button
                  key={a.label}
                  onClick={() => set('activity', i)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium text-center transition-all ${
                    form.activity === i
                      ? 'bg-brand-600 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Goal" className="mb-8">
            <div className="grid grid-cols-3 gap-2">
              {GOALS.map((g, i) => (
                <button
                  key={g.label}
                  onClick={() => set('goal', i)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium text-center transition-all ${
                    form.goal === i
                      ? 'bg-brand-600 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </Field>

          <button onClick={calculate} className="btn-primary w-full justify-center text-base py-3.5">
            <Calculator size={18} />
            Calculate My Macros
          </button>

          {results && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up">
              <ResultCard label="Calories" value={results.calories} unit="kcal" accent />
              <ResultCard label="Fat" value={results.fat} unit="g" />
              <ResultCard label="Protein" value={results.protein} unit="g" />
              <ResultCard label="Carbs" value={results.carbs} unit="g" />
            </div>
          )}
        </div>
      </div>

      <style>{`
        .input-dark {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 10px 14px;
          color: white;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-dark:focus {
          border-color: #b85a10;
        }
      `}</style>
    </section>
  )
}

function Field({ label, unit, className = '', children }) {
  return (
    <div className={className}>
      <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">
        {label}{unit && <span className="ml-1 normal-case">({unit})</span>}
      </label>
      {children}
    </div>
  )
}

function ResultCard({ label, value, unit, accent }) {
  return (
    <div className={`rounded-2xl p-4 text-center ${accent ? 'bg-brand-600' : 'bg-white/5 border border-white/10'}`}>
      <p className={`font-display text-2xl font-black ${accent ? 'text-white' : 'text-brand-400'}`}>
        {value}
      </p>
      <p className={`text-xs font-mono mt-1 ${accent ? 'text-white/70' : 'text-white/40'}`}>
        {unit} / day
      </p>
      <p className={`text-xs mt-0.5 font-medium ${accent ? 'text-white/90' : 'text-white/60'}`}>
        {label}
      </p>
    </div>
  )
}
