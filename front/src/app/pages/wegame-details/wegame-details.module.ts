import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MovieDetailsComponent } from './wegame-details.component';
// import {FormatTimePipe} from "../../../pipe/formatTime.pipe";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: MovieDetailsComponent,
      },
    ]),
  ],
  declarations: [MovieDetailsComponent],
  exports: [MovieDetailsComponent],
})
export class MovieDetailsModule {}
