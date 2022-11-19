import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyListComponent } from './my-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import {NzDemoCommentListComponent} from './comment.component';
import {NzListModule} from 'ng-zorro-antd/list';
import { NzCommentModule } from 'ng-zorro-antd/comment';
@NgModule({
  declarations: [MyListComponent, NzDemoCommentListComponent],
  imports: [
    CommonModule,
    SharedModule,
    NzListModule,
    NzCommentModule,
    RouterModule.forChild([{
      path: '',
      component: MyListComponent
  }]),
  ]
})
export class MyListModule { }
