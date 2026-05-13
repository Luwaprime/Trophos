import axios from 'axios'

const API_KEY = import.meta.env.VITE_TASTY_KEY
const BASE_URL = 'https://tasty.p.rapidapi.com'

const headers = {
  'x-rapidapi-key': API_KEY,
  'x-rapidapi-host': 'tasty.p.rapidapi.com',
}

const normaliseRecipe = (recipe) => {
  const nutrition = recipe.nutrition || {}
  const calories  = Math.round(nutrition.calories || 0)
  const protein   = parseFloat(nutrition.protein  || 0)
  const fat       = parseFloat(nutrition.fat       || 0)
  const carbs     = parseFloat(nutrition.carbohydrates || 0)

  const ingredientLines = (recipe.sections || []).flatMap((section) =>
    (section.components || []).map((c) => c.raw_text || c.ingredient?.name || '')
  ).filter(Boolean)

  const instructions = (recipe.instructions || [])
    .sort((a, b) => a.position - b.position)
    .map((i) => i.display_text)
    .join('\n')

  return {
    id: String(recipe.id),
    label: recipe.name,
    image: recipe.thumbnail_url || '',
    source: recipe.credits?.[0]?.name || 'Tasty',
    url: recipe.original_video_url || '',
    cuisineType: recipe.tags
      ?.filter((t) => t.type === 'cuisine')
      .map((t) => t.display_name.toLowerCase()) || ['other'],
    mealType: recipe.tags
      ?.filter((t) => t.type === 'meal')
      .map((t) => t.display_name.toLowerCase()) || ['other'],
    dietLabels: recipe.tags
      ?.filter((t) => t.type === 'dietary')
      .map((t) => t.display_name) || [],
    healthLabels: recipe.tags
      ?.filter((t) => ['healthy', 'dietary'].includes(t.type))
      .map((t) => t.display_name) || [],
    ingredientLines,
    calories,
    totalNutrients: {
      PROCNT: { quantity: protein, unit: 'g' },
      FAT:    { quantity: fat,     unit: 'g' },
      CHOCDF: { quantity: carbs,   unit: 'g' },
    },
    instructions,
    yield: recipe.num_servings || 4,
  }
}

export const searchRecipes = async (query, filters = {}) => {
  try {
    const params = { from: 0, size: 20, q: query }

    // Map diet filters to Tasty tags
    const dietTagMap = {
      'vegan':        'vegan',
      'balanced':     'healthy',
      'high-protein': 'high-protein',
      'low-fat':      'low-fat',
    }
    if (filters.diet && dietTagMap[filters.diet]) {
      params.tags = dietTagMap[filters.diet]
    }

    const { data } = await axios.get(`${BASE_URL}/recipes/list`, { headers, params })
    return (data.results || []).map(normaliseRecipe)
  } catch (error) {
    console.error('Failed to search recipes:', error)
    throw error
  }
}

export const getRecipeById = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/recipes/get-more-info`, {
      headers,
      params: { id },
    })
    return normaliseRecipe(data)
  } catch (error) {
    console.error('Failed to get recipe:', error)
    throw error
  }
}