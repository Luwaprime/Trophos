import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './layouts/Navbar'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import Calculator from './pages/Calculator'
import MealPlanner from './pages/MealPlanner'
import Dashboard from './pages/Dashboard'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}