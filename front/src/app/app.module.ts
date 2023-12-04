import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N, zh_CN, en_US } from 'ng-zorro-antd/i18n';
import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMessageService } from 'ng-zorro-antd/message';

registerLocaleData(zh);

const ngZorroConfig: NzConfig = {
  theme: {
    primaryColor: '#cfb338',
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzBreadCrumbModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    NzMessageService,
    HttpClient,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
