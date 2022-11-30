import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/services/api.service';
import { NavigateService } from 'src/app/services/navigate.service';
import { StorageService } from 'src/app/services/storage.service';
import { AddStockComponent } from './add-stock/add-stock.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less']
})
export class CommentsComponent implements OnInit {
  siteList = [];
  pageSize = 10;
  pageIndex = 1;
  total = 0;
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
  }
  onQueryParamsChange(params: { pageSize: number; pageIndex: number; }) {
    const { pageSize, pageIndex } = params;
    let start = (pageIndex - 1) * pageSize;
    let count = pageSize;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.getUserStockList()
  }
  getUserStockList(url?) {
    this.loading = true;
    url = url ? url : `userStockList`
    let params = {
      username: this.storageService.getItem('username'),
    }
    this.apiService.post(url, params).subscribe((res: any) => {
      this.loading = false;
      const { code, data } = res;
      if (code==0 && data && Array.isArray(res.data)) {
        this.siteList = res.data;
        this.total = res.total;
      } else {
        this.siteList = []
        this.total = 0;
      }
    }, () => { this.loading = false; });
  }

  searchUser() {
    let url = `schoolList?name=${this.name}&start_score=${this.start_score || ''}&end_score=${this.end_score || ''}`
    this.getUserStockList(url);
  }
  clearField() {
    this.name = '';
    this.start_score = null;
    this.end_score = null;
    this.getUserStockList();
  }
  addUser() {
    let title = 'Add a city';
    const modal = this.nzModalService.create({
      nzTitle: this.translateService.instant(title),
      nzContent: AddStockComponent,
      nzFooter: null,
      nzWidth: '60%',
    })
    modal.afterClose.subscribe(res => {
      if (res) {
        this.getUserStockList();
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
        this.getUserStockList()
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
        this.getUserStockList()
      } else {
        this.$message.error(msg)
      }
    });
  }
}
