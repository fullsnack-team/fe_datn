import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {GroupCustomersService} from 'src/app/service/group_customers/group-customers.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  id: string;
  groupsCustomersForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('')
  });

  constructor(private GroupCustomersService: GroupCustomersService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(queryParams => {
      const id = queryParams.get('id');
      if (id !== null) {
        this.id = id;

        this.GroupCustomersService.GetOneRecord(id).subscribe(data => {
          this.groupsCustomersForm.patchValue(data.payload);
        }, error => {
          Swal.fire(
            'Lỗi!',
            'Có lỗi xảy ra khi gửi dữ liệu.',
            'error'
          );
        });
      } else {
        this.router.navigate(['../group_customers/list']);
      }
    })
  }

  onSubmit() {
    const submitBtn = document.querySelector('#submitBtn');
    if (this.groupsCustomersForm.valid) {
      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'disabled');
      }
      const dataToSend = {
        ...this.groupsCustomersForm.value,
        updated_at: new Date().toISOString(),
        id: this.id
      };

      this.GroupCustomersService.update(dataToSend).subscribe(
        response => {
          if (response.status == true) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thành công!',
              text: 'Cập nhật thành công',
              icon: 'success',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            this.router.navigate(['/group_customers/list'])
          } else {
            if (submitBtn) {
              submitBtn.removeAttribute('disabled');
            }
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
        error => {
          if (submitBtn) {
            submitBtn.removeAttribute('disabled');
          }
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            title: "Thành công!",
            text: "Có lỗi xảy ra khi gửi dữ liệu.",
            icon: "error",
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
        }
      );
    } else {
      alert("Không để trống")
    }

  }
}
