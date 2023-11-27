import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BusinessField} from "../../../../interface/business-field/business-field";
import {AuthService} from "../../../../service/auth/auth.service";
import {LocalStorageService} from "../../../../service/localStorage/localStorage.service";
import {BusinessFieldService} from "../../../../service/business-field/business-field.service";
import {TenantService} from "../../../../service/tenant/tenant.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  simpleItems: any = [];

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),

    email: new FormControl('', [Validators.required]),

    password: new FormControl('', Validators.required),

    confirm_password: new FormControl('', Validators.required),

  });

  errorMessages: any = [];

  businessFields: BusinessField[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private tenantService: TenantService,
  ) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.errorMessages = [];
    if (this.form.valid) {
      const dataToSend = {
        name: this.form.value.name || "",
        email: this.form.value.email || "",
        password: this.form.value.password,
        confirm_password: this.form.value.confirm_password,
      };

      this.authService.register(dataToSend).subscribe(
        (response: any) => {
          if (response.status == true) {
            this.localStorageService.set('tenant_token', response.payload);
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thành công!',
              text: 'Đăng ký thành công',
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

}
