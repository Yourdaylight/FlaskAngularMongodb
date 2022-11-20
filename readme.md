# 网易云音乐数据爬取web展示
# 一、项目启动
### 1.1、前端启动
见front文件夹下的readme.md
### 1.2、后端启动
`python backend/app.py`


# 二、通用接口（登录/注册/评论内容三个模块通用）
## 1 登录、注册
### 1.1 登录
post /login
#### 参数
| 参数名       | 类型 | 说明 |
|:----------| :--- | :--- |
|  username | string | 用户名|
|  password | string | 密码|

#### 返回值
| 参数名       | 类型 | 说明          |
|:----------| :--- |:------------|
|  code | int | 状态码,0成功1失败. |
|  msg | string | 提示信息        |
|  data | object | 返回数据        |

### 1.2 注册
post /register
#### 参数
| 参数名       | 类型 | 说明 |
|:----------| :--- | :--- |
|  username | string | 用户名|
|  password | string | 密码|

#### 返回值
| 参数名       | 类型 | 说明          |
|:----------| :--- |:------------|
|  code | int | 状态码,0成功1失败. |
|  msg | string | 提示信息        |
|  data | object | 返回数据        |

## 2 评论内容
### 2.1 获取评论内容
post /getComments
#### 参数
| 参数名  | 类型 | 说明 |
|:-----| :-- | :--- |
| name | string | 详情项的名称；如天气数据的这里就是城市名称|
| username | string | 用户名|

#### 返回值
| 参数名       | 类型 | 说明          |
|:----------| :--- |:------------|
|  code | int | 状态码,0成功1失败. |
|  msg | string | 提示信息        |
|  data | object | 返回数据        |

### 2.2 添加评论内容
post /addComment
#### 参数
| 参数名  | 类型     | 说明                    |
|:-----|:-------|:----------------------|
| name | string | 详情项的名称；如天气数据的这里就是城市名称 |
| username | string | 用户名                   |
| coment | string | 评论内容                  |

#### 返回值
| 参数名       | 类型 | 说明          |
|:----------| :--- |:------------|
|  code | int | 状态码,0成功1失败. |
|  msg | string | 提示信息        |

### 2.3 删除评论内容
post /removeComment
#### 参数
| 参数名  | 类型     | 说明                    |
|:-----|:-------|:----------------------|
| name | string | 详情项的名称；如天气数据的这里就是城市名称 |
| username | string | 用户名                   |
| coment | string | 评论内容                  |

#### 返回值
| 参数名       | 类型 | 说明          |
|:----------| :--- |:------------|
|  code | int | 状态码,0成功1失败. |
|  msg | string | 提示信息        |

## 3 网易云音乐数据
### 3.1 获取歌单数据
get /musicList


#### 返回值
爬取的数据是网易云音乐美国Billboard榜
https://music.163.com/#/discover/toplist?id=60198

| 参数名       | 类型 | 说明          |
|:----------| :--- |:------------|
|  code | int | 状态码,0成功1失败. |
|  msg | string | 提示信息        |
|  data | object | 返回数据        |
单条数据样例
歌曲名称 name
歌手 artist[0].name
歌曲时长 duration
歌曲封面 album.picUrl
专辑名称 album.name
歌曲评分 score
应该主要就上述数据，具体可以对比一下界面上的数据
```json
        {
            "_id": "63796ac2dc2ae928b33a8504",
            "duration": 200690,
            "status": 0,
            "type": 0,
            "ftype": 0,
            "score": 100.0,
            "copyrightId": 7003,
            "mvid": 14572194,
            "transNames": null,
            "no": 3,
            "commentThreadId": "R_SO_4_1990192694",
            "publishTime": 0,
            "album": {
                "id": 153345099,
                "name": "Midnights (3am Edition)",
                "picUrl": "http://p4.music.126.net/PIJYDxirhadM3xpHn6yMmQ==/109951168069972335.jpg",
                "tns": [],
                "pic_str": "109951168069972335",
                "pic": 109951168069972335
            },
            "artists": [
                {
                    "id": 44266,
                    "name": "Taylor Swift",
                    "tns": [],
                    "alias": []
                }
            ],
            "alias": [],
            "privilege": {
                "flag": 257,
                "dlLevel": "none",
                "subp": 0,
                "fl": 0,
                "fee": 4,
                "dl": 0,
                "plLevel": "none",
                "paidBigBang": false,
                "maxBrLevel": "lossless",
                "maxbr": 999000,
                "id": 1990192694,
                "sp": 0,
                "payed": 0,
                "rscl": null,
                "st": 0,
                "realPayed": 0,
                "chargeInfoList": [
                    {
                        "rate": 128000,
                        "chargeUrl": null,
                        "chargeMessage": null,
                        "chargeType": 3
                    },
                    {
                        "rate": 192000,
                        "chargeUrl": null,
                        "chargeMessage": null,
                        "chargeType": 3
                    },
                    {
                        "rate": 320000,
                        "chargeUrl": null,
                        "chargeMessage": null,
                        "chargeType": 3
                    },
                    {
                        "rate": 999000,
                        "chargeUrl": null,
                        "chargeMessage": null,
                        "chargeType": 3
                    }
                ],
                "freeTrialPrivilege": {
                    "resConsumable": false,
                    "userConsumable": false,
                    "listenType": null
                },
                "downloadMaxbr": 0,
                "downloadMaxBrLevel": "none",
                "cp": 1,
                "preSell": false,
                "playMaxBrLevel": "none",
                "cs": false,
                "toast": false,
                "playMaxbr": 0,
                "pc": null,
                "flLevel": "none",
                "pl": 0
            },
            "djid": 0,
            "fee": 4,
            "name": "Anti-Hero",
            "id": 1990192694,
            "lastRank": 0
        }
```
