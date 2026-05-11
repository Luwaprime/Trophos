import axios from 'axios'

// Get API credentials from environment variables
const APP_ID = import.meta.env.VITE_EDAMAM_ID || 'YOUR_APP_ID'
const APP_KEY = import.meta.env.VITE_EDAMAM_KEY || 'YOUR_APP_KEY'
const BASE_URL = 'https://api.edamam.com/api/recipes/v2'

export const searchRecipes = async (query, filters = {}) => {
  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        type: 'public',
        q: query,
        app_id: APP_ID,
        app_key: APP_KEY,
        ...filters,
      },
    })
    return data.hits.map((hit) => ({
      ...hit.recipe,
      id: hit._links?.self?.href || hit.recipe.uri,
    }))
  } catch (error) {
    console.error('Failed to search recipes:', error)
    throw error
  }
}

export const getRecipeById = async (id) => {
  try {
    const { data } = await axios.get(id, {
      params: {
        type: 'public',
        app_id: APP_ID,
        app_key: APP_KEY,
      },
    })
    return data.recipe
  } catch (error) {
    console.error('Failed to get recipe:', error)
    throw error
  }
}