import {HttpHeaders} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ApiService} from 'src/app/services/api.service';
import {NavigateService} from 'src/app/services/navigate.service';
import {StorageService} from 'src/app/services/storage.service';
import {AddStockComponent} from './add-stock/add-stock.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less']
})
export class CommentsComponent implements OnInit {
  loading: boolean;
  role: number = 2;
  code: string = '';
  name: string;
  start_score: string;
  end_score: string;
  graph:boolean = false;
  options: any = {
    title:{
      text: "Price of Stock in Recent One Year",
    },
    tooltip: {
      show: true
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [],
        type: 'line',
        smooth: true
      }
    ]
  }
  siteList = [];
  pageSize = 10;
  pageIndex = 1;
  total = 0;
  echartsIntance: any;

  constructor(
    private nzModalService: NzModalService,
    private apiService: ApiService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private $message: NzMessageService,
    private navigateService: NavigateService,
  ) {
    const storageRole = this.storageService.getItem('role') || '';
    if (storageRole) {
      this.role = parseInt(storageRole) || 2
    }

  }

  ngOnInit(): void {
  }

  onQueryParamsChange(params: { pageSize: number; pageIndex: number; }) {
    const {pageSize, pageIndex} = params;
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
      const {code, data} = res;
      if (code == 0 && data && Array.isArray(res.data)) {
        this.siteList = res.data;
        this.total = res.total;
      } else {
        this.siteList = []
        this.total = 0;
      }
    }, () => {
      this.loading = false;
    });
  }

  styleMethod(data) {
    if (data.recent_data.color === "green") {
      return {fall: true}
    }
    if (data.recent_data.color === "red") {
      return {rise: true}
    }
  }

  updateData() {
    let params = {
      username: this.storageService.getItem('username'),
    }
    this.apiService.post("updateStockData", params).subscribe((res: any) => {
      this.loading = false;
      const {code, data} = res;
      if (code == 0 && data && Array.isArray(res.data)) {
        this.$message.success(res.msg)
        this.getUserStockList()
      } else {
        this.$message.error(res.msg)
      }
    }, () => {
      this.loading = false;
    });
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
    let title = 'Add a Stock';
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

  onChartInit(ec) {
    this.echartsIntance = ec;
  }

  plotStock(code) {
    let params = {
      code: code,
      username: this.storageService.getItem('username'),
    }
    this.apiService.post("plotStock", params).subscribe((res: any) => {
      if (res.code == 0) {
        this.options.xAxis.data = res.data.date
        this.options.series[0].data = res.data.close
        this.options.title.text = `Price of Stock ${code} in Recent One Year`
        this.$message.success(res.msg)
        this.graph = true;
        this.echartsIntance.setOption(this.options); //手动重新渲染echart

      } else {
        this.$message.error(res.msg);
      }
    }, () => {
    });
  }

  toDelete(item) {
    item["username"] = this.storageService.getItem('username');
    this.apiService.post('removeStock', item).subscribe((res: any) => {
      console.log(res);
      const {code, msg} = res;
      if (code === 0) {
        this.$message.success('Succee delete！')
        this.getUserStockList()
      } else {
        this.$message.error(msg)
      }
    });
  }

  toDetail(data?) {
    this.navigateService.navigate('layout/myList', data);
  }

}
