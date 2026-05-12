import axios from 'axios'
 
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'
 
// Helper to normalise a MealDB meal object to match the shape
// the rest of your app already expects from Edamam
const normaliseMeal = (meal) => ({
  id: meal.idMeal,
  label: meal.strMeal,
  image: meal.strMealThumb,
  source: meal.strSource || '',
  url: meal.strSource || '',
  cuisineType: [meal.strArea?.toLowerCase() || 'other'],
  mealType: [meal.strCategory?.toLowerCase() || 'other'],
  dietLabels: [],
  healthLabels: [],
  ingredientLines: Object.keys(meal)
    .filter((k) => k.startsWith('strIngredient') && meal[k])
    .map((k) => {
      const index = k.replace('strIngredient', '')
      const ingredient = meal[k]
      const measure = meal[`strMeasure${index}`]?.trim()
      return measure ? `${measure} ${ingredient}` : ingredient
    }),
  calories: null, // MealDB free tier doesn't include nutrition data
  totalNutrients: {},
  instructions: meal.strInstructions || '',
  yield: 4, // MealDB doesn't provide serving count, default to 4
})
 
export const searchRecipes = async (query) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/search.php`, {
      params: { s: query },
    })
 
    if (!data.meals) return [] // MealDB returns null when no results found
 
    return data.meals.map(normaliseMeal)
  } catch (error) {
    console.error('Failed to search recipes:', error)
    throw error
  }
}
 
export const getRecipeById = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/lookup.php`, {
      params: { i: id },
    })
 
    if (!data.meals) throw new Error('Recipe not found')
 
    return normaliseMeal(data.meals[0])
  } catch (error) {
    console.error('Failed to get recipe:', error)
    throw error
  }
}
 
// Bonus: MealDB supports category filtering — useful for your meal planner
export const getRecipesByCategory = async (category) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/filter.php`, {
      params: { c: category },
    })
 
    if (!data.meals) return []
 
    // filter.php returns partial data, fetch full details for each
    const full = await Promise.all(
      data.meals.slice(0, 20).map((m) => getRecipeById(m.idMeal))
    )
    return full
  } catch (error) {
    console.error('Failed to get recipes by category:', error)
    throw error
  }
}