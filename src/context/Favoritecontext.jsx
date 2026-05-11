import { createContext, useContext, useState } from 'react'

const Ctx = createContext()

export const FavoritesProvider = ({ children }) => {
  const [favs, setFavs] = useState(
    () => JSON.parse(localStorage.getItem('favs') ?? '[]')
  )
  const toggle = (recipe) => {
    const next = favs.find(f => f.label === recipe.label)
      ? favs.filter(f => f.label !== recipe.label)
      : [...favs, recipe]
    setFavs(next)
    localStorage.setItem('favs', JSON.stringify(next))
  }
  return <Ctx.Provider value={{ favs, toggle }}>{children}</Ctx.Provider>
}

export const useFavorites = () => useContext(Ctx)