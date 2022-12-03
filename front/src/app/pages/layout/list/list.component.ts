import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NavigateService } from 'src/app/services/navigate.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  searchValue: string = '';
  musicList: any = [];
  loading: boolean = true;
  isCollect: boolean = false;
  constructor(
    private apiService: ApiService,
    private $message: NzMessageService,
    private navigateService: NavigateService,
    public router: Router
  ) {}

  ngOnInit() {
    this.getMusicList();
  }
  onSearch() {
    this.musicList = this.musicList.filter(
      (item: any) => item.name == this.searchValue
    );
  }
  onCollect(data: any) {
    this.getCollectList();
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
  toDetail(data: any) {
    this.router.navigate(['/layout/music-details'], {
      queryParams: {
        name: data.name,
        artist: data.artist,
        albumPicUrl: data.album.picUrl,
        albumName: data.album.name,
        duration: data.duration,
      },
    });
  }
  getCollectList() {
    this.apiService
      .post('collectList', { username: localStorage.getItem('username') })
      .subscribe(
        (res: any) => {},
        () => {}
      );
  }
  getMusicList() {
    this.apiService.post('musicList', {}).subscribe(
      (res: any) => {
        this.loading = false;
        console.log(res);
        const { code, data } = res;
        if (code == 0) {
          this.musicList = data;
          this.musicList.forEach((item: any, index: number) => {
            let artists = item.artists.map((art: any) => art.name);
            item.artist = artists.join(', ');
            item.idx = index;
          });
        } else {
          this.musicList = [];
        }
      },
      () => {
        this.loading = false;
      }
    );
  }
}
