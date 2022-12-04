import json
import pymongo
from bson import ObjectId

host = "127.0.0.1"
client = pymongo.MongoClient(host, 27017)


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)
