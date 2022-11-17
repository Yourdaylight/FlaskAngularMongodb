import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/services/api.service';
import { NavigateService } from 'src/app/services/navigate.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.less']
})
export class MyListComponent implements OnInit {
  _extras: any;
  loading: boolean;
  schoolList = [];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private storageService: StorageService,
    private $message: NzMessageService,
    private nzModalService:NzModalService,
    private navigateService: NavigateService
  ) {
    const extras = this.router.getCurrentNavigation().extras as any;
    if (extras) {
      this._extras = extras;
    };
    console.log(extras);
    
   }

  ngOnInit(): void {
    
    
  }
  onQueryParamsChange(params: { pageSize: number; pageIndex: number; }) {
    const { pageSize, pageIndex } = params;
    let start = (pageIndex - 1) * pageSize;
    let count = pageSize;
    this.loadSchool()
  }
  loadSchool(url?) {
    this.loading = true;
    url = url ? url : `/intentionList`
    this.apiService.get(url, { headers: new HttpHeaders().set('token', this.storageService.getItem('token')) }).subscribe((res: any) => {
      this.loading = false;
      console.log(res);
      const { code, data } = res;
      if (data && Array.isArray(res.data)) {
        this.schoolList = res.data;
       
      } else {
        this.schoolList = []
       
      }
    }, () => { this.loading = false; });
  }
  toDelete(data){
    this.apiService.post('delIntention', { id: data.id }).subscribe((res: any) => {
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
  backTo(){
    this.navigateService.navigate('layout/comments');
  }

}
