import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../service/auth/auth.service";
import {LocalStorageService} from "../../../../service/localStorage/localStorage.service";
import Swal from "sweetalert2";
import {BusinessField} from "../../../../interface/business-field/business-field";
import {BusinessFieldService} from 'src/app/service/business-field/business-field.service';
import {TenantService} from "../../../../service/tenant/tenant.service";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  simpleItems: any = [];

  form = new FormGroup({
    business_name: new FormControl('', Validators.required),

    name_tenant: new FormControl('', Validators.required),

    address: new FormControl('', Validators.required),

    business_code: new FormControl('', Validators.required),

  });

  errorMessages: any = [];

  businessFields: BusinessField[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private businessFieldService: BusinessFieldService,
    private tenantService: TenantService,
  ) {
  }

  ngOnInit(): void {
    if (!this.authService.getToken('tenant_token')) {
      this.router.navigate(['/auth/login']);
    }
    this.getBusinessField();
  }

  onSubmit() {
    this.errorMessages = [];
    if (this.form.valid) {
      const dataToSend = {
        business_name: this.form.value.business_name || "",
        name_tenant: this.form.value.name_tenant,
        address: this.form.value.address,
        business_code: this.form.value.business_code,
        pricing_id: 1,
      };

      this.tenantService.create(dataToSend).subscribe(
        (response: any) => {
          console.log(response);
          if (response.status == true) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thành công!',
              text: 'Tạo mới thành công',
              icon: 'success',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            setTimeout(() => {
              this.router.navigate(['auth/login/by-enterprise/tenants']);
            }, 500);
          } else {
            let msg: string = '';
            if (typeof response.meta == 'string') {
              msg = response.meta;
            } else {
              this.errorMessages = response.meta;
              if (this.errorMessages.domain_name) {
                msg = this.errorMessages.domain_name;
              }
            }
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thất bại!',
              text: msg,
              icon: 'error',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
          }
        },
        (error) => {
          if (error.error.status == false) {
            Swal.fire({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              title: "Có lỗi xảy ra",
              // text: `${error.error.meta.errors.name}`,
              icon: "error",
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });
          }

        }
        // ,
      )
      ;
    } else {
      alert('Không để trống');
    }
  }

  getBusinessField() {
    this.businessFieldService.getBusinessFields().subscribe(
      (response: any) => {
        this.businessFields = response.payload;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
