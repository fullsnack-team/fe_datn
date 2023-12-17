import {Component, OnInit} from '@angular/core';
import {Tenant} from "../../../../interface/tenant/tenant";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {debounceTime, switchMap} from "rxjs/operators";
import Swal from "sweetalert2";
import {RoleService} from "../../../../service/role/role.service";
import {LocationsService} from "../../../../service/locations/locations.service";
import {UserService} from "../../../../service/user/user.service";
import {LocalStorageService} from "../../../../service/localStorage/localStorage.service";
import {AuthService} from "../../../../service/auth/auth.service";
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  errorMessages: any = [];

  activeLocation: any;

  tenant: Tenant;

  userForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, CustomValidators.email]),
    tel: new FormControl('', [Validators.required, Validators.pattern(/^(03|05|07|08|09)+([0-9]{8})$/)]),
    password: new FormControl('', [Validators.required]),
    location_id: new FormControl('', [Validators.required]),
    role_id: new FormControl('', [Validators.required]),
  });

  roles: any = [];

  locations: any = [];

  constructor(
    private router: Router,
    private roleService: RoleService,
    private locationService: LocationsService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.activeLocation = this.localStorageService.get('location');
    this.getRoles();
    this.locations = [this.activeLocation];
    if (this.authService.role === 'super-admin') {
      this.getLocations();
    }

    this.userForm.patchValue({
      location_id: this.activeLocation.id
    });
  }

  getRoles() {
    this.roleService.getRoles().subscribe((response: any) => {
      this.roles = response.payload;
    })
  }

  getLocations() {
    this.locationService.GetData().subscribe((response: any) => {
      this.locations = response.payload;
    });
  }

  onSubmit() {
    const submitBtn = document.querySelector('#submitBtn');
    this.errorMessages = [];

    if (this.userForm.valid) {
      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'disabled');
      }

      const data = this.userForm.value;


      const formData = {
        name: String(data.name),
        tel: data.tel,
        email: String(data.email),
        password: String(data.password),
        location_id: String(data.location_id),
        role_id: String(data.role_id),
        status: 1
      }

      this.userService.create(formData).subscribe(
        (response: any) => {
          if (response.status == true) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: "Cập nhật thành công",
              icon: 'success',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            this.router.navigate([`../users/list`]);
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
          // console.log(error);
          const errorMessages = [];
          if (error.error.meta && typeof error.error.meta === 'object') {
            for (const key in error.error.meta.errors) {
              // errorMessages.push(`${response.meta}`);
              const messages = error.error.meta.errors[key];
              for (const message of messages) {
                errorMessages.push(`${key}: ${message}`);
              }
            }
          } else {
            errorMessages.push(`${error.error.meta}`);
          }
          this.showNextMessage(errorMessages);
        }
      );
    }
  }

  showNextMessage(errorMessages: any) {
    if (errorMessages.length > 0) {
      const message = errorMessages.shift();
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: 'Thất bại!',
        text: message,
        icon: 'error',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
        didClose: () => {
          this.showNextMessage(errorMessages);
        },
      });
    }
  }

}
