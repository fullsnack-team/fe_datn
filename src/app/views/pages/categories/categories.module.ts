import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SortablejsModule } from 'ngx-sortablejs';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { CreateComponent } from './create/create.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditCategoriesComponent } from './edit-categories/edit-categories.component';
const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component:  CategoriesListComponent
      },
      {
        path: 'edit/:id',
        component: EditCategoriesComponent
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
    CategoriesComponent,
    CreateComponent,
    CategoriesListComponent,
    EditCategoriesComponent
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
    NgbPaginationModule
  ]
})
export class CategoriesModule { }
