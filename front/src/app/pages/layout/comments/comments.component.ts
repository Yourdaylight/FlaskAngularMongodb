import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/services/api.service';
import { NavigateService } from 'src/app/services/navigate.service';
import { StorageService } from 'src/app/services/storage.service';
import { AddSchoolComponent } from './add-school/add-school.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less']
})
export class CommentsComponent implements OnInit {
  siteList = [];
  pageSize = 10;
  pageIndex = 1;
  total = 1;
  loading: boolean;
  region: string = '';
  temp_now: number;
  dayhour: string;
  role:number;
  name: any;
  start_score: string;
  end_score: string;
  constructor(
    private nzModalService: NzModalService,
    private apiService: ApiService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private $message: NzMessageService,
    private navigateService: NavigateService
  ) {
    const storageRole = this.storageService.getItem('role') || '';
    if(storageRole) {
      this.role =  parseInt(storageRole) || 2
    }

  }

  ngOnInit(): void {
    // /instructor/list   get   获取辅导员列表。请求头带token
    // /comment/list  get 获取评论列表。（如果是学生要带上辅导员id。 ?id=   辅导员的话就不用带） 请求头要带token

  }
  onQueryParamsChange(params: { pageSize: number; pageIndex: number; }) {
    const { pageSize, pageIndex } = params;
    let start = (pageIndex - 1) * pageSize;
    let count = pageSize;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.loadWeather()
  }
  loadWeather(url?) {
    this.loading = true;
    url = "cityList"
    let params = {
      username: this.storageService.getItem('username'),
      region: this.region,
      temp_now: this.temp_now,
    }
    this.apiService.post(url, params).subscribe((res: any) => {
      this.loading = false;
      const { code, data } = res;
      if (data && Array.isArray(res.data)) {
        this.siteList = res.data;
        this.total = res.total;
      } else {
        this.siteList = []
        this.total = 0;
      }
    }, () => { this.loading = false; });
  }


  clearField() {
    this.name = '';
    this.start_score = null;
    this.end_score = null;
    this.loadWeather();
  }
  addUser() {
    let title = 'Add a city';
    const modal = this.nzModalService.create({
      nzTitle: this.translateService.instant(title),
      nzContent: AddSchoolComponent,
      nzFooter: null,
      nzWidth: '60%',
    })
    modal.afterClose.subscribe(res => {
      if (res) {
        this.loadWeather();
      }
    })
  }
  toDelete(item) {
    item["username"] = this.storageService.getItem('username');
    this.apiService.post('removeCity', item).subscribe((res: any) => {
      console.log(res);
      const { code, msg } = res;
      if (code === 0) {
        this.$message.success('Succee delete！')
        this.loadWeather()
      } else {
        this.$message.error(msg)
      }
    });
  }
  toDetail(data?) {
    this.navigateService.navigate('layout/myList',data);
  }
  toAdd(data) {
    this.apiService.post('addIntention', { sid: data.id }).subscribe((res: any) => {
      console.log(res);
      const { code, msg } = res;
      if (code === 0) {
        this.$message.success('添加意向成功！')
        this.loadWeather()
      } else {
        this.$message.error(msg)
      }
    });
  }
}
