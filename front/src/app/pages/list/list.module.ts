import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ListComponent } from './list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListComponent,
      },
    ]),
  ],
  declarations: [ListComponent],
  exports: [ListComponent],
})
export class ListModule {}
