 import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabshopComponent } from './tabshop/tabshop.component';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { Routes, RouterModule } from '@angular/router';
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SortablejsModule } from 'ngx-sortablejs';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ShopComponent } from './shop.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    children: [
      {
        path: 'tabshop',
        component:  TabshopComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    ShopComponent,
    TabshopComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FeatherIconModule,
    AngularCropperjsModule,
    CarouselModule,
    SortablejsModule.forRoot({
      animation: 150,
      ghostClass: 'bg-light',
    }),
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    NgxMaskModule.forRoot({ validation: true}),
    NgbDropdownModule,
    NgbAccordionModule,
    PerfectScrollbarModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ShopModule { }
