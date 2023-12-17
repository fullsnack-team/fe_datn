import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';

import {StorageImportService} from 'src/app/service/storage/storage-import.service';

interface data {
  inventory_transaction_id: string;
  note: string;
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  storageConfirmForm = new FormGroup({
    inventory_transaction_id: new FormControl(''),
    reason: new FormControl(''),
    note: new FormControl(''),
    partner_name: new FormControl(''),
    inventory_name: new FormControl(''),
    price: new FormControl(''),
    quantity: new FormControl(''),
    status: new FormControl(''),
  });
  listStorage: any;
  id: string;
  status: number;
  isLoading = false;

  constructor(
    private _storage: StorageImportService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // this._storage.GetOneRecord()
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((queryParams) => {
      // console.log(queryParams.get('id'));
      const id = queryParams.get('id');
      if (id !== null) {
        this.id = id;
        this.isLoading = true;
        this._storage.getOne(id).subscribe(
          (data) => {
            // console.log(data);

            const storageData = data.payload[0];
            this.status = storageData.status;
            this.listStorage = data.payload[0].inventory_transaction_details;
            // console.log(storageData);

            // Chuyển đổi giá trị gender sang kiểu number
            // locationData.gender = String(locationData.gender);
            // console.log(storageData);
            // storageData.is_main = storageData.is_main == true ? 1 : 0;
            // storageData.status = storageData.status == true ? 1 : 0;
            // locationData.image = ' ';
            this.storageConfirmForm.patchValue(storageData);
            this.isLoading = false; // Stop loading
          },
          (error) => {
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
          }
        );
      } else {
        this.router.navigate(['../locations/list']);
      }
    });
  }

  calculateTotal(index1: number, index2: number): number {
    return index1 * index2;
  }

  calculateTotalPrice(): number {
    let total = 0;
    for (let i = 0; i < this.listStorage.length; i++) {
      total += this.listStorage[i].price * this.listStorage[i].quantity;
    }
    return total;
  }

  onSubmit() {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn nhập kho?',
      text: 'Bạn sẽ không thể hoàn tác lại hành động này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, tiến hành!',
    }).then((result) => {
      if (result.isConfirmed) {
        const submitBtn = document.querySelector('#submitBtn');
        if (this.storageConfirmForm.valid) {
          if (submitBtn) {
            submitBtn.setAttribute('disabled', 'disabled');
          }
          // const dataSend = {
          //   inventory_transaction_id: String(this.id),
          // }
          // console.log(dataSend);
          const dataSend = {
            id: this.id,
            tranType: 0
          }
          // console.log(dataSend);

          this._storage.update(dataSend).subscribe(
            (response: any) => {
              if (response.status == true) {
                this.storageConfirmForm.reset();
                this.showSuccessMessage('storage/import');
              } else {
                if (submitBtn) {
                  submitBtn.removeAttribute('disabled');
                }
                console.log(response);
                const errorMessages = [];
                if (response.meta && typeof response.meta === 'object') {
                  for (const key in response.meta) {
                    // errorMessages.push(`${response.meta}`);
                    const messages = response.meta[key];
                    for (const message of messages) {
                      errorMessages.push(`${key}: ${message}`);
                    }
                  }
                } else {
                  errorMessages.push(`${response.meta}`);
                }
                this.showNextMessage(errorMessages);
              }
            },
            (error) => {
              const errorMessages = [];
            if (error.meta && typeof error.meta === 'object') {
              for (const key in error.meta) {
                // errorMessages.push(`${response.meta}`);
                const messages = error.meta[key];
                for (const message of messages) {
                  errorMessages.push(`${key}: ${message}`);
                }
              }
            } else {
              errorMessages.push(`${error.meta}`);
            }
            this.showNextMessage(errorMessages);
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
    });
  }

  cancel() {
    // console.log('Đã nhấn nút');
    Swal.fire({
      title: 'Bạn có chắc chắn muốn hủy đơn nhập kho?',
      text: 'Bạn sẽ không thể hoàn tác lại hành động này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, tiến hành!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._storage.cancel(this.id, null).subscribe((res) => {
          if (res.status == true) {
            this.storageConfirmForm.reset();
            this.showSuccessMessage('storage/import');
          } else {
            const errorMessages = [];
                if (res.meta && typeof res.meta === 'object') {
                  for (const key in res.meta) {
                    // errorMessages.push(`${response.meta}`);
                    const messages = res.meta[key];
                    for (const message of messages) {
                      errorMessages.push(`${key}: ${message}`);
                    }
                  }
                } else {
                  errorMessages.push(`${res.meta}`);
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
