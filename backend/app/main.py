from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
from pathlib import Path
from .database import connect_db, close_db
from .routers import auth, expenses, categories, analytics


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_db()
    yield
    # Shutdown
    await close_db()


app = FastAPI(
    title="Expense Tracker API",
    description="A comprehensive expense tracking API with multi-user support",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you might want to restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(expenses.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Serve static files from the frontend build
static_dir = Path(__file__).parent.parent / "frontend" / "dist"
if static_dir.exists():
    # Mount static files (JS, CSS, images, etc.)
    app.mount("/assets", StaticFiles(directory=str(static_dir / "assets")), name="assets")
    
    # Catch-all route for client-side routing - must be last
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Serve index.html for all non-API routes
        index_file = static_dir / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return {"message": "Frontend not built. Run 'npm run build' in the frontend directory."}
else:
    @app.get("/")
    async def root():
        return {
            "message": "Expense Tracker API",
            "version": "1.0.0",
            "docs": "/docs",
            "note": "Frontend not built. Run 'npm run build' in the frontend directory to enable frontend serving."
        }
