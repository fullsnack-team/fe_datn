import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { LayoutModule } from './views/layout/layout.module';
import { AuthGuard } from './core/guard/auth.guard';

import { AppComponent } from './app.component';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';

import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SortablejsModule } from 'ngx-sortablejs';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomFormsModule } from 'ng2-validation'

import { ListTenantComponent } from './views/pages/auth/login/by-enterprise/list-tenant/list-tenant.component';
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import { LoginByDomainNameComponent } from './views/pages/auth/login/by-staff/login-by-domain-name/login-by-domain-name.component';
import { CreateComponent } from './views/pages/tenant/create/create.component';
import { SettingComponent } from './views/pages/setting/setting.component';
import { ConfigComponent } from './views/pages/config/config.component';
import { DetailComponent } from './views/pages/lists-order/detail/detail.component';
import { UserComponent } from './views/pages/user/user.component';
import {NgxMaskModule} from "ngx-mask";
@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
    ListTenantComponent,
    LoginByDomainNameComponent,
    CreateComponent,
    SettingComponent,
    ConfigComponent,
    DetailComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LayoutModule,
        HttpClientModule,
        NgbModule,
        CommonModule,
        SortablejsModule.forRoot({animation: 150}),
        NgSelectModule,
        PaginatorModule,
        ReactiveFormsModule,
        NgxMaskModule,
        CustomFormsModule
    ],
  providers: [
    AuthGuard,
    {
      provide: HIGHLIGHT_OPTIONS, // https://www.npmjs.com/package/ngx-highlightjs
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
