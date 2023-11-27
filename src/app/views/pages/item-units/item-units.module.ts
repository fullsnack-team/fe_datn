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

import { ItemUnitsComponent } from './item-units.component';
import { ItemUnitsListComponent } from './item-units-list/item-units-list.component';
import { ItemUnitsCreateComponent } from './item-units-create/item-units-create.component';
import { ItemUnitsEditComponent } from './item-units-edit/item-units-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ItemUnitsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component:  ItemUnitsListComponent
      },
      {
        path: 'edit/:id',
        component: ItemUnitsEditComponent
      },
      {
        path: 'create',
        component: ItemUnitsCreateComponent
      }
    ]
  }
]
@NgModule({
  declarations: [
    ItemUnitsComponent,
    ItemUnitsListComponent,
    ItemUnitsCreateComponent,
    ItemUnitsEditComponent,
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
export class ItemUnitsModule { }
