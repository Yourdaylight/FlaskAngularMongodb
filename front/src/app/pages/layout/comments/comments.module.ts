import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './comments.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { AddSchoolComponent } from './add-school/add-school.component';
import { NzListModule } from 'ng-zorro-antd/list';


@NgModule({
  declarations: [CommentsComponent, AddSchoolComponent],
  imports: [
    CommonModule,
    SharedModule,
    NzListModule,
    RouterModule.forChild([{
      path: '',
      component: CommentsComponent
  }]),
  ]
})
export class CommentsModule { }
