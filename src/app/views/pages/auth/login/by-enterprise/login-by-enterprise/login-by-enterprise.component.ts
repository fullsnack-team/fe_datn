import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {AuthService} from 'src/app/service/auth/auth.service';
import {LocalStorageService} from "../../../../../../service/localStorage/localStorage.service";

@Component({
  selector: 'app-login-by-enterprise',
  templateUrl: './login-by-enterprise.component.html',
  styleUrls: ['./login-by-enterprise.component.scss']
})
export class LoginByEnterpriseComponent implements OnInit, AfterViewInit {

  simpleItems: any = [];

  loginForm = new FormGroup({
    email: new FormControl('tenant_test@gmail.com', Validators.required),

    password: new FormControl('12345678', Validators.required)

  });

  errorMessages: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {
  }

  returnUrl: any;

  ngOnInit(): void {
    if (this.authService.getToken('tenant_token')) {
      this.router.navigate(['/auth/login/by-enterprise/tenants']);
    }
  }

  ngAfterViewInit(): void {
  }

  onSubmit() {
    this.errorMessages = [];
    const submitBtn = document.querySelector('#submitBtn');
    if (this.loginForm.valid) {
      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'disabled');
      }
      const dataToSend = {
        email: this.loginForm.value.email || "",
        password: this.loginForm.value.password
      };

      this.authService.getUserByEnterprise(dataToSend).subscribe(
        (response: any) => {
          if (response.status == true) {
            this.localStorageService.set('tenant_token', response.payload);
            this.router.navigate(['auth/login/by-enterprise/tenants']);
          } else {
            if (submitBtn) {
              submitBtn.removeAttribute('disabled');
            }
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
        ,
        (error) => {
          if (submitBtn) {
            submitBtn.removeAttribute('disabled');
          }
          if (error.error.status == false) {
            Swal.fire({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              title: "Thành công!",
              text: `${error.error.meta.errors.name}`,
              icon: "error",
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });
          }

        }
      )
      ;
    } else {
      alert('Không để trống');
    }
  }

}
