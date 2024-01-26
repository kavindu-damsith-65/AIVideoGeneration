import os
from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGO_URI")
client = MongoClient(uri, server_api=ServerApi('1'))
db=None

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    db = client.get_database(os.getenv('DB_NAME'))
except Exception as e:
    print(e)




def create_data(data,collection):
    try:
        collection = db.get_collection(collection)
        inserted_data = collection.insert_one(data)
        if inserted_data:
            
            return str(inserted_data.inserted_id)
        return False
    except:
        return False


def read_data(data,collection):
    
    collection = db.get_collection(collection)
    result = collection.find_one(data)
    if result:
        result['_id'] = str(result['_id'])
        return result
    else:
        return False


def update_data(selecter,data,collection):
    collection = db.get_collection(collection)
    updated_data = collection.update_one(selecter, {"$set": data})

    if updated_data.modified_count > 0:
        return True
    else:
        return False


def delete_data(data,collection):
    collection = db.get_collection(collection)
    deleted_data = collection.delete_one(data)
    if deleted_data.deleted_count > 0:
        return True
    else:
        return False