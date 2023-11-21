# -*- coding: utf-8 -*-
import json
import bson
import pandas
from config import client, DATASET_PATH, DATABASE_NAME, COLLECTION


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, bson.ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


def read_dataset():
    data = pandas.read_csv(DATASET_PATH, encoding='gbk')
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
