import { useState } from 'react'
import { Send, Sparkles } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Sparkles size={14} />
          Free weekly recipes
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-black text-charcoal mb-4">
          Never run out of <em className="text-brand-600">keto ideas</em>
        </h2>
        <p className="text-charcoal/50 mb-8 max-w-md mx-auto">
          Get 3 new recipes, a shopping tip, and a keto fact every Sunday morning. No spam, ever.
        </p>

        {submitted ? (
          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 animate-fade-up">
            <p className="font-display text-xl font-bold text-brand-700">🎉 You're in!</p>
            <p className="text-brand-600/70 text-sm mt-1">Check your inbox for a welcome email.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-white border border-brand-100 rounded-full px-5 py-3 text-sm text-charcoal placeholder:text-charcoal/30 outline-none focus:border-brand-400 transition-colors shadow-sm"
            />
            <button type="submit" className="btn-primary shrink-0">
              Subscribe <Send size={14} />
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
