import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { FavoriteComponent } from './favorite.component';
import {FormatTimePipe} from "../../../pipe/formatTime.pipe";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: FavoriteComponent,
      },
    ]),
  ],
  declarations: [FavoriteComponent,FormatTimePipe],
  exports: [FavoriteComponent],
})
export class FavoriteModule {}
