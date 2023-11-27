import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BrandsComponent } from './brands.component';
import { BrandsListComponent } from './brands-list/brands-list.component';
import { BrandsEditComponent } from './brands-edit/brands-edit.component';
import { BrandsCreateComponent } from './brands-create/brands-create.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SortablejsModule } from 'ngx-sortablejs';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: '',
    component: BrandsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component:  BrandsListComponent
      },
      {
        path: 'edit/:id',
        component: BrandsEditComponent
      },
      {
        path: 'create',
        component: BrandsCreateComponent
      }
    ]
  }
]


@NgModule({
  declarations: [
    BrandsComponent,
    BrandsListComponent,
    BrandsEditComponent,
    BrandsCreateComponent
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
    ReactiveFormsModule
  ]
})
export class BrandsModule { }
