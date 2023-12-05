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
    email: new FormControl('', [Validators.required]),
    tel: new FormControl('', [Validators.required]),
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
    this.errorMessages = [];

    if (this.userForm.valid) {

      const data = this.userForm.value;


      const formData = {
        name: String(data.name),
        tel: data.tel,
        email: String(data.email),
        password: String(data.password),
        location_id: String(data.location_id),
        role_id: String(data.role_id),
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
            this.router.navigate([`../`]);
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
        },
        (error) => {
          console.log(error);
          Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
        }
      );
    }
  }

}
