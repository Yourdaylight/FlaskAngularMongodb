import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from 'src/app/services/api.service';
import { NavigateService } from 'src/app/services/navigate.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  regForm: FormGroup;
  readonly: boolean;
  constructor(public translateService: TranslateService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private storageService: StorageService,
    private navigateService: NavigateService,
    private $message: NzMessageService,
    private storage: StorageService) {
    this.readonly = true;
  }

  ngOnInit(): void {
    this.regForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }
  submitForm() {
    this.regForm.markAllAsTouched();
    if (!this.regForm.valid) { return }
    let regModel = Object.assign(this.regForm.value, {})
    this.apiService.post('register', regModel).subscribe((res: any) => {
      const { code, msg } = res;
      if (code === 0) {
        this.$message.success('Register Success！')
        setTimeout(() => {
          this.navigateService.navigate('login')
        }, 200);

      } else {
        this.$message.error(msg)
      }

    })
  }
  toLogin() {
    console.log('to register');

    this.navigateService.navigate('login');
  }
}
