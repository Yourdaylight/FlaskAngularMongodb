import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzI18nService, zh_CN, en_US } from 'ng-zorro-antd/i18n';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  lang: string;
  nzLang: string;
  isCollapsed = false;
  menuList: [];
  loading = true;
  constructor(
    private translateService: TranslateService,
    private storage: StorageService,
    private nzi18n: NzI18nService,
  ) {
    let browserLang = this.translateService.getBrowserLang(); //查询浏览器语言环境
    this.lang = this.storage.getItem('lang') ? this.storage.getItem('lang') : (browserLang.match(/en|zh-cn/) ? browserLang : 'zh-cn');
    this.nzLang = this.storage.getItem('nzLang') ? this.storage.getItem('nzLang') : (browserLang.match(/en|zh-cn/) ? browserLang : 'zh_CN')
    this.translateService.addLangs(["zh-cn", "en"]);
    this.translateService.setDefaultLang(this.lang);
    this.translateService.use(this.lang); 
    if (this.nzLang == 'zh_CN') {
      this.nzi18n.setLocale(zh_CN);
    }else{
      this.nzi18n.setLocale(en_US);
    }

  }
  ngOnInit() {
    this.loading = false;
  }
}
