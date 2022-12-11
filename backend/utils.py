# -*- coding: utf-8 -*-
import json
import bson
import base64
import random
import pandas
import time
from db import client


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
    data = pandas.read_csv("dataset/netflix_titles.csv", encoding="utf-8")
    data = data.fillna("")
    data = data.to_dict(orient="records")
    netflix_collection = client["netflix"]
    netflix_collection["netflix"].drop()
    list_data = []
    for movie in data:
        if movie["type"] == "Movie":
            movie["pic_url"] = "data:image/png;base64,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"
        if movie["type"] == "TV Show":
            movie["pic_url"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAAETCAMAAABDSmfhAAAAkFBMVEX////lCRTkAAD2vsDlAAv86uvlAA/kAAPrVlv1s7XsZGjoOkD1uLn87Oz51NXnIintdHf62tv/+vvxlZfzpaf73+Dym534zs/85ebwiYz4ycv3xMX1tbbpQkfrW1/oNzz0qqzsa27qTlLue37nLTPwjpH+9PXlERvsaGztcXXpR0vmHSTxl5rvgoXzp6nxkZNFggwGAAAEJUlEQVR4nO3ZaVeqQACAYRwIcyv1uluae1bW//93l1lk7zTDOeKX9/mEpPBGOAzkeQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEC5YdePLMyrmZ+80ssp42jlIL/S7/ai1cv8ymG0MllK0VudJrtWm5WO+uXMrvtBKGbrL+rFVi23RM4oWnnJrxRCNuzzK+Xe9dJDdn96Dyu13FHLr+YnX8knrbobEdHVr7ryVfPRdDcyVPc8tzJa/SQLgtxKWRuGcqmX3Z/ag2irZV/v2xxwod6+sss23Sa15m6TOk/tTv317Luvm6+5W20tFGp5LTcRrC2z4+7vX7rD7Pk9V0tNUxef37o7dX7bdQ/0MV4mi2+O3eYXLXSH613f2Phy5VkutlX4Sa8eX7tFux+/92jV7b3KzzXlOLBJHXqH7ob+Hhe6xa7sQ+rghM/JCt09zr7LovtNmJO0pxcO7t2T8u5+2YeeyrsHzt1DnfsVDYLx18KtO2zco9vrqy2dzMjybp0dd+u91t491ce57zYIZrp39+j29nokUmNDxz476Vbf5fq7J8kFQbxU6W4I33o8+aXbfTzxzEASH7gq3Zuy7vOx9zCTLLoP3yNl6tDtPcYn6qRadyOaFBavl/EV8O/u+L1fLt3LuDv3Tvvu1u/zk9CmO3fg7Lr1EKj/3NW6mx936T6YGVLuW23V/XlWmzveo3umB8EPp+zr8V6ozU38YncYBpHmzc5vc+m53gG4dQvvFMqBf1nsfn7e79edTmZi/Mt4cvn6J/0snLrb5jyxn5ukuy9qe/Pax+9kYjev1K2npvsw333r66W3u07sPqt0D71PuZewUXf30AyD5rbHvTu5c6y1+zu5Xrc9B3H3+D7d62QEFccq3fpEqbtbjb/R1SE97jt2xzPKOrtXekvqrjjYV+oe36Y799ws2232PnqqeL+jng9eL9a57oenhf82OexWybTeobshgtNz52N1nv9Mi92X697171h6kP7svp4ometlkH3u494dTRSimYL8/E+hWw+C4nzdt8M3M9XdK+tOVO2OP/+v0K0HQXmdNRmtKt366VGd3eqmOFAPktVtj/3jwUy3fnpk1S2dkq3o59+5biGCINVe7NaDoL5OZp8pu3Ufy7rDaA6rJcPrYLvp7y6ph2L+S6SVOzvbjx/rz9T3o3B+b+VjxsD82fSpfqnS7T02M93afrvZHUat7tJtopk49mbjqd8aLXR3/P+GWeZqo+ZX9vf0mW69UaFvPQZvy8HM5dJradgbL9SvcMnccOvLh3wYYkV1B6Z7uO1PWovxDWLLDWdP3e71xV4EobzHtaP+L7VfDf9+560t3l8D+/9LHb+nVc/bGxgOum639QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAO/oPASBDokmBLyUAAAAASUVORK5CYII="
        list_data.append(movie)
    netflix_collection["netflix"].insert_many(list_data)
    return data


if __name__ == '__main__':
    print(read_dataset()[0])
