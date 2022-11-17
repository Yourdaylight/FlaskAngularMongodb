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
    this.loadSchool()
  }
  loadSchool(url?) {
    this.loading = true;
    url = url ? url : `schoolList`
    this.apiService.get(url, { headers: new HttpHeaders().set('token', this.storageService.getItem('token')) }).subscribe((res: any) => {
      this.loading = false;
      console.log(res);
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
  toTeacher(data) {
    this.navigateService.navigate('layout/teacher', data);
  }
  searchUser() {
    let url = `schoolList?name=${this.name}&start_score=${this.start_score || ''}&end_score=${this.end_score || ''}`
    this.loadSchool(url);
  }
  clearField() {
    this.name = '';
    this.start_score = null;
    this.end_score = null;
    this.loadSchool();
  }
  addUser() {
    let title = '添加学校';
    const modal = this.nzModalService.create({
      nzTitle: this.translateService.instant(title),
      nzContent: AddSchoolComponent,
      nzFooter: null,
      nzWidth: '60%',
    })
    modal.afterClose.subscribe(res => {
      if (res) {
        this.loadSchool();
      }
    })
  }
  toDelete(item) {
    this.apiService.post('removeSchool', { id: item.id }).subscribe((res: any) => {
      console.log(res);
      const { code, msg } = res;
      if (code === 0) {
        this.$message.success('删除成功！')
        this.loadSchool()
      } else {
        this.$message.error(msg)
      }
    });
  }
  toDetail(data?) {
    // addIntention  post 添加意向学校
    //{"sid":学校id}

    //intentionList  get 获取意向学校列表

    //delIntention post 删除意向学校
    this.navigateService.navigate('layout/myList',data);
    return
    this.apiService.post('removeSchool', { sid: data.id }).subscribe((res: any) => {
      console.log(res);
      const { code, msg } = res;
      if (code === 0) {
        this.$message.success('删除成功！')
        this.loadSchool()
      } else {
        this.$message.error(msg)
      }
    });
  }
  toAdd(data) {
    this.apiService.post('addIntention', { sid: data.id }).subscribe((res: any) => {
      console.log(res);
      const { code, msg } = res;
      if (code === 0) {
        this.$message.success('添加意向成功！')
        this.loadSchool()
      } else {
        this.$message.error(msg)
      }
    });
  }
}
