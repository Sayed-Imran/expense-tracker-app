# Expense Tracker Backend

FastAPI backend for the Expense Tracker application with MongoDB.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Linux/Mac
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
   - Set a secure `SECRET_KEY` (you can generate one with: `openssl rand -hex 32`)
   - Update `MONGODB_URL` if needed

5. Make sure MongoDB is running:
```bash
# If using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Running the Application

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

API documentation will be available at `http://localhost:8000/docs`

## Features

- User authentication with JWT tokens
- Separate database per user for data isolation
- CRUD operations for expenses
- Category and subcategory management
- Auto-creation of categories/subcategories on-the-fly
- Analytics and reporting endpoints
- Date range filtering

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `GET /api/auth/me` - Get current user info

### Expenses
- `POST /api/expenses/` - Create new expense
- `GET /api/expenses/` - List expenses with filters
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
- `GET /api/analytics/by-date` - Group by date (day/week/month/year)
