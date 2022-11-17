import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'comments' },
      {
        path: 'comments',
        loadChildren: () => import('./comments/comments.module').then(m => m.CommentsModule),
        data: {
          breadcrumbI18nKey: '学校列表'
        }
      },
      {
        path: 'teacher',
        loadChildren: () => import('./teacher-comments/teacher-comments.module').then(m => m.TeacherCommentsModule),
        data: {
          breadcrumbI18nKey: '我的列表'
        }
      },
      {
        path: 'myList',
        loadChildren: () => import('../layout/comments/my-list/my-list.module').then(m => m.MyListModule),
        data: {
          breadcrumbI18nKey: '意向列表'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
