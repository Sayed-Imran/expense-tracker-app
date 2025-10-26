from pydantic import BaseModel, Field, EmailStr, field_validator, ConfigDict
from pydantic_core import core_schema
from typing import Optional, List, Any, Union
from datetime import datetime
from datetime import date as date_type
from bson import ObjectId


class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type: Any, _handler: Any) -> core_schema.CoreSchema:
        return core_schema.union_schema([
            core_schema.is_instance_schema(ObjectId),
            core_schema.chain_schema([
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate),
            ])
        ], serialization=core_schema.plain_serializer_function_ser_schema(lambda x: str(x)))

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str):
            if not ObjectId.is_valid(v):
                raise ValueError("Invalid ObjectId")
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    username: str
    email: EmailStr
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class Category(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class SubCategory(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    category_id: Optional[str] = None  # Optional link to parent category
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class ExpenseCreate(BaseModel):
    title: str
    category: str
    sub_category: Optional[str] = None
    amount: float
    date: Optional[Union[datetime, date_type, str]] = None
    comments: Optional[str] = None
    
    @field_validator('date', mode='before')
    @classmethod
    def parse_date(cls, v):
        if v is None or v == '':
            return datetime.utcnow()
        if isinstance(v, datetime):
            return v
        if isinstance(v, date_type):
            return datetime.combine(v, datetime.min.time())
        if isinstance(v, str):
            try:
                # Try parsing ISO format with time
                return datetime.fromisoformat(v.replace('Z', '+00:00'))
            except:
                try:
                    # Try parsing date only (YYYY-MM-DD)
                    return datetime.strptime(v, '%Y-%m-%d')
                except:
                    return datetime.utcnow()
        return datetime.utcnow()


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    sub_category: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[Union[datetime, date_type, str]] = None
    comments: Optional[str] = None
    
    @field_validator('date', mode='before')
    @classmethod
    def parse_date(cls, v):
        if v is None or v == '':
            return None
        if isinstance(v, datetime):
            return v
        if isinstance(v, date_type):
            return datetime.combine(v, datetime.min.time())
        if isinstance(v, str):
            try:
                return datetime.fromisoformat(v.replace('Z', '+00:00'))
            except:
                try:
                    return datetime.strptime(v, '%Y-%m-%d')
                except:
                    return None
        return None


class Expense(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    title: str
    category: str
    sub_category: Optional[str] = None
    amount: float
    date: datetime
    comments: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: lambda dt: dt.isoformat()}


class CategoryCreate(BaseModel):
    name: str


class SubCategoryCreate(BaseModel):
    name: str
    category_id: Optional[str] = None
