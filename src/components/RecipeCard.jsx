import { motion } from 'framer-motion'
import { useFavorites } from '../context/Favoritecontext'

export default function RecipeCard({ recipe }) {
  const { favs, toggle } = useFavorites()
  const { label, image, calories, cuisineType } = recipe
  const isFavorite = favs.some((f) => f.label === label)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card"
      style={{
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
      }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '180px',
          overflow: 'hidden',
          background: 'var(--bg-light)',
        }}>
        <img
          src={image}
          alt={label}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggle(recipe)
          }}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}>
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div style={{ padding: '14px' }}>
        <h3
          style={{
            fontSize: '15px',
            fontWeight: '600',
            color: 'var(--text-dark)',
            marginBottom: '8px',
          }}>
          {label}
        </h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}>
          <span
            style={{
              fontSize: '12px',
              color: 'var(--green-primary)',
              fontWeight: '600',
              textTransform: 'capitalize',
              flex: 1,
            }}>
            {cuisineType?.[0] || 'recipe'}
          </span>
          <span
            style={{
              background: 'var(--yellow-accent)',
              color: '#3d2e00',
              fontSize: '11px',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
            }}>
            {Math.round(calories)} cal
          </span>
        </div>
      </div>
    </motion.div>
  )
}