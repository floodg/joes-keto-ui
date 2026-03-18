import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

// Public site components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Recipes from './components/Recipes'
import MacroCalculator from './components/MacroCalculator'
import MealPlan from './components/MealPlan'
import About from './components/About'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'

// App shell + pages
import AppShell from './app/AppShell'
import Dashboard from './app/Dashboard'
import WeeklyPlan from './app/WeeklyPlan'
import MealsPage from './app/MealsPage'
import { ShoppingPage, WorkoutsPage, MacrosPage } from './app/StubPages'

function PublicSite() {
  return (
    <div className="noise-overlay">
      <Navbar />
      <main>
        <Hero />
        <Recipes />
        <MacroCalculator />
        <MealPlan />
        <About />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <PublicSite /> },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'plan',      element: <WeeklyPlan /> },
      { path: 'meals',     element: <MealsPage /> },
      { path: 'shopping',  element: <ShoppingPage /> },
      { path: 'workouts',  element: <WorkoutsPage /> },
      { path: 'macros',    element: <MacrosPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
