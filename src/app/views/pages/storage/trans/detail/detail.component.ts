import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { StorageImportService } from 'src/app/service/storage/storage-import.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  isLoading = false;

  storageTransForm = new FormGroup({
    reason: new FormControl(''),
    note: new FormControl(''),
    inventory_name_out: new FormControl(''),
    inventory_name: new FormControl(''),
    quantity: new FormControl(''),
  });

  listStorage: any;
  id: string;
  status: number;

  constructor(
    private _storage: StorageImportService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((queryParams) => {
      // console.log(queryParams.get('id'));
      const id = queryParams.get('id');
      if (id !== null) {
        this.id = id;
        this.isLoading = true;
        this._storage.getOne(id).subscribe(
          (data) => {
            const storageData = data.payload[0];
            this.status = storageData.status;
            this.listStorage = data.payload[0].inventory_transaction_details;
            console.log(storageData);

            // Chuyển đổi giá trị gender sang kiểu number
            // locationData.gender = String(locationData.gender);
            // console.log(storageData);
            // storageData.is_main = storageData.is_main == true ? 1 : 0;
            // storageData.status = storageData.status == true ? 1 : 0;
            // locationData.image = ' ';
            this.storageTransForm.patchValue(storageData);
            this.isLoading = false; // Stop loading
          },
          (error) => {
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
          }
        );
      } else {
        this.router.navigate(['../storage/trans/list']);
      }
    });
  }
  

  onSubmit() {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn chuyển kho?',
      text: 'Bạn sẽ không thể hoàn tác lại hành động này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, tiến hành!',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.storageTransForm.valid) {
          // const dataSend = {
          //   inventory_transaction_id: String(this.id),
          // }
          // console.log(dataSend);
          const dataSend = {
            id: this.id,
            tranType: 2
          }
          console.log(dataSend);

          this._storage.update(dataSend).subscribe(
            (response: any) => {
              if (response.status == true) {
                this.storageTransForm.reset();
                this.showSuccessMessage('storage/trans');
              } else {
                console.log(response);
                const errorMessages = [];
                for (const key in response.meta.errors) {
                  const messages = response.meta.errors[key];
                  for (const message of messages) {
                    errorMessages.push(`${message}`);
                  }
                }
                this.showNextMessage(errorMessages);
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
    });
  }
  cancel() {
    console.log('Đã nhấn nút');
    Swal.fire({
      title: 'Bạn có chắc chắn muốn hủy đơn chuyển kho?',
      text: 'Bạn sẽ không thể hoàn tác lại hành động này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, tiến hành!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._storage.cancel(this.id).subscribe((res) => {
          if (res.status == true) {
            this.storageTransForm.reset();
            this.showSuccessMessage('storage/trans');
          } else {
            console.log(res);
            const errorMessages = [];
            for (const key in res.meta.errors) {
              const messages = res.meta.errors[key];
              for (const message of messages) {
                errorMessages.push(`${message}`);
              }
            }
            this.showNextMessage(errorMessages);
          }
        });
      }
    });
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

  showSuccessMessage(router: string) {
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
    this.router.navigate([`../${router}/list`]);
  }

}
