import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { FormatTimePipe } from '../pipe/formatTime.pipe';

@NgModule({
  imports: [],
  declarations: [FormatTimePipe],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzTableModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzModalModule,
    NzCommentModule,
    NzListModule,
    NzAvatarModule,
    NzCardModule,
    NzPaginationModule,
    NzSpinModule,
    NzDropDownModule,
    NzSelectModule,
    NzDescriptionsModule,
    NzEmptyModule,
    FormatTimePipe,
  ],
  providers: [{ provide: NzMessageService }],
})
export class SharedModule {}
