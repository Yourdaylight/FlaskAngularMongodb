import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { DebounceClickDirective } from './debounce-click.directive';


@NgModule({
  declarations: [DebounceClickDirective], //sharedModule里面的declarations，也需要export出去
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NzIconModule,
    NzTabsModule,
    TranslateModule,
    NzTableModule,
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    FormsModule,
    NzFormModule,
    ReactiveFormsModule, 
    NzGridModule,
    NzRadioModule,
    NzSpinModule,
    NzSwitchModule,
    DebounceClickDirective
  ]
})
export class SharedModule { }
