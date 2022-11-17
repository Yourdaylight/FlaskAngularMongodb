import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';

import { IconsProviderModule } from 'src/app/icons-provider.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');

}
@NgModule({
  declarations: [LayoutComponent],
  imports: [
    FormsModule,
    HttpClientModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    CommonModule,
    NzBreadCrumbModule,
    SharedModule,
    LayoutRoutingModule
  ],
  //exports:[LayoutComponent]
})
export class LayoutModule { }
