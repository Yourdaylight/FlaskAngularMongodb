from urllib import request
from bs4 import BeautifulSoup
from config import client
import json


class Music(object):
    def __init__(self, baseurl):
        head = {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
        }
        self.baseurl = baseurl
        self.headers = head
        self.db = client["crawler"]["music"]

    def main(self):
        req = request.Request(url=self.baseurl, headers=self.headers)
        response = request.urlopen(req)
        html = response.read().decode("utf-8")
        soup = BeautifulSoup(html, "html.parser")
        bs4 = soup.find_all("textarea")
        res = json.loads(str(bs4[0])[56:-11])
        with open("music.json", "w") as f:
            f.write(json.dumps(res, indent=4, ensure_ascii=False))


def read_json_to_db():
    client["crawler"]["music"].drop()
    with open("music.json", "r") as f:
        res = json.load(f)
        for item in res:
            client["crawler"]["music"].insert_one(item)


if __name__ == "__main__":
    baseurl = "https://music.163.com/discover/toplist?id=60198"  # 要爬取的热歌榜链接
    demo0 = Music(baseurl)
    demo0.main()
    read_json_to_db()
