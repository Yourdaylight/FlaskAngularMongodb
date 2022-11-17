import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.less']
})
export class AddCommentComponent implements OnInit {
  
  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private $message: NzMessageService,
    private nzModalService:NzModalService
  ) { }

  ngOnInit(): void {
 
  }
  
}
