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
          breadcrumbI18nKey: 'Favorite Stock'
        }
      },

      {
        path: 'myList',
        loadChildren: () => import('../layout/comments/my-list/my-list.module').then(m => m.MyListModule),
        data: {
          breadcrumbI18nKey: 'Stock List'
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
