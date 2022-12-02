import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { MusicDetailsComponent } from './music-details/music-details.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadChildren: () =>
          import('./list/list.module').then((m) => m.ListModule),
      },
      {
        path: 'music-details',
        loadChildren: () =>
          import('./music-details/music-details.module').then(
            (m) => m.MusicDetailsModule
          ),
      },
      {
        path: 'favorite',
        loadChildren: () =>
          import('./favorite/favorite.module').then((m) => m.FavoriteModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
