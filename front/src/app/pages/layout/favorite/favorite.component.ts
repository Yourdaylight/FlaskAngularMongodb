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
  isCollect: boolean = false;
  constructor(
    private apiService: ApiService,
    private $message: NzMessageService,
    private navigateService: NavigateService
  ) {}

  ngOnInit() {
    this.getfavoriteList();
  }
  onCollect(data: any) {
    this.isCollect = !this.isCollect;
    let url = this.isCollect ? 'deleteCollect' : 'collect';
    let params = {
      username: localStorage.getItem('username'),
      name: data.name,
    };
    this.apiService.post(url, params).subscribe(
      (res: any) => {},
      () => {}
    );
  }
  getfavoriteList() {
    this.apiService
      .post('collectList', { username: localStorage.getItem('username') })
      .subscribe(
        (res: any) => {
          this.loading = false;
          console.log(res);
          const { code, data } = res;
          if (code == 0) {
            this.favoriteList = data;
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
