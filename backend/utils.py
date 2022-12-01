# -*- coding: utf-8 -*-

import base64
import os.path
import random
import time
import requests
from config import client
import datetime
import csv


def get_data(username, code, start=None, end=None):
    '''
    获取指定时间范围的股票数据
    :param code: 指数代码
    :param start: 起始日期
    :param end: 截止日期
    :return: DataFrame
    '''
    # 默认获取最近一年的数据
    if start is None:
        start = get_date(365)
    if end is None:
        end = get_date(0)
    url = 'http://quotes.money.163.com/service/chddata.html?code=0{}&start={}&end={}&fields=TCLOSE;HIGH;LOW;TOPEN;LCLOSE;CHG;PCHG;VOTURNOVER;VATURNOVER'.format(
        code, start, end)
    res = requests.get(url).content
    hour = datetime.datetime.now().hour
    # 给获取的数据命名，精确到时间
    name = './output/' + code + '_' + start + "-" + end + "-" + str(hour) + '.csv'
    #　存在数据就不爬取，直接跳过
    if os.path.exists(name):
        return
    with open(name, 'wb') as f:
        f.write(res)
    with open(name, 'r', encoding="gbk") as f:
        reader = csv.DictReader(f)
        for row in reader:
            data = {
                'username': username,
                'code': row['股票代码'][1:],
                'date': row['日期'],
                'open': row['开盘价'],
                'close': row['收盘价'],
                'high': row['最高价'],
                'low': row['最低价'],
                'volume': row['成交量'],
                'amount': row['成交金额'],
                'change': row['涨跌额'],
                'p_change': row['涨跌幅']}
            client["stock"]["data"].insert_one(data)


def get_date(beforeday):
    today = datetime.datetime.now()
    todaystr = str(today).split(".")[0]  # 这是当前时间
    offset = datetime.timedelta(days=-beforeday)
    offset = today + offset
    month = str(offset.month) if offset.month > 9 else "0" + str(offset.month)
    day = str(offset.day) if offset.day > 9 else "0" + str(offset.day)
    re_date = str(offset.year) + month + day
    return re_date


def get_stocks():
    page = 1
    limit = 10
    stock_list = client["stock"]['stock'].find({"catagory": "上证A股"}).skip((page - 1) * limit).limit(limit)
    for i in stock_list:
        print(i)


def get_token(user_id):
    # 根据用户手机、随机数、时间2小时过期 生成token
    token = base64.b64encode(
        (".".join([str(user_id), str(random.random()), str(time.time() + 7200)])).encode()).decode()
    return token


def verify_token(token):
    _token = base64.b64decode(token)
    _token = _token.decode()
    timestr = _token.split(".")[2]  # 过期时间
    user_id = _token.split(".")[0]
    if float(timestr) > time.time():  # 判断传入的token中时间时候大于当前时间，是则在有效期内
        # token已过期
        return True, user_id
    else:
        # token已过期
        return False, user_id


if __name__ == '__main__':
    now = datetime.datetime.now()
    month = str(now.month) if now.month > 9 else "0" + str(now.month)
    day = str(now.day) if now.day > 9 else "0" + str(now.day)
    end = str(now.year) + month + day
    # get_stocks()
    get_data("688326")
    print(get_date(7))
