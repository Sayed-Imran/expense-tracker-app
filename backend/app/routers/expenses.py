from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from ..models import Expense, ExpenseCreate, ExpenseUpdate, User
from ..auth import get_current_user
from ..database import get_user_database

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_expense(
    expense: ExpenseCreate,
    current_user: User = Depends(get_current_user)
):
    user_db = get_user_database(current_user.username)
    
    # Auto-create category if it doesn't exist
    category_exists = await user_db.categories.find_one({"name": expense.category})
    if not category_exists:
        await user_db.categories.insert_one({"name": expense.category, "created_at": datetime.utcnow()})
    
    # Auto-create subcategory if it doesn't exist and is provided
    if expense.sub_category:
        subcategory_exists = await user_db.subcategories.find_one({"name": expense.sub_category})
        if not subcategory_exists:
            await user_db.subcategories.insert_one({
                "name": expense.sub_category,
                "created_at": datetime.utcnow()
            })
    
    expense_dict = expense.model_dump()
    expense_dict["created_at"] = datetime.utcnow()
    expense_dict["updated_at"] = datetime.utcnow()
    
    result = await user_db.expenses.insert_one(expense_dict)
    
    return {
        "message": "Expense created successfully",
        "id": str(result.inserted_id)
    }


@router.get("/", response_model=List[dict])
async def get_expenses(
    category: Optional[str] = None,
    sub_category: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user)
):
    user_db = get_user_database(current_user.username)
    
    # Build query filter
    query = {}
    if category and category.strip():
        query["category"] = category
    if sub_category and sub_category.strip():
        query["sub_category"] = sub_category
    if start_date or end_date:
        query["date"] = {}
        if start_date and start_date.strip():
            try:
                query["date"]["$gte"] = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            except:
                try:
                    query["date"]["$gte"] = datetime.strptime(start_date, '%Y-%m-%d')
                except:
                    pass
        if end_date and end_date.strip():
            try:
                query["date"]["$lte"] = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            except:
                try:
                    query["date"]["$lte"] = datetime.strptime(end_date, '%Y-%m-%d')
                except:
                    pass
    
    cursor = user_db.expenses.find(query).sort("date", -1).skip(skip).limit(limit)
    expenses = await cursor.to_list(length=limit)
    
    # Convert ObjectId to string
    for expense in expenses:
        expense["_id"] = str(expense["_id"])
    
    return expenses


@router.get("/{expense_id}", response_model=dict)
async def get_expense(
    expense_id: str,
    current_user: User = Depends(get_current_user)
):
    user_db = get_user_database(current_user.username)
    
    if not ObjectId.is_valid(expense_id):
        raise HTTPException(status_code=400, detail="Invalid expense ID")
    
    expense = await user_db.expenses.find_one({"_id": ObjectId(expense_id)})
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    expense["_id"] = str(expense["_id"])
    return expense


@router.put("/{expense_id}", response_model=dict)
async def update_expense(
    expense_id: str,
    expense_update: ExpenseUpdate,
    current_user: User = Depends(get_current_user)
):
    user_db = get_user_database(current_user.username)
    
    if not ObjectId.is_valid(expense_id):
        raise HTTPException(status_code=400, detail="Invalid expense ID")
    
    # Check if expense exists
    existing_expense = await user_db.expenses.find_one({"_id": ObjectId(expense_id)})
    if not existing_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # Build update dict
    update_dict = {k: v for k, v in expense_update.model_dump().items() if v is not None}
    
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # Auto-create category if changed and doesn't exist
    if "category" in update_dict:
        category_exists = await user_db.categories.find_one({"name": update_dict["category"]})
        if not category_exists:
            await user_db.categories.insert_one({"name": update_dict["category"], "created_at": datetime.utcnow()})
    
    # Auto-create subcategory if changed and doesn't exist
    if "sub_category" in update_dict and update_dict["sub_category"]:
        subcategory_exists = await user_db.subcategories.find_one({"name": update_dict["sub_category"]})
        if not subcategory_exists:
            await user_db.subcategories.insert_one({
                "name": update_dict["sub_category"],
                "created_at": datetime.utcnow()
            })
    
    update_dict["updated_at"] = datetime.utcnow()
    
    await user_db.expenses.update_one(
        {"_id": ObjectId(expense_id)},
        {"$set": update_dict}
    )
    
    return {"message": "Expense updated successfully"}


@router.delete("/{expense_id}", response_model=dict)
async def delete_expense(
    expense_id: str,
    current_user: User = Depends(get_current_user)
):
    user_db = get_user_database(current_user.username)
    
    if not ObjectId.is_valid(expense_id):
        raise HTTPException(status_code=400, detail="Invalid expense ID")
    
    result = await user_db.expenses.delete_one({"_id": ObjectId(expense_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    return {"message": "Expense deleted successfully"}
