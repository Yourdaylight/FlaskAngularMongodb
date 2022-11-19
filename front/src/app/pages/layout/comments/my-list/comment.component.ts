import {Component, OnInit} from '@angular/core';
import {addDays, formatDistance} from 'date-fns';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzCommentModule} from 'ng-zorro-antd/comment';
import {ApiService} from 'src/app/services/api.service';
import {StorageService} from 'src/app/services/storage.service';
import {NavigateService} from "../../../../services/navigate.service";
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nz-demo-comment-list',
  template: `
    <h2>Comments</h2>
    <input name="name" [(ngModel)]="userComment" nz-input type="text"/>
    <button style="margin-top: 10px" nz-button nzType="default" (click)="addComment()">
      <i nz-icon nzType="plus" nzTheme="outline"></i>Add Comment
    </button>
    <nz-list [nzDataSource]="data" [nzRenderItem]="item" [nzItemLayout]="'horizontal'">
      <ng-template #item let-item>
        <nz-comment [nzAuthor]="item.username" [nzDatetime]="item.update_time">
          <!--          <nz-avatar nz-comment-avatar nzIcon="user" nzSrc="//zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"></nz-avatar>-->
          <nz-comment-content>
            <p>
               {{ item.comment }}
            </p>
          </nz-comment-content>
          <nz-comment-action><i nz-icon nzType="delete" nzTheme="outline" (click)="removeComment(item)"></i></nz-comment-action>
        </nz-comment>
      </ng-template>
    </nz-list>
  `,
  styles: [
    `
      .count {
        padding-left: 8px;
        cursor: auto;
      }
    `
  ]
})
export class NzDemoCommentListComponent implements OnInit {
  likes = 0;
  dislikes = 0;
  userComment: string;
  actions: string[] = ['Like', 'Dislike'];
  data = [];

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private navigateService: NavigateService,
    private $message: NzMessageService,
  ) {
    this.loadComment()
  }

  ngOnInit(): void {

  }

  loadComment() {
    this.apiService.post("getComments", {
      city: this.storageService.getItem("cityName"),
      username: this.storageService.getItem("username")
    }).subscribe((res: any) => {
      console.log(res);
      const {code, data} = res;
      if (code == 0) {
        this.data = res.data;
      } else {
        this.data = []
      }
    });
  }

  addComment() {
    this.apiService.post("addComment", {
      city: this.storageService.getItem("cityName"),
      comment: this.userComment,
      username: this.storageService.getItem('username')
    }).subscribe((res: any) => {
      console.log(res);
      const {code, data} = res;
      if (code == 0) {
        this.$message.success("Comment added successfully");
        this.loadComment()
      } else {
        this.$message.error("Comment added failed");
      }
    }, () => {

    });
  }

  removeComment(item) {
    this.apiService.post("removeComment", {
      city: this.storageService.getItem("cityName"),
      comment: item.comment,
      username: this.storageService.getItem("username")
    }).subscribe((res: any) => {
      console.log(res);
      const {code, data} = res;
      if (code == 0) {
        this.loadComment()
      }
    });
  }

}
