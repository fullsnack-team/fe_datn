import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GroupCustomersService } from 'src/app/service/group_customers/group-customers.service';
import Swal from 'sweetalert2';
import { Router} from '@angular/router';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  groupsCustomersForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description : new FormControl('')
  });
  constructor(private GroupCustomersService: GroupCustomersService,  private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.groupsCustomersForm.valid) {
        const dataToSend = {
          name: this.groupsCustomersForm.value.name || "",
          description: this.groupsCustomersForm.value.description || "",
          created_at: new Date(),
          updated_at: null
        };
        this.GroupCustomersService.create(dataToSend).subscribe(
          (response :any) => {
            if (response.status == true) {
              this.groupsCustomersForm.reset();
              Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                title: 'Thành công!',
                text: 'Thêm thành công',
                icon: 'success',
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer);
                  toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
              });
              this.router.navigate(['../group_customers/list']);
            } else {
              // console.log(response);
              const errorMessages = [];
              for (const key in response.meta.errors) {
                errorMessages.push(...response.meta.errors[key]);
              }
              const message = errorMessages.join(' ');

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
              });
            }
          },
          (error) => {
            // console.log(error);
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
          }
        );

    } else {
      alert('Không để trống');
    }
  }

}
