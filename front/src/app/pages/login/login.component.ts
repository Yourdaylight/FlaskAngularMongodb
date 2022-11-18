import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { NavigateService } from 'src/app/services/navigate.service';
import { NzModalService } from 'ng-zorro-antd/modal';

import { en_US, zh_CN, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  langFlag: boolean
  readonly: boolean;
  validateForm: FormGroup;
  static BG_ID = '#bgLogin';
  lang: any;
  constructor(
    public translateService: TranslateService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private storageService: StorageService,
    private navigateService: NavigateService,
    private nzi18n: NzI18nService,
    private $message: NzMessageService,
    private storage: StorageService
  ) {
    this.readonly = true;
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }


  changeLang(langType: string) {
    this.translateService.use(langType);
    this.storage.setItem('lang', langType)
    if (langType == 'en') {
      this.langFlag = true;
      this.nzi18n.setLocale(en_US);
      this.storage.setItem('nzLang','en_US');
    } else {
      this.langFlag = false;
      this.nzi18n.setLocale(zh_CN);
      this.storage.setItem('nzLang','zh_CN');
    }
  }
  submitForm() {
    this.validateForm.markAllAsTouched();
    if (!this.validateForm.valid) {return}
    let loginModel = Object.assign(this.validateForm.value, {})
    this.apiService.post('login', loginModel).subscribe((res: any) => {
      const {code,msg,data} = res;
      if (code === 0 && data) {
        this.$message.success('登录成功')
        this.storageService.setItem('username', loginModel.username);
        this.storageService.setItem('token', data?.token);
        this.storageService.setItem('role',data?.role)
        setTimeout(() => {
          this.navigateService.navigate('layout')
        }, 200);
      }else {
        this.$message.error(msg);
      }

    })
  }
  toReg(){
    this.navigateService.navigate('register');
  }
}
