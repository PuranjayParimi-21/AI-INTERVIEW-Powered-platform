from db import db

db.users.insert_one({
    "name": "Puranjay",
    "role": "Student"
})

print("Data Inserted Successfully")
