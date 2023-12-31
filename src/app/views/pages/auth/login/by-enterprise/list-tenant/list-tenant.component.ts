import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../../../service/auth/auth.service";
import {Tenant} from "../../../../../../interface/tenant/tenant";
import {User} from "../../../../../../interface/user/user";
import {LocalStorageService} from "../../../../../../service/localStorage/localStorage.service";
import {SettingService} from "../../../../../../service/setting/setting.service";
import Swal from "sweetalert2";
import {TenantService} from "../../../../../../service/tenant/tenant.service";

@Component({
  selector: 'app-list-tenant',
  templateUrl: './list-tenant.component.html',
  styleUrls: ['./list-tenant.component.scss']
})
export class ListTenantComponent implements OnInit {

  public tenants: Tenant[];

  errorMessages: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private tenantService: TenantService
  ) {
  }

  ngOnInit(): void {
    if (!this.authService.getToken('tenant_token')) {
      this.router.navigate(['/auth/login/by-enterprise']);
    }
    this.tenantService.getTenantsByUser().subscribe(
      (response: any) => {
        if (response.status) {
          this.tenants = response.payload;
        }
      }
    );
  }

  setUser(tenant_name: string): void {
    this.errorMessages = [];
    if (this.tenants.find(tenant => tenant.name === tenant_name)) {
      this.authService.loginByEnterprise({tenant_name}).subscribe(
        (response: { status: boolean, payload: any, meta: any }) => {
          if (response.status) {

            const result: {
              status: boolean,
              msg: string,
              type: "success" | "error"
            } = this.authService.login(response.payload);
            const returnUrl: "/dashboard" | "/auth/login/" = result.status ? '/dashboard' : '/auth/login/';

            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: result.msg,
              icon: result.type,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });

            setTimeout(() => {
              result.status
                ? this.router.navigate([returnUrl]).then(() => {
                  window.location.reload();
                  return;
                })
                : this.router.navigate([returnUrl]);
            }, 1500);

          } else {
            this.errorMessages = response.meta;
            if (this.errorMessages.domain_name) {
              Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                title: 'Thất bại!',
                text: this.errorMessages.domain_name,
                icon: 'error',
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer);
                  toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
              });
            }
          }
        }
      );
    }
  }

  redirectToLogin(): void {
    this.localStorage.remove('tenant_token');
    this.router.navigate(['/auth/login']);
  }

  redirectToCreateNewTenant(): void {
    this.router.navigate(['tenant/create']);
  }

}
