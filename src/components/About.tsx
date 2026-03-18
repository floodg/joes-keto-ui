export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Avatar card */}
        <div className="relative">
          <div className="aspect-square max-w-sm mx-auto rounded-3xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-end justify-center overflow-hidden">
            <div className="text-[140px] leading-none select-none pb-4">👨‍🍳</div>
          </div>
          {/* Floating quote card */}
          <div className="absolute -bottom-6 -right-0 lg:-right-8 bg-white rounded-2xl shadow-xl p-5 max-w-[220px] border border-brand-50">
            <p className="font-display italic text-charcoal text-sm leading-relaxed">
              "I lost 28kg in 8 months. Keto changed everything."
            </p>
            <p className="text-xs text-charcoal/40 font-mono mt-2">— Joe, founder</p>
          </div>
        </div>

        {/* Story */}
        <div>
          <p className="section-label mb-4">The story</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-charcoal mb-6">
            Hi, I'm Joe. <br />
            <em className="text-brand-600">Keto saved my life.</em>
          </h2>
          <div className="space-y-4 text-charcoal/60 leading-relaxed">
            <p>
              In 2020 I was overweight, fatigued, and pre-diabetic. My doctor told me to change my diet — so I did. I threw myself into the ketogenic lifestyle and never looked back.
            </p>
            <p>
              What started as a personal experiment turned into a passion for real, whole food. I built this site to share every recipe, tip, and trick that's helped me and thousands of others transform their health.
            </p>
            <p>
              No fads. No supplements to sell you. Just honest, delicious keto food.
            </p>
          </div>
          <a href="#" className="btn-primary mt-8 inline-flex">Read my full story</a>
        </div>
      </div>
    </section>
  )
}
