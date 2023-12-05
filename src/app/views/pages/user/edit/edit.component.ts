import {Component, OnInit} from '@angular/core';
import {Tenant} from "../../../../interface/tenant/tenant";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {RoleService} from "../../../../service/role/role.service";
import {LocationsService} from "../../../../service/locations/locations.service";
import {UserService} from "../../../../service/user/user.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  errorMessages: any = [];

  tenant: Tenant;

  userForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    tel: new FormControl('', [Validators.required]),
    password: new FormControl(''),
    location_id: new FormControl('', [Validators.required]),
    role_id: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
  });

  id: any;

  roles: any = [];

  locations: any = [];

  user: any = [];

  status = [
    {id: 1, name: 'Đang hoạt động'},
    {id: 0, name: 'Đã khóa'},
  ];

  constructor(
    private router: Router,
    private roleService: RoleService,
    private locationService: LocationsService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.getUser();
      this.getRoles();
      this.getLocations();
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

  getUser() {
    this.userService.GetOneRecord(this.id).subscribe((response: any) => {
      this.user = response.payload;
      this.userForm.patchValue({
        name: this.user.name,
        tel: this.user.tel,
        email: this.user.email,
        location_id: this.user.location_id,
        role_id: this.user.roles[0].id,
        status: this.user.status,
      })
    })
  }

  onSubmit() {
    this.errorMessages = [];

    if (this.userForm.valid) {

      const data = this.userForm.value;


      const formData = {
        id: this.id,
        name: String(data.name),
        tel: data.tel,
        email: String(data.email),
        password: String(data.password),
        location_id: String(data.location_id),
        role_id: String(data.role_id),
      }

      this.userService.update(formData).subscribe(
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
