# 🔥 Joe's Keto — React + Vite + Tailwind CSS

A full site upgrade from vanilla CSS to a modern React stack.

## Tech Stack

- **React 18** — component-based UI
- **Vite 5** — lightning-fast dev server & bundler
- **Tailwind CSS 3** — utility-first styling
- **Lucide React** — icon library
- **Playfair Display** + **DM Sans** — custom Google Fonts

## Project Structure

```
joes-keto/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── components/
        ├── Navbar.jsx          # Sticky nav with mobile hamburger
        ├── Hero.jsx            # Hero with food cards & stats
        ├── Recipes.jsx         # Recipe grid with macro bars
        ├── MacroCalculator.jsx # Interactive keto macro calculator
        ├── MealPlan.jsx        # 7-day meal plan calendar
        ├── About.jsx           # Joe's story section
        ├── Newsletter.jsx      # Email signup
        └── Footer.jsx          # Footer with links
```

## App Routes

The site has two areas:

| Route | Description |
|---|---|
| `/` | Public marketing site |
| `/app/dashboard` | Today's meals + macro summary |
| `/app/plan` | 7-day meal planning calendar |
| `/app/meals` | Meal library — add, edit, view |
| `/app/shopping` | Shopping list (stub) |
| `/app/workouts` | Workout tracker (stub) |
| `/app/macros` | Macro goals (stub) |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

## Build for Production

```bash
npm run build
npm run preview
```

## Customising

### Colors
Edit `tailwind.config.js` → `theme.extend.colors` to change the brand palette.

### Fonts
Edit `index.html` (Google Fonts link) and `tailwind.config.js` → `theme.extend.fontFamily`.

### Recipes
Edit the `recipes` array in `src/components/Recipes.jsx`.

### Meal Plan
Edit the `days` array in `src/components/MealPlan.jsx`.

### Macro Calculator
The calculator uses the **Mifflin–St Jeor** equation with standard keto splits (70% fat / 25% protein / 5% carbs). Adjust ratios in `MacroCalculator.jsx`.
