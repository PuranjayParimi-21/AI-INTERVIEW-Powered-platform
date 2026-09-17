from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

try:
    print("Connecting to MongoDB...")
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=3000)
    # Ping the database to verify connectivity
    client.admin.command('ping')
    db = client["careergpt_db"]
    print("Connected to primary MongoDB successfully.")
except Exception as e:
    print(f"Primary MongoDB connection failed: {e}")
    print("Falling back to local MongoDB: mongodb://localhost:27017")
    try:
        client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=2000)
        client.admin.command('ping')
        db = client["careergpt_db"]
        print("Connected to fallback local MongoDB successfully.")
    except Exception as fallback_err:
        print(f"Fallback MongoDB connection failed: {fallback_err}")
        # Initialize client with local URL anyway to let FastAPI boot up
        client = MongoClient("mongodb://localhost:27017")
        db = client["careergpt_db"]

