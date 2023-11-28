import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { GameDetailsComponent } from './game-details/game-details.component';
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
        path: 'game-details',
        loadChildren: () =>
          import('./game-details/game-details.module').then(
            (m) => m.GameDetailsModule
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
