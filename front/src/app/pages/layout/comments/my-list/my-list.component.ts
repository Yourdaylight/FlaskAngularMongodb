import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/services/api.service';
import { NavigateService } from 'src/app/services/navigate.service';
import { StorageService } from 'src/app/services/storage.service';
import {ActivatedRoute} from '@angular/router'
@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.less']
})
export class MyListComponent implements OnInit {
  _extras: any;
  loading: boolean;
  weatherList = [];
  cityName: string;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private storageService: StorageService,
    private $message: NzMessageService,
    private nzModalService:NzModalService,
    private navigateService: NavigateService,
    private route:ActivatedRoute
  ) {
    const extras = this.router.getCurrentNavigation().extras as any;
    if (extras) {
      this._extras = extras;
    };
    console.log(extras);
    this.cityName = extras.name;
   }

  ngOnInit(): void {
  }
  onQueryParamsChange(params: { pageSize: number; pageIndex: number; }) {
    const { pageSize, pageIndex } = params;
    let start = (pageIndex - 1) * pageSize;
    let count = pageSize;
    this.loadWeather()
  }
  loadWeather() {
    this.loading = true;
    this.apiService.post("cityWeather", {city:this.cityName ? this.cityName:"beijing"}).subscribe((res: any) => {
      this.loading = false;
      console.log(res);
      const { code, data } = res;
      if (code==0) {
        this.weatherList = res.data.next_days;
      } else {
        this.weatherList = []
      }
    }, () => { this.loading = false; });
  }
  backTo(){
    this.navigateService.navigate('layout/comments');
  }

}
