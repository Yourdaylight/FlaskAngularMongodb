import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { AddCommentComponent } from './add-comment/add-comment.component';

@Component({
  selector: 'app-teacher-comments',
  templateUrl: './teacher-comments.component.html',
  styleUrls: ['./teacher-comments.component.less']
})
export class TeacherCommentsComponent implements OnInit {
  _id: any;
  loading: boolean;
  role: string;
  commentList = []
  total: number;
  title: string;
  isVisible: boolean;
  content = ''
  parentId: any;
  _username: string;
  constructor(private router: Router,
    private apiService: ApiService,
    private storageService: StorageService,
    private $message: NzMessageService,
    private nzModalService:NzModalService
  ) {
    const extras = this.router.getCurrentNavigation().extras as any;
    console.log(extras);
    
    if (extras) {
      this._id = extras.id;
      this._username = extras.username;
    };
  }

  ngOnInit(): void {
    this.role = this.storageService.getItem('role');
    this.getCommentList()
  }
  getCommentList() {
    this.loading = true;
    let url = parseInt(this.role) === 2 ? `comment/list?id=${this._id}` : `comment/list`
    this.apiService.get(url, { headers: new HttpHeaders().set('token', this.storageService.getItem('token')) }).subscribe((res: any) => {
      this.loading = false;
      console.log(res);
      const { msg, code, data } = res;
      if (code === 0 && data && Array.isArray(data)) {
        this.commentList = data;
        this.total = data?.length;
        this.$message.success('列表获取成功')
      } else {
        this.$message.error(msg)
        this.commentList = []
        this.total = 0;
      }
    }, () => { this.loading = false; });
  }
  // comment/create   post.  创建评论 回复评论 
  // {"instructor":辅导员id, "content":内容 "parent":回复的评论id}
  goApply(item?) {
    this.title = '添加评论';
    this.isVisible = true;
    this.parentId = item?.id || '';
  }
  handleCancel(){
    this.isVisible = false;
  }
  handleOk(){
    let params = {
      instructor:this._id,
      content:this.content,
      parent:this.parentId || null
    }
    this.apiService.post('comment/create', params).subscribe((res: any) => {
      console.log(res);
      const { msg, code} = res;
      if (code === 0) {
       this.$message.success('评论成功！');
       this.getCommentList();
      } else {
        this.$message.success(msg)
      }
    },()=>{},()=>{this.isVisible = false});
  }
  addFirst(){
    this.parentId = null;
    this.isVisible = false;
  } 
  
}
