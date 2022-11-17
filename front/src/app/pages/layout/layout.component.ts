import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EventService } from 'src/app/services/event.service';
import { NavigateService } from 'src/app/services/navigate.service';
import { en_US, zh_CN, NzI18nService } from 'ng-zorro-antd/i18n';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {
  isCollapsed = false;
  menuList: [];
  langType: string;
  userName: string;
  constructor(
    private navigate: NavigateService,
    private translateService: TranslateService,
    private nzModalService: NzModalService,
    private nzi18n: NzI18nService,
    private storage: StorageService
  ) {
    this.langType = this.translateService.currentLang || '';
    try {
      let langObj = JSON.parse(this.langType);
      if (langObj && typeof langObj === 'object') {
        this.langType = langObj.key
      }
    } catch { }
  }

  ngOnInit(): void {
    this.userName = '';
  }
  translateFn = (key: string) => {
    if (key) {
      return this.translateService.instant(key);
    }
  }
  logOut() {
    this.nzModalService.confirm({
      nzContent: this.translateService.instant('CONFIRM_EXIT'),
      nzTitle: this.translateService.instant('FRIENDSHIP_TIPS'),
      nzOnOk: () => {
        this.storage.remove('token');
        this.navigate.goToLogin();
      }
    })

  }
  langChange(lang: string) {
    this.langType = lang;
    this.translateService.use(lang);
    this.storage.setItem('lang', lang);
    // 组件国际化切换
    if (lang == 'en') {
      this.nzi18n.setLocale(en_US);
      this.storage.setItem('nzLang', 'en_US');
    } else {
      this.nzi18n.setLocale(zh_CN);
      this.storage.setItem('nzLang', 'zh_CN');
    }
    window.location.reload();
  }

  toggleCollapsed(e: Event) {
    e.stopPropagation();
    this.isCollapsed = !this.isCollapsed;
  }
}
