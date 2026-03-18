// ── Meal types ────────────────────────────────────────────────────────────────

export interface Macros {
  calories: number
  fat: number
  protein: number
  carbs: number
}

export interface Ingredient {
  name: string
  quantity: string
}

export interface Meal {
  id: string
  name: string
  emoji: string
  tags: string[]
  prepTimeMins: number
  cookTimeMins: number
  macros: Macros
  ingredients: Ingredient[]
  instructions: string[]
}

// ── Plan types ────────────────────────────────────────────────────────────────

export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type MealStatus = 'planned' | 'completed' | 'skipped'

export interface PlannedMealSlot {
  id: string
  mealId: string
  status: MealStatus
}

export type DayPlan = Partial<Record<MealTime, PlannedMealSlot>>
export type WeekPlan = Record<number, DayPlan>  // 0=Mon … 6=Sun

// ── Catalog entry (lightweight, for picker) ───────────────────────────────────

export interface MealCatalogEntry {
  id: string
  name: string
  emoji: string
  macros: Pick<Macros, 'fat' | 'protein' | 'carbs'>
}
