import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {WarrantiesService} from 'src/app/service/warranties/warranties.service';
import Swal from 'sweetalert2';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  id: string;
  simpleItems: any = [];
  warrantiesForm = new FormGroup({
    name: new FormControl('', Validators.required),
    period: new FormControl('', [Validators.required, Validators.min(0)]),
    unit: new FormControl('', Validators.required)
  });

  constructor(private WarrantiesService: WarrantiesService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.simpleItems = [{id: 0, name: 'Ngày'},
      {id: 1, name: 'Tháng'},
      {id: 2, name: 'Năm'}];
    this.route.paramMap.subscribe(queryParams => {
      const id = queryParams.get('id');
      if (id !== null) {
        this.id = id;

        this.WarrantiesService.GetOneRecord(id).subscribe(data => {
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            title: "Thành công!",
            text: "Tải dữ liệu thành công",
            icon: "success",
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          this.warrantiesForm.patchValue(data.payload);
        }, error => {
          Swal.fire(
            'Lỗi!',
            'Có lỗi xảy ra khi gửi dữ liệu.',
            'error'
          );
        });
      } else {
        this.router.navigate(['../categories/list']);
      }
    })
  }

  onSubmit() {
    const submitBtn = document.querySelector('#submitBtn');
    if (this.warrantiesForm.valid) {
      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'disabled');
      }
      const dataToSend = {
        ...this.warrantiesForm.value,
        updated_at: new Date().toISOString(),
        id: this.id
      };

      this.WarrantiesService.update(dataToSend).subscribe(
        response => {
          if (response.status == true) {
            this.warrantiesForm.reset();
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thành công!',
              text: 'Cập nhật bảo hành thành công',
              icon: 'success',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            this.router.navigate(['/warranties/list'])
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
