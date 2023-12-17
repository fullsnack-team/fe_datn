import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../../../service/auth/auth.service";
import {LocalStorageService} from "../../../../../../service/localStorage/localStorage.service";
import Swal from "sweetalert2";
import {SettingService} from "../../../../../../service/setting/setting.service";

@Component({
  selector: 'app-login-by-domain-name',
  templateUrl: './login-by-domain-name.component.html',
  styleUrls: ['./login-by-domain-name.component.scss']
})
export class LoginByDomainNameComponent implements OnInit {

  simpleItems: any = [];
  loginForm = new FormGroup({
    email: new FormControl('staff1@gmail.com', Validators.required),
    password: new FormControl('12345678', Validators.required)
  });

  errorMessages: any = [];

  params: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.params = params;
    });
  }

  ngAfterViewInit(): void {
  }

  onSubmit() {
    const submitBtn = document.querySelector('#submitBtn');
    this.errorMessages = [];
    if (this.loginForm.valid) {
      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'disabled');
      }
      const dataToSend = {
        domain_name: this.params.domain_name,
        email: this.loginForm.value.email || "",
        password: this.loginForm.value.password
      };

      this.authService.loginByStaff(dataToSend).subscribe(
        (response: any) => {
          if (response.status == true) {
            const result: {
              status: boolean,
              msg: string,
              type: "success" | "error"
            } = this.authService.login(response.payload);

            let returnUrl: string = '/auth/login/';

            if (result.status) {
              returnUrl = '/dashboard';
              if (this.authService.role == 'staff') {
                returnUrl = '/shop/tabshop';
              }
            }

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
        },
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
      );
    } else {
      alert('Không để trống');
    }
  }

}
