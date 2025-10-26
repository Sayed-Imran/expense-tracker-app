from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from datetime import datetime
from bson import ObjectId
from ..models import Category, SubCategory, CategoryCreate, SubCategoryCreate, User
from ..auth import get_current_user
from ..database import get_user_database

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_category(
    category: CategoryCreate,
    current_user: User = Depends(get_current_user)
):
    user_db = get_user_database(current_user.username)
    
    # Check if category already exists
    existing = await user_db.categories.find_one({"name": category.name})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category already exists"
        )
    
    category_dict = {
        "name": category.name,
        "created_at": datetime.utcnow()
    }
    
    result = await user_db.categories.insert_one(category_dict)
    
    return {
        "message": "Category created successfully",
        "id": str(result.inserted_id)
    }


@router.get("/", response_model=List[dict])
async def get_categories(current_user: User = Depends(get_current_user)):
    user_db = get_user_database(current_user.username)
    
    cursor = user_db.categories.find().sort("name", 1)
    categories = await cursor.to_list(length=1000)
    
    for category in categories:
        category["_id"] = str(category["_id"])
    
    return categories


@router.put("/{category_id}", response_model=dict)
async def update_category(
    category_id: str,
    category: CategoryCreate,
    current_user: User = Depends(get_current_user)
):
    user_db = get_user_database(current_user.username)
    
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")
    
    # Check if new name already exists
    existing = await user_db.categories.find_one({
        "name": category.name,
        "_id": {"$ne": ObjectId(category_id)}
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category name already exists"
        )
    
    result = await user_db.categories.update_one(
        {"_id": ObjectId(category_id)},
        {"$set": {"name": category.name}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"message": "Category updated successfully"}


@router.delete("/{category_id}", response_model=dict)
async def delete_category(
    category_id: str,
    current_user: User = Depends(get_current_user)
):
    user_db = get_user_database(current_user.username)
    
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")
    
    # Get category name before deleting
    category = await user_db.categories.find_one({"_id": ObjectId(category_id)})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Delete the category
    await user_db.categories.delete_one({"_id": ObjectId(category_id)})
    
    return {
        "message": "Category deleted successfully",
        "warning": "Existing expenses with this category will retain the category name"
    }


# Subcategory endpoints
@router.post("/subcategories", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_subcategory(
    subcategory: SubCategoryCreate,
    current_user: User = Depends(get_current_user)
):
    user_db = get_user_database(current_user.username)
    
    # Check if subcategory already exists
    existing = await user_db.subcategories.find_one({"name": subcategory.name})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subcategory already exists"
        )
    
    subcategory_dict = {
        "name": subcategory.name,
        "category_id": subcategory.category_id,
        "created_at": datetime.utcnow()
    }
    
    result = await user_db.subcategories.insert_one(subcategory_dict)
    
    return {
        "message": "Subcategory created successfully",
        "id": str(result.inserted_id)
    }


@router.get("/subcategories", response_model=List[dict])
async def get_subcategories(current_user: User = Depends(get_current_user)):
    user_db = get_user_database(current_user.username)
    
    cursor = user_db.subcategories.find().sort("name", 1)
    subcategories = await cursor.to_list(length=1000)
    
    for subcategory in subcategories:
        subcategory["_id"] = str(subcategory["_id"])
    
    return subcategories


@router.put("/subcategories/{subcategory_id}", response_model=dict)
async def update_subcategory(
    subcategory_id: str,
    subcategory: SubCategoryCreate,
    current_user: User = Depends(get_current_user)
):
    user_db = get_user_database(current_user.username)
    
    if not ObjectId.is_valid(subcategory_id):
        raise HTTPException(status_code=400, detail="Invalid subcategory ID")
    
    # Check if new name already exists
    existing = await user_db.subcategories.find_one({
        "name": subcategory.name,
        "_id": {"$ne": ObjectId(subcategory_id)}
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subcategory name already exists"
        )
    
    result = await user_db.subcategories.update_one(
        {"_id": ObjectId(subcategory_id)},
        {"$set": {
            "name": subcategory.name,
            "category_id": subcategory.category_id
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    
    return {"message": "Subcategory updated successfully"}


@router.delete("/subcategories/{subcategory_id}", response_model=dict)
async def delete_subcategory(
    subcategory_id: str,
    current_user: User = Depends(get_current_user)
):
    user_db = get_user_database(current_user.username)
    
    if not ObjectId.is_valid(subcategory_id):
        raise HTTPException(status_code=400, detail="Invalid subcategory ID")
    
    result = await user_db.subcategories.delete_one({"_id": ObjectId(subcategory_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    
    return {
        "message": "Subcategory deleted successfully",
        "warning": "Existing expenses with this subcategory will retain the subcategory name"
    }
