import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { WarrantiesComponent } from './warranties.component';

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
const routes: Routes = [
  {
    path: '',
    component: WarrantiesComponent,
    children: [
      {
        path: 'list',
        component:  ListComponent
      },
      {
        path: 'edit/:id',
        component: EditComponent
      },
      {
        path: 'create',
        component: CreateComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    EditComponent,
    WarrantiesComponent
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
    FormsModule
  ]
})
export class WarrantiesModule { }
