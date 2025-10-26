from fastapi import APIRouter, Depends, Query
from typing import Optional, List
from datetime import datetime
from ..models import User
from ..auth import get_current_user
from ..database import get_user_database

router = APIRouter(prefix="/analytics", tags=["Analytics"])


def parse_date_string(date_str: Optional[str]) -> Optional[datetime]:
    """Helper function to parse date strings"""
    if not date_str or not date_str.strip():
        return None
    try:
        return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    except:
        try:
            return datetime.strptime(date_str, '%Y-%m-%d')
        except:
            return None


@router.get("/summary")
async def get_expense_summary(
    category: Optional[str] = None,
    sub_category: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    user_db = get_user_database(current_user.username)
    
    # Build query filter
    match_stage = {}
    if category and category.strip():
        match_stage["category"] = category
    if sub_category and sub_category.strip():
        match_stage["sub_category"] = sub_category
    
    start_dt = parse_date_string(start_date)
    end_dt = parse_date_string(end_date)
    
    if start_dt or end_dt:
        match_stage["date"] = {}
        if start_dt:
            match_stage["date"]["$gte"] = start_dt
        if end_dt:
            match_stage["date"]["$lte"] = end_dt
    
    pipeline = []
    if match_stage:
        pipeline.append({"$match": match_stage})
    
    pipeline.extend([
        {
            "$group": {
                "_id": None,
                "total_amount": {"$sum": "$amount"},
                "count": {"$sum": 1},
                "avg_amount": {"$avg": "$amount"}
            }
        }
    ])
    
    result = await user_db.expenses.aggregate(pipeline).to_list(length=1)
    
    if not result:
        return {
            "total_amount": 0,
            "count": 0,
            "avg_amount": 0
        }
    
    return {
        "total_amount": result[0]["total_amount"],
        "count": result[0]["count"],
        "avg_amount": result[0]["avg_amount"]
    }


@router.get("/by-category")
async def get_expenses_by_category(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    user_db = get_user_database(current_user.username)
    
    match_stage = {}
    start_dt = parse_date_string(start_date)
    end_dt = parse_date_string(end_date)
    
    if start_dt or end_dt:
        match_stage["date"] = {}
        if start_dt:
            match_stage["date"]["$gte"] = start_dt
        if end_dt:
            match_stage["date"]["$lte"] = end_dt
    
    pipeline = []
    if match_stage:
        pipeline.append({"$match": match_stage})
    
    pipeline.extend([
        {
            "$group": {
                "_id": "$category",
                "total_amount": {"$sum": "$amount"},
                "count": {"$sum": 1},
                "avg_amount": {"$avg": "$amount"}
            }
        },
        {
            "$sort": {"total_amount": -1}
        }
    ])
    
    result = await user_db.expenses.aggregate(pipeline).to_list(length=1000)
    
    return [
        {
            "category": item["_id"],
            "total_amount": item["total_amount"],
            "count": item["count"],
            "avg_amount": item["avg_amount"]
        }
        for item in result
    ]


@router.get("/by-subcategory")
async def get_expenses_by_subcategory(
    category: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    user_db = get_user_database(current_user.username)
    
    match_stage = {}
    if category and category.strip():
        match_stage["category"] = category
    
    start_dt = parse_date_string(start_date)
    end_dt = parse_date_string(end_date)
    
    if start_dt or end_dt:
        match_stage["date"] = {}
        if start_dt:
            match_stage["date"]["$gte"] = start_dt
        if end_dt:
            match_stage["date"]["$lte"] = end_dt
    
    pipeline = []
    if match_stage:
        pipeline.append({"$match": match_stage})
    
    pipeline.extend([
        {
            "$group": {
                "_id": {
                    "category": "$category",
                    "sub_category": "$sub_category"
                },
                "total_amount": {"$sum": "$amount"},
                "count": {"$sum": 1},
                "avg_amount": {"$avg": "$amount"}
            }
        },
        {
            "$sort": {"total_amount": -1}
        }
    ])
    
    result = await user_db.expenses.aggregate(pipeline).to_list(length=1000)
    
    return [
        {
            "category": item["_id"]["category"],
            "sub_category": item["_id"]["sub_category"],
            "total_amount": item["total_amount"],
            "count": item["count"],
            "avg_amount": item["avg_amount"]
        }
        for item in result
    ]


@router.get("/by-date")
async def get_expenses_by_date(
    grouping: str = Query("day", regex="^(day|week|month|year)$"),
    category: Optional[str] = None,
    sub_category: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    user_db = get_user_database(current_user.username)
    
    match_stage = {}
    if category and category.strip():
        match_stage["category"] = category
    if sub_category and sub_category.strip():
        match_stage["sub_category"] = sub_category
    
    start_dt = parse_date_string(start_date)
    end_dt = parse_date_string(end_date)
    
    if start_dt or end_dt:
        match_stage["date"] = {}
        if start_dt:
            match_stage["date"]["$gte"] = start_dt
        if end_dt:
            match_stage["date"]["$lte"] = end_dt
    
    # Define date grouping format
    date_format = {
        "day": "%Y-%m-%d",
        "week": "%Y-W%U",
        "month": "%Y-%m",
        "year": "%Y"
    }
    
    pipeline = []
    if match_stage:
        pipeline.append({"$match": match_stage})
    
    pipeline.extend([
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": date_format[grouping],
                        "date": "$date"
                    }
                },
                "total_amount": {"$sum": "$amount"},
                "count": {"$sum": 1},
                "avg_amount": {"$avg": "$amount"}
            }
        },
        {
            "$sort": {"_id": 1}
        }
    ])
    
    result = await user_db.expenses.aggregate(pipeline).to_list(length=1000)
    
    return [
        {
            "date": item["_id"],
            "total_amount": item["total_amount"],
            "count": item["count"],
            "avg_amount": item["avg_amount"]
        }
        for item in result
    ]
