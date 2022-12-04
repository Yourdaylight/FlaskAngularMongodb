# PS5游戏兼容数据爬取web展示
数据来源地址：https://bbs.a9vg.com/thread-8705407-1-1.html     
数据已经爬取到本地，可以直接使用     
数据库连接用内网穿透的，在config.py中修改连接地址
# 一、项目启动
### 1.1、前端启动
见front文件夹下的readme.md
### 1.2、后端启动
`python backend/app.py`


# 二、通用接口（登录/注册）
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

## 3、其他接口文档
- 全部功能包括   
1、登陆/注册   
2、首页展示游戏信息,需分页(可以参考数据来源地址的页面)，首页搜索功能（一个搜索框即可）   
3、首页列表项的增删改查   
4、详情信息中评论添加/删除   
- 完整接口文档见postman导出文件`fullStack.postman_collection.json`   
