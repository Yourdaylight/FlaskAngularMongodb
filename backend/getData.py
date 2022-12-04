# -*- coding: utf-8 -*-
# @Time    :2022/12/5 3:47
# @Author  :lzh
# @File    : getData.py
# @Software: PyCharm
import copy
import time
import pandas
import requests
from bs4 import BeautifulSoup
from config import client


def spider_online():
    url = "https://bbs.a9vg.com/thread-8705407-1-1.html"
    lxml = requests.get(url).text

    soup = BeautifulSoup(lxml, "lxml")
    table = soup.find("table", attrs={"class": "t_table", "style": "width:80%", "bgcolor": "Beige"})
    tr_list = table.find_all("tr")
    data = []
    fps = []
    meet_new_game = False
    game = {}
    for index,tr in enumerate(tr_list):
        td_list = tr.find_all("td")
        style = tr.get("style")
        if style == "background-color:Khaki" and index!=0:
            img_src = tr.find("img").get("src")
            strong = tr.find("strong").text
            game = {"fps":copy.copy(fps),"img_src": img_src, "name": strong}
            data.append(game)
            fps = []
        # style为空时则是
        else:
            for index, td in enumerate(td_list):
                fps.append(td.text)
    data.append(game)
    pandas.DataFrame(data).to_csv("game.csv", encoding="utf-8-sig", index=True)

# 将数据写入数据库
def save_to_db():
    db = client["game"]
    db["game"].drop()
    dbGame = db["game"]
    data = pandas.read_csv("game.csv", encoding="utf-8-sig")
    data = data.to_dict(orient="records")
    for item in data:
        try:
            item.pop("Unnamed: 0")
            item["fps"] = list(set(eval(item["fps"])))
            item["fps"] = [i for i in item["fps"] if i]
            item["fps"] = ",".join(item["fps"])
            item["update_time"] = int(time.time())
        except Exception as e:
            print(e)
            print(item)
    dbGame.insert_many(data)
if __name__ == '__main__':
    spider_online()
    save_to_db()
