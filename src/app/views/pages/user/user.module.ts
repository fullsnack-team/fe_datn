import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { EditComponent } from './edit/edit.component';
import {RouterModule, Routes} from "@angular/router";
import { UserComponent } from './user.component';
import { CreateComponent } from './create/create.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
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
    DetailComponent,
    EditComponent,
    UserComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    PaginatorModule,
    ReactiveFormsModule,
  ]
})
export class UserModule { }
