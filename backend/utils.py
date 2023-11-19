# -*- coding: utf-8 -*-
import json
import bson
import base64
import random
import pandas
import time
from config import client, DATASET_PATH, DATABASE_NAME, COLLECTION


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, bson.ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


def get_token(user_id):
    token = base64.b64encode(
        (".".join([str(user_id), str(random.random()), str(time.time() + 7200)])).encode()).decode()
    return token


def verify_token(token):
    _token = base64.b64decode(token).decode()
    user_id, random_num, expire_time = _token.split(".")
    if float(expire_time) > time.time():
        return True, user_id
    else:
        # token is expired
        return False, user_id


def read_dataset():
    data = pandas.read_csv(DATASET_PATH,encoding='gbk')
    data = data.fillna("")
    data = data.to_dict(orient="records")
    database = client[DATABASE_NAME]
    list_data = []
    for item in data:
        list_data.append(item)
    database[COLLECTION].insert_many(list_data)
    return data


if __name__ == '__main__':
    print(read_dataset()[0])
