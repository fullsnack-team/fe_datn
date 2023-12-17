import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {GroupSuppliersService} from 'src/app/service/group_suppliers/group-suppliers.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {


  groupsSuppliersForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('')
  });

  constructor(private GroupSuppliersService: GroupSuppliersService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const submitBtn = document.querySelector('#submitBtn');
    if (this.groupsSuppliersForm.valid) {
      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'disabled');
      }
      const dataToSend = {
        name: this.groupsSuppliersForm.value.name || "",
        description: this.groupsSuppliersForm.value.description || "",
        created_at: new Date(),
        updated_at: null
      };
      this.GroupSuppliersService.create(dataToSend).subscribe(
        (response: any) => {
          if (response.status == true) {
            this.groupsSuppliersForm.reset();
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
            this.router.navigate(['../group_suppliers/list']);
          } else {
            if (submitBtn) {
              submitBtn.removeAttribute('disabled');
            }
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
          if (submitBtn) {
            submitBtn.removeAttribute('disabled');
          }
          // console.log(error);
          Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
        }
      );

    } else {
      alert('Không để trống');
    }
  }

}
