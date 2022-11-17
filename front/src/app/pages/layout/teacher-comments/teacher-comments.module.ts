import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherCommentsComponent } from './teacher-comments.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { NzListModule } from 'ng-zorro-antd/list';
import { AddCommentComponent } from './add-comment/add-comment.component';


@NgModule({
  declarations: [TeacherCommentsComponent, AddCommentComponent],
  imports: [
    CommonModule,
    SharedModule,
    NzListModule,
    RouterModule.forChild([{
      path: '',
      component: TeacherCommentsComponent
  }]),
  ]
})
export class TeacherCommentsModule { }
