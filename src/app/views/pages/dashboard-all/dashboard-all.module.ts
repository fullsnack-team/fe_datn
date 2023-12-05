import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxMaskModule, IConfig } from 'ngx-mask';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SortablejsModule } from 'ngx-sortablejs';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { DashboardAllComponent } from './dashboard-all.component';
import { ListComponent } from './list/list.component';
import { ReportdateComponent } from './reportdate/reportdate.component';
import { ReportpaymentComponent } from './reportpayment/reportpayment.component';
import { ReportproductComponent } from './reportproduct/reportproduct.component';
import { ReportuserComponent } from './reportuser/reportuser.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardAllComponent,
    children: [
      {
        path: '',
        component:  ListComponent
      },
      {
        path: 'revenue-by-time',
        component:  ReportdateComponent
      },
      {
        path: 'revenue-by-payment',
        component: ReportpaymentComponent
      },
      {
        path: 'revenue-by-product',
        component: ReportproductComponent
      },
      {
        path: 'revenue-by-customer',
        component: ReportuserComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    DashboardAllComponent,
    ListComponent,
    ReportdateComponent,
    ReportpaymentComponent,
    ReportproductComponent,
    ReportuserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
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
    NgxMaskModule.forRoot({ validation: true})
  ]
})
export class DashboardAllModule { }
