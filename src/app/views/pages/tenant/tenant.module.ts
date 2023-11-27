import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CreateComponent} from "./create/create.component";
import {AuthGuard} from "../../../core/guard/auth.guard";
import {RouterModule, Routes} from "@angular/router";


const routes: Routes = [
  {
    path: 'create',
    component: CreateComponent,
    // canActivate: [AuthGuard],
  }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class TenantModule { }
