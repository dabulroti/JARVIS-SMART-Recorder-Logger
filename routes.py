from fastapi import APIRouter, HTTPException
from pymongo import MongoClient

router = APIRouter()

client = MongoClient("mongodb://localhost:27017/")
db = client["your_database_name"]  # Replace with your database name
collection = db["your_collection_name"]  # Replace with your collection name

@router.get("/items/")
async def read_items():
    items = list(collection.find())
    return items

@router.post("/items/")
async def create_item(item: dict):
    result = collection.insert_one(item)
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    else:
        raise HTTPException(status_code=500, detail="Failed to create item.")
