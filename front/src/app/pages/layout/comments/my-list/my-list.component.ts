import {HttpHeaders} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ApiService} from 'src/app/services/api.service';
import {NavigateService} from 'src/app/services/navigate.service';
import {StorageService} from 'src/app/services/storage.service';
import {ActivatedRoute} from '@angular/router'
import {formatDistance} from 'date-fns';
import {NzCommentModule} from 'ng-zorro-antd/comment';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.less']
})
export class MyListComponent implements OnInit {
  _extras: any;
  loading: boolean;
  stockList = [];
  dataList=[];
  cityName: string;
  pageSize = 10;
  pageIndex = 1;
  total = 6753;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private storageService: StorageService,
    private $message: NzMessageService,
    private nzModalService: NzModalService,
    private navigateService: NavigateService,
    private route: ActivatedRoute
  ) {
    const extras = this.router.getCurrentNavigation().extras as any;
    if (extras) {
      this._extras = extras;
    }
    ;
    console.log(extras);
    this.cityName = extras.name;
    this.storageService.setItem('cityName', this.cityName);
  }

  ngOnInit(): void {
  }

  onQueryParamsChange(params: { pageSize: number; pageIndex: number; }) {
    const {pageSize, pageIndex} = params;
    let start = (pageIndex - 1) * pageSize;
    let count = pageSize;
    this.loadWeather()
  }

  loadWeather() {
    this.loading = true;
    let params = {
      page: this.pageIndex,
      limit: this.pageSize
    }
    this.apiService.post("getAllStock", params).subscribe((res: any) => {
      this.loading = false;
      console.log(res);
      const {code, data} = res;
      if (code == 0) {
        this.stockList = res.data.data;
        this.total = res.data.total;
      } else {
        this.stockList = []
        this.total = 0;
      }
    }, () => {
      this.loading = false;
    });
  }

changePageIndex(pageIndex ) {
    this.pageIndex = pageIndex;
    this.loadWeather()
  }
   changePageSize(pageSize) {
    this.pageSize = pageSize;
     this.loadWeather()
  }

  backTo() {
    this.navigateService.navigate('layout/comments');
  }

}
