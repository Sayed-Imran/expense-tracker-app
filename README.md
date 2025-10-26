# Expense Tracker

A full-stack expense tracking web application built with React, TypeScript, FastAPI, and MongoDB.

## Features

- ✅ Multi-user authentication with JWT tokens
- ✅ Separate database per user for data isolation
- ✅ Create, read, update, and delete expenses
- ✅ 5 expense fields: title, category, subcategory, amount, date, and comments
- ✅ Category and subcategory management
- ✅ Auto-creation of categories/subcategories on the fly
- ✅ Data visualization with charts
- ✅ Filtering by category, subcategory, and date range
- ✅ Responsive, mobile-first design
- ✅ Modern, minimalistic UI

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Axios
- Recharts
- date-fns
- Lucide React

### Backend
- FastAPI
- Python 3.8+
- MongoDB (Motor)
- JWT Authentication
- Pydantic

## Project Structure

```
expense-tracker/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── routers/
│   │   ├── models.py
│   │   ├── database.py
│   │   ├── auth.py
│   │   ├── config.py
│   │   └── main.py
│   ├── requirements.txt
│   └── README.md
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── README.md
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- MongoDB (local or cloud)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Linux/Mac
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file:
```bash
cp .env.example .env
```

5. Update the `.env` file with your configuration:
```env
MONGODB_URL=mongodb://localhost:27017
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Generate a secure SECRET_KEY:
```bash
openssl rand -hex 32
```

6. Start MongoDB (if running locally):
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

7. Run the backend server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. Register a new account or login with existing credentials
2. Add your first expense with category and subcategory
3. View and manage your expenses on the main page
4. Use filters to find specific expenses
5. Visit the Analytics page to see spending visualizations
6. Manage categories and subcategories in Settings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Expenses
- `POST /api/expenses/` - Create expense
- `GET /api/expenses/` - List expenses (with filters)
- `GET /api/expenses/{id}` - Get single expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Categories
- `POST /api/categories/` - Create category
- `GET /api/categories/` - List categories
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category
- `POST /api/categories/subcategories` - Create subcategory
- `GET /api/categories/subcategories` - List subcategories
- `PUT /api/categories/subcategories/{id}` - Update subcategory
- `DELETE /api/categories/subcategories/{id}` - Delete subcategory

### Analytics
- `GET /api/analytics/summary` - Get expense summary
- `GET /api/analytics/by-category` - Group by category
- `GET /api/analytics/by-subcategory` - Group by subcategory
- `GET /api/analytics/by-date` - Group by date

## Features in Detail

### Multi-User Support
Each user has their own separate MongoDB database for complete data isolation.

### Auto-Creation
When creating an expense, if a category or subcategory doesn't exist, it will be automatically created.

### Responsive Design
The UI is fully responsive and works seamlessly on mobile devices, tablets, and desktops.

### Data Visualization
- Pie charts for spending by category
- Bar charts for spending over time
- Summary statistics
- Flexible date range filtering

## Production Deployment

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist folder with your preferred web server
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
