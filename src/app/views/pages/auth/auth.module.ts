import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import {LoginByEnterpriseComponent} from "./login/by-enterprise/login-by-enterprise/login-by-enterprise.component";
import {LoginByStaffComponent} from "./login/by-staff/login-by-staff/login-by-staff.component";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {ListTenantComponent} from "./login/by-enterprise/list-tenant/list-tenant.component";
import {LoginByDomainNameComponent} from "./login/by-staff/login-by-domain-name/login-by-domain-name.component";
import {NgSelectModule} from "@ng-select/ng-select";

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'login/by-enterprise',
        component: LoginByEnterpriseComponent
      },
      {
        path: 'login/by-enterprise/tenants',
        component: ListTenantComponent,
      },
      {
        path: 'login/by-staff',
        component: LoginByStaffComponent
      },
      {
        path: 'login/by-staff/:domain_name',
        component: LoginByDomainNameComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  },
]

@NgModule({
  declarations: [LoginComponent, RegisterComponent, AuthComponent, LoginByEnterpriseComponent, LoginByStaffComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PaginatorModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class AuthModule { }
