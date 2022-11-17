# -*- coding: utf-8 -*-

# -*- coding: utf-8 -*-

import base64
import random
import time


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
