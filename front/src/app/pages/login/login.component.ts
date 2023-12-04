import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NavigateService } from 'src/app/services/navigate.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  curStatus: string = 'Login';
  validateForm!: UntypedFormGroup;

  changeLogin() {
    if (this.curStatus == 'Login') this.curStatus = 'Register';
    else this.curStatus = 'Login';
    this.validateForm.reset();
  }

  submitForm(type: string): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      let loginModel = Object.assign(this.validateForm.value, {});
      let url = type == 'login' ? 'login' : 'register';
      console.log(url);
      this.apiService.post(url, loginModel).subscribe((res: any) => {
        const { code, msg, data } = res;
        if (code === 200) {
          if (type == 'login') {
            this.$message.success('Login Success!');
            localStorage.setItem('username', loginModel.username);
            localStorage.setItem('token', data?.token);
            localStorage.setItem('role', data?.role);
            setTimeout(() => {
              this.navigateService.navigate('layout');
            }, 200);
          } else {
            this.$message.success('Regist success！');
            setTimeout(() => {
              this.curStatus = 'Login';
            }, 200);
          }
        } else {
          this.$message.error(msg);
        }
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control: any) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  constructor(
    private fb: UntypedFormBuilder,
    private apiService: ApiService,
    private $message: NzMessageService,
    private navigateService: NavigateService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }
}
