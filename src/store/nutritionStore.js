import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Preset plans per eater category ────────────────────────────────────────
export const PRESET_PLANS = {
  balanced: {
    label: 'Balanced',
    emoji: '⚖️',
    description: 'Equal macros, varied meals for general health',
    meals: {
      'Mon-Breakfast': 'Oatmeal with banana & honey',
      'Mon-Lunch': 'Grilled chicken salad',
      'Mon-Dinner': 'Salmon with roasted vegetables',
      'Tue-Breakfast': 'Greek yogurt with berries',
      'Tue-Lunch': 'Turkey wrap with avocado',
      'Tue-Dinner': 'Beef stir fry with brown rice',
      'Wed-Breakfast': 'Whole grain toast with eggs',
      'Wed-Lunch': 'Lentil soup with bread',
      'Wed-Dinner': 'Baked cod with sweet potato',
      'Thu-Breakfast': 'Smoothie bowl',
      'Thu-Lunch': 'Quinoa chicken bowl',
      'Thu-Dinner': 'Pork tenderloin with greens',
      'Fri-Breakfast': 'Pancakes with fruit',
      'Fri-Lunch': 'Tuna salad sandwich',
      'Fri-Dinner': 'Pasta with tomato sauce & chicken',
      'Sat-Breakfast': 'Avocado toast with poached eggs',
      'Sat-Lunch': 'Buddha bowl',
      'Sat-Dinner': 'Grilled steak with salad',
      'Sun-Breakfast': 'French toast',
      'Sun-Lunch': 'Roast chicken with vegetables',
      'Sun-Dinner': 'Vegetable curry with rice',
    },
    caloriesPerDay: { Mon: 2000, Tue: 1950, Wed: 2050, Thu: 1900, Fri: 2100, Sat: 2200, Sun: 1850 },
  },
  vegan: {
    label: 'Vegan',
    emoji: '🌱',
    description: 'Plant-based, nutrient-dense whole foods',
    meals: {
      'Mon-Breakfast': 'Chia pudding with mango',
      'Mon-Lunch': 'Chickpea Buddha bowl',
      'Mon-Dinner': 'Lentil dal with basmati rice',
      'Tue-Breakfast': 'Smoothie with spinach & almond milk',
      'Tue-Lunch': 'Black bean tacos',
      'Tue-Dinner': 'Tofu stir fry with noodles',
      'Wed-Breakfast': 'Peanut butter banana toast',
      'Wed-Lunch': 'Roasted veggie wrap',
      'Wed-Dinner': 'Mushroom risotto',
      'Thu-Breakfast': 'Overnight oats with berries',
      'Thu-Lunch': 'Falafel with hummus & pita',
      'Thu-Dinner': 'Tempeh bowl with quinoa',
      'Fri-Breakfast': 'Acai bowl',
      'Fri-Lunch': 'Lentil soup',
      'Fri-Dinner': 'Vegetable pad thai',
      'Sat-Breakfast': 'Vegan pancakes with maple syrup',
      'Sat-Lunch': 'Jackfruit tacos',
      'Sat-Dinner': 'Cauliflower curry',
      'Sun-Breakfast': 'Avocado toast with tomatoes',
      'Sun-Lunch': 'Pea & mint soup',
      'Sun-Dinner': 'Sweet potato & black bean chili',
    },
    caloriesPerDay: { Mon: 1800, Tue: 1750, Wed: 1900, Thu: 1850, Fri: 1800, Sat: 2000, Sun: 1700 },
  },
  'high-protein': {
    label: 'High Protein',
    emoji: '💪',
    description: 'Muscle building & recovery focused meals',
    meals: {
      'Mon-Breakfast': 'Scrambled eggs with turkey & spinach',
      'Mon-Lunch': 'Grilled chicken breast with quinoa',
      'Mon-Dinner': 'Tuna steak with broccoli',
      'Tue-Breakfast': 'Protein smoothie with whey & oats',
      'Tue-Lunch': 'Ground beef bowl with brown rice',
      'Tue-Dinner': 'Salmon with asparagus',
      'Wed-Breakfast': 'Greek yogurt with nuts & seeds',
      'Wed-Lunch': 'Shrimp stir fry with vegetables',
      'Wed-Dinner': 'Chicken thighs with sweet potato',
      'Thu-Breakfast': 'Cottage cheese with fruit',
      'Thu-Lunch': 'Turkey meatballs with pasta',
      'Thu-Dinner': 'Steak with roasted vegetables',
      'Fri-Breakfast': 'Egg white omelette with cheese',
      'Fri-Lunch': 'Grilled chicken Caesar salad',
      'Fri-Dinner': 'Baked cod with lentils',
      'Sat-Breakfast': 'Smoked salmon with eggs',
      'Sat-Lunch': 'Beef & veggie kebab with rice',
      'Sat-Dinner': 'Pork chops with greens',
      'Sun-Breakfast': 'High protein pancakes',
      'Sun-Lunch': 'Chicken soup',
      'Sun-Dinner': 'Lamb with couscous',
    },
    caloriesPerDay: { Mon: 2400, Tue: 2350, Wed: 2500, Thu: 2300, Fri: 2450, Sat: 2600, Sun: 2200 },
  },
  'weight-loss': {
    label: 'Weight Loss',
    emoji: '🥗',
    description: 'Low calorie, high volume, filling meals',
    meals: {
      'Mon-Breakfast': 'Black coffee with boiled eggs',
      'Mon-Lunch': 'Large mixed salad with tuna',
      'Mon-Dinner': 'Grilled white fish with steamed broccoli',
      'Tue-Breakfast': 'Plain Greek yogurt with cucumber',
      'Tue-Lunch': 'Vegetable soup',
      'Tue-Dinner': 'Baked chicken with zucchini noodles',
      'Wed-Breakfast': 'Overnight oats (small portion)',
      'Wed-Lunch': 'Egg salad lettuce wraps',
      'Wed-Dinner': 'Shrimp with cauliflower rice',
      'Thu-Breakfast': 'Smoothie with water, spinach & protein',
      'Thu-Lunch': 'Turkey lettuce wraps',
      'Thu-Dinner': 'Salmon with green beans',
      'Fri-Breakfast': 'Poached eggs on 1 slice toast',
      'Fri-Lunch': 'Chicken broth with vegetables',
      'Fri-Dinner': 'Stir fried tofu & vegetables',
      'Sat-Breakfast': 'Berries with cottage cheese',
      'Sat-Lunch': 'Large kale salad with chicken',
      'Sat-Dinner': 'Grilled lean beef with salad',
      'Sun-Breakfast': 'Egg white omelette',
      'Sun-Lunch': 'Lentil & vegetable soup',
      'Sun-Dinner': 'Baked turkey breast with asparagus',
    },
    caloriesPerDay: { Mon: 1400, Tue: 1350, Wed: 1450, Thu: 1300, Fri: 1400, Sat: 1500, Sun: 1300 },
  },
  keto: {
    label: 'Keto',
    emoji: '🥑',
    description: 'Low carb, high fat ketogenic diet',
    meals: {
      'Mon-Breakfast': 'Bacon & eggs with avocado',
      'Mon-Lunch': 'Caesar salad with grilled chicken (no croutons)',
      'Mon-Dinner': 'Ribeye steak with buttered broccoli',
      'Tue-Breakfast': 'Bullet coffee with cream cheese',
      'Tue-Lunch': 'Tuna stuffed avocado',
      'Tue-Dinner': 'Pork belly with roasted cabbage',
      'Wed-Breakfast': 'Keto pancakes with butter',
      'Wed-Lunch': 'BLT lettuce wrap',
      'Wed-Dinner': 'Salmon with creamy spinach',
      'Thu-Breakfast': 'Smoked salmon & cream cheese',
      'Thu-Lunch': 'Egg salad with mayo',
      'Thu-Dinner': 'Lamb chops with roasted cauliflower',
      'Fri-Breakfast': 'Omelette with cheese & mushrooms',
      'Fri-Lunch': 'Chicken wings with blue cheese dip',
      'Fri-Dinner': 'Beef burger (no bun) with bacon',
      'Sat-Breakfast': 'Fried eggs with sausage',
      'Sat-Lunch': 'Antipasto platter',
      'Sat-Dinner': 'Duck breast with green salad',
      'Sun-Breakfast': 'Cheese & veggie frittata',
      'Sun-Lunch': 'Zucchini noodles with pesto & shrimp',
      'Sun-Dinner': 'Roast chicken with asparagus',
    },
    caloriesPerDay: { Mon: 2000, Tue: 1900, Wed: 2100, Thu: 1950, Fri: 2050, Sat: 2200, Sun: 1850 },
  },
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useNutritionStore = create(
  persist(
    (set, get) => ({
      // Meal planner
      meals: {},         // { 'Mon-Breakfast': 'Oatmeal', ... }
      activePlan: null,  // key of active preset, or 'custom'

      setMeal: (day, slot, value) =>
        set((s) => ({ meals: { ...s.meals, [`${day}-${slot}`]: value } })),

      loadPreset: (planKey) => {
        const plan = PRESET_PLANS[planKey]
        if (!plan) return
        set({ meals: { ...plan.meals }, activePlan: planKey })
      },

      startCustomPlan: () => set({ meals: {}, activePlan: 'custom' }),

      clearPlan: () => set({ meals: {}, activePlan: null }),

      // Calculator — tracks last analyzed recipe per session
      lastAnalyzed: null,  // { label, calories, protein, fat, carbs }

      setLastAnalyzed: (data) => set({ lastAnalyzed: data }),

      // Derive weekly calories from meal planner
      // Uses preset calorie data if a preset is loaded, otherwise estimates 500 cal/meal
      getWeeklyCalories: () => {
        const { meals, activePlan } = get()
        const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const SLOTS = ['Breakfast', 'Lunch', 'Dinner']

        if (activePlan && activePlan !== 'custom' && PRESET_PLANS[activePlan]) {
          return DAYS.map((day) => ({
            day,
            calories: PRESET_PLANS[activePlan].caloriesPerDay[day] || 0,
          }))
        }

        return DAYS.map((day) => ({
          day,
          calories: SLOTS.reduce((sum, slot) => {
            const meal = meals[`${day}-${slot}`]
            if (!meal || !meal.trim()) return sum
            // Rough estimate: breakfast ~400, lunch ~600, dinner ~700
            const slotCal = { Breakfast: 400, Lunch: 600, Dinner: 700 }
            return sum + slotCal[slot]
          }, 0),
        }))
      },

      // Today's filled meal count (for dashboard goals)
      getTodayProgress: () => {
        const { meals } = get()
        const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
        const SLOTS = ['Breakfast', 'Lunch', 'Dinner']
        const filled = SLOTS.filter((s) => meals[`${today}-${s}`]?.trim()).length
        return { filled, total: SLOTS.length, day: today }
      },
    }),
    { name: 'trophos-nutrition-store' }
  )
)
