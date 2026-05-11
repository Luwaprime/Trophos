# Trophos

A modern nutrition and recipe management application built with React, featuring recipe search, meal planning, nutrition calculation, and personalized dashboards.

## Features

- 🔍 **Recipe Search** - Search recipes using the Edamam API
- 📋 **Meal Planner** - Plan your weekly meals with an interactive calendar
- 📊 **Nutrition Calculator** - Analyze nutritional content of ingredients
- ❤️ **Favorites** - Save your favorite recipes locally
- 📈 **Dashboard** - Track your nutrition goals and weekly intake

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **React Router** - Page routing
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Zustand** - State management

## Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd trophos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API credentials**
   - Create a `.env` file in the root directory
   - Add your Edamam API credentials:
     ```
     VITE_EDAMAM_ID=your_app_id
     VITE_EDAMAM_KEY=your_app_key
     ```
   - Get free credentials from [Edamam API](https://developer.edamam.com)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── pages/           # Page components (Home, Recipes, etc)
├── components/      # Reusable components
├── layouts/         # Layout components (Navbar)
├── context/         # React Context (Favorites)
├── services/        # API calls (Edamam)
├── App.jsx          # Main app component
├── main.jsx         # Entry point
├── App.css          # Global styles
└── index.css        # Base styles
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_EDAMAM_ID` | Edamam API Application ID |
| `VITE_EDAMAM_KEY` | Edamam API Key |

## License

MIT
# Trophos
