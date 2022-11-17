import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [LoginComponent, ],
  imports: [
    CommonModule,
    SharedModule,
    NzCheckboxModule,
    RouterModule.forChild([{
      path: '',
      component: LoginComponent
  }]),
  ]
})
export class LoginModule { }
