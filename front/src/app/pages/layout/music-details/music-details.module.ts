import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { MusicDetailsComponent } from './music-details.component';
import {FormatTimePipe} from "../../../pipe/formatTime.pipe";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: MusicDetailsComponent,
      },
    ]),
  ],
  declarations: [MusicDetailsComponent,FormatTimePipe],
  exports: [MusicDetailsComponent],
})
export class MusicDetailsModule {}
