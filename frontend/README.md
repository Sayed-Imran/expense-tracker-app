# Expense Tracker Frontend

React + TypeScript frontend for the Expense Tracker application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features

- User authentication (login/register)
- Create, read, update, and delete expenses
- Auto-complete for categories and subcategories
- Category and subcategory management
- Data visualization with charts
- Filtering by category, subcategory, and date range
- Responsive design for mobile and desktop
- Modern, minimalistic UI

## Technology Stack

- React 18
- TypeScript
- Vite
- React Router
- Axios
- Recharts (for data visualization)
- date-fns (for date handling)
- Lucide React (for icons)

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
├── contexts/         # React contexts
│   └── AuthContext.tsx
├── pages/            # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Expenses.tsx
│   ├── Analytics.tsx
│   └── Settings.tsx
├── services/         # API services
│   ├── authService.ts
│   ├── expenseService.ts
│   ├── categoryService.ts
│   └── analyticsService.ts
├── types/            # TypeScript types
│   └── index.ts
├── utils/            # Utility functions
│   └── api.ts
├── App.tsx           # Main app component
├── main.tsx          # App entry point
└── index.css         # Global styles
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.
