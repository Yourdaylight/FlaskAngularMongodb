# -*- coding: utf-8 -*-
# @Time    :2022/11/30 2:36
# @Author  :lzh
# @File    : getStock.py
# @Software: PyCharm
import requests
# 获取全部股票代码及名称
def _get_all_stocks():
    base_url = "http://54.push2.eastmoney.com/api/qt/clist/get?pn={page_num}&pz={page_size}&po=1&np=1&fltt=2&invt=2&fid=f3&fs={time_id}&fields=f12,f14"
    stocks = [
        {
            "category": "A股",
            "tag": "沪深A股",
            "type": "股票",
            "time_id": "m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23"
        },
        {
            "category": "A股",
            "tag": "上证A股",
            "type": "股票",
            "time_id": "m:1+t:2,m:1+t:23"
        }
    ]

    all_stocks = []
    for stock in stocks:
        all_stocks.extend(_get_stocks(base_url, stock))

    print("全部股票信息共{0}条。".format(len(all_stocks)))
    return all_stocks

# 获取股票信息
def _get_stocks(base_url, stock):
    max_page_num = 50
    page_size = 100
    result = []

    for page_num in range(1, max_page_num):
        url = base_url.format(time_id=stock["time_id"], page_num=page_num, page_size=page_size)
        resp = requests.get(url)

        if not resp.ok:
            print("{0}-{1}-{2}请求失败：{3}".format(stock["type"],
                                                       stock["category"],
                                                       stock["tag"],
                                                       url))

        resp_json = resp.json()
        if not resp_json["data"]:
            print("当前页无数据，将不再继续请求！")
            break

        stocks = resp_json["data"]["diff"]
        result.extend(list(
            map(lambda s: {"id": s["f12"].replace(" ", "").replace("'", "_"),
                           "name": s["f14"].replace(" ", "").replace("'", "_"),
                           "category": stock["category"],
                           "tag": stock["tag"],
                           "type": stock["type"]},
                stocks)))

    print("{0}-{1}-{2}信息爬取完成，共{3}条。".format(stock["type"], stock["category"], stock["tag"], len(result)))
    return result

# 保存股票信息至本地
def save_stocks():
    all_stocks = _get_all_stocks()
    with open("stock.csv", 'a+') as f:
        f.write("code,name,market,catagory,type\n")
        for stock in all_stocks:
            f.write("{stock[id]},{stock[name]},{stock[category]},{stock[tag]},{stock[type]}\n".format(
                stock=stock
            ))

    print("全部股票信息写入完成！")

def save_db():
    import csv
    from config import client
    with open("stock.csv", 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            client["stock"]["stock"].insert_one(row)

if __name__ == "__main__":
    # save_stocks()
    save_db()


