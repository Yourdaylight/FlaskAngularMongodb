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
      _id: data._id,
    };
    this.apiService.post('deleteFavorite', params).subscribe(
      (res: any) => {
        this.getFavoriteList();
      },
      () => {}
    );
  }
  getFavoriteList() {
    this.apiService
      .post('favoriteList', { username: localStorage.getItem('username') })
      .subscribe(
        (res: any) => {
          this.loading = false;
          console.log(res);
          const { code, data } = res;
          if (code == 0) {
            this.favoriteList = data;
            this.favoriteList.forEach((item: any, index: number) => {
              // let artists = item.artists.map((art: any) => art.name);
              // item.artist = artists.join(', ');
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
