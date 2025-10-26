from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

client = None
main_db = None


async def connect_db():
    global client, main_db
    client = AsyncIOMotorClient(settings.mongodb_url)
    main_db = client["expense_tracker_main"]
    print("Connected to MongoDB")


async def close_db():
    global client
    if client:
        client.close()
        print("Closed MongoDB connection")


def get_database():
    return main_db


def get_user_database(username: str):
    """Get or create a separate database for each user"""
    db_name = f"expense_tracker_{username}"
    return client[db_name]
