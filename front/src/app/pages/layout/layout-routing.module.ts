import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadChildren: () =>
          import('../list/list.module').then((m) => m.ListModule),
      },
      {
        path: 'wegame-details',
        loadChildren: () =>
          import('../wegame-details/wegame-details.module').then(
            (m) => m.MovieDetailsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
