import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SortablejsModule } from 'ngx-sortablejs';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { FormsModule } from '@angular/forms';


import { DebtsComponent } from './debts.component';
import { ListRecoveryComponent } from './recovery/list/list.component';
import { ListRepayComponent } from './repay/list/list.component';
import { CreateRecoveryComponent } from './recovery/create/create.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: DebtsComponent,
    children: [
      {
        path: '',
        redirectTo: 'recovery/list',
        pathMatch: 'full'
      },
      {
        path: 'recovery/list',
        component:  ListRecoveryComponent
      },
      {
        path: 'recovery/create',
        component:  CreateRecoveryComponent
      },
      {
        path: 'repay/list',
        component:  ListRepayComponent
      },

      // {
      //   path: 'edit/:id',
      //   component: EditComponent
      // },
      // {
      //   path: 'create',
      //   component: CreateComponent
      // }
    ]
  }
]

@NgModule({
  declarations: [
    DebtsComponent,
    ListRecoveryComponent,
    ListRepayComponent,
    CreateRecoveryComponent,

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
    NgxMaskModule.forRoot({ validation: true}),
    NgbTypeaheadModule
  ]
})
export class DebtsModule { }