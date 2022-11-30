# -*- coding: utf-8 -*-

import base64
import random
import time
import requests
from config import client
import datetime
import csv
def get_data(code,start,end):
    '''
    获取指定时间范围的股票数据
    :param code: 指数代码
    :param start: 起始日期
    :param end: 截止日期
    :return: DataFrame
    '''
    url='http://quotes.money.163.com/service/chddata.html?code={}&start={}&end={}&fields=TCLOSE;HIGH;LOW;TOPEN;LCLOSE;CHG;PCHG;VOTURNOVER;VATURNOVER'.format(code,start,end)
    name=code+'_'+start+"-"+end
    res = requests.get(url).content
    rtn = csv.DictReader(res)
    print(rtn)
    return res

def get_stocks():
        page =1
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
    end_time = f"{now.year}{now.month}{now.day}"
    get_data("688326","20220102",end_time)
