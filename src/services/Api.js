import axios from 'axios'

const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY
const BASE_URL = 'https://api.spoonacular.com/recipes'

// Normalise Spoonacular response to the shape your components expect
const normaliseRecipe = (recipe) => {
  const nutrients = recipe.nutrition?.nutrients || []
  const get = (name) => nutrients.find((n) => n.name === name)?.amount || 0

  return {
    id: String(recipe.id),
    label: recipe.title,
    image: recipe.image,
    source: recipe.sourceName || '',
    url: recipe.sourceUrl || '',
    cuisineType: recipe.cuisines?.length ? recipe.cuisines.map((c) => c.toLowerCase()) : ['other'],
    mealType: recipe.dishTypes?.length ? recipe.dishTypes.map((d) => d.toLowerCase()) : ['other'],
    dietLabels: recipe.diets || [],
    healthLabels: [
      recipe.vegetarian && 'Vegetarian',
      recipe.vegan && 'Vegan',
      recipe.glutenFree && 'Gluten-Free',
      recipe.dairyFree && 'Dairy-Free',
    ].filter(Boolean),
    ingredientLines: recipe.extendedIngredients?.map((i) => i.original) || [],
    calories: Math.round(get('Calories')),
    // Matches the Edamam totalNutrients shape your Calculator uses
    totalNutrients: {
      PROCNT: { quantity: get('Protein'), unit: 'g' },
      FAT:    { quantity: get('Fat'), unit: 'g' },
      CHOCDF: { quantity: get('Carbohydrates'), unit: 'g' },
    },
    instructions: recipe.instructions || '',
    yield: recipe.servings || 4,
  }
}

export const searchRecipes = async (query, filters = {}) => {
  try {
    const params = {
      apiKey: API_KEY,
      query,
      number: 20,
      addRecipeNutrition: true, // gets calories + macros in one call
      instructionsRequired: true,
    }

    // Map Edamam-style diet filter names to Spoonacular's
    const dietMap = {
      'balanced':     'balanced',
      'high-protein': 'high-protein',
      'low-fat':      'low-fat',
      'vegan':        'vegan',
    }
    if (filters.diet && dietMap[filters.diet]) {
      params.diet = dietMap[filters.diet]
    }

    const { data } = await axios.get(`${BASE_URL}/complexSearch`, { params })

    return (data.results || []).map(normaliseRecipe)
  } catch (error) {
    console.error('Failed to search recipes:', error)
    throw error
  }
}

export const getRecipeById = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${id}/information`, {
      params: {
        apiKey: API_KEY,
        includeNutrition: true,
      },
    })

    return normaliseRecipe(data)
  } catch (error) {
    console.error('Failed to get recipe:', error)
    throw error
  }
}