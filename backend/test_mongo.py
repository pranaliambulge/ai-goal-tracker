from pymongo import MongoClient

client = MongoClient("YOUR_CONNECTION_STRING")
print(client.list_database_names())