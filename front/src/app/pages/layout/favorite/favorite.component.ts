import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NavigateService } from 'src/app/services/navigate.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit {
  favoriteList: any = [];
  loading: boolean = true;
  constructor(
    private apiService: ApiService,
    private $message: NzMessageService,
    private navigateService: NavigateService
  ) {}

  ngOnInit() {
    this.getFavoriteList();
  }
  deleteCollect(data: any) {
    let params = {
      username: localStorage.getItem('username'),
      gameId: data._id,
    };
    this.apiService.post('/games/cancelCollectGame', params).subscribe(
      (res: any) => {
        this.getFavoriteList();
        this.$message.success('已取消收藏');
      },
      () => {}
    );
  }
  getFavoriteList() {
    this.apiService
      .post('/game/getCollectList', { username: localStorage.getItem('username') })
      .subscribe(
        (res: any) => {
          console.log(res);
          const { code, data } = res;
          if (code == 200) {
            this.loading = false;
            this.favoriteList = data;
            this.favoriteList.forEach((item: any, index: number) => {
              item.idx = index;
            });
          } else {
            this.favoriteList = [];
          }
        },
        () => {
          this.loading = false;
        }
      );
  }
}
