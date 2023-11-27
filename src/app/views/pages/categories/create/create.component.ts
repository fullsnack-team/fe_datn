import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/service/categories/categories.service';
import Swal from 'sweetalert2';
import { Router} from '@angular/router';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  constructor(private categories: CategoriesService,  private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.categoryForm.valid) {
        const dataToSend = {
          name: this.categoryForm.value.name || "",
          created_at: new Date(),
          updated_at: null,
        };
        this.categories.create(dataToSend).subscribe(
          (response : any) => {
     
            if (response.status == true) {
              this.categoryForm.reset();
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
              this.router.navigate(['../categories/list']);
            } else {
              console.log(response);
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
            console.log(error);
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
          }
        );
    } else {
      alert('Không để trống');
    }
  }
}
