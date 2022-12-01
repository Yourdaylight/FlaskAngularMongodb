# -*- coding: utf-8 -*-
# @Time    :2022/11/30 2:36
# @Author  :lzh
# @File    : getStock.py
# @Software: PyCharm
# 写入全部股票代码及名称
def save_db():
    import csv
    from config import client
    client["stock"]["stock"].drop()
    with open("stock.csv", 'r', encoding="gbk") as f:
        reader = csv.DictReader(f)
        for row in reader:
            client["stock"]["stock"].insert_one(row)


if __name__ == "__main__":
    # save_stocks()
    save_db()
