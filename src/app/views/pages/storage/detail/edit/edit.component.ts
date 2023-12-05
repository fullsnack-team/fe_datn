import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, debounceTime, map, of } from 'rxjs';
import { StorageImportService } from 'src/app/service/storage/storage-import.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  reason: any;
  quantity: any;
  id: string;
  isLoading = false;
  detailForm = new FormGroup({
    reason: new FormControl('', Validators.required),
    product_name: new FormControl(''),
    variation_name: new FormControl(''),
    quantity: new FormControl(''),
    adjust: new FormControl('', Validators.required),
    result: new FormControl(''),
  });
  adjust: any;
  variation: any;
  result: number;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _storage: StorageImportService
  ) {}

  ngOnInit(): void {
    this.reason = [
      {
        id: 1,
        name: 'Nhập kho',
      },
      {
        id: 2,
        name: 'Hoàn trả',
      },
      {
        id: 3,
        name: 'Đếm lại',
      },
      {
        id: 4,
        name: 'Hỏng hóc',
      },
      {
        id: 5,
        name: 'Bị trộm',
      },
      {
        id: 6,
        name: 'Thất lạc',
      },
    ];
    this._route.paramMap.subscribe((queryParams) => {
      const id = queryParams.get('id');
      if (id !== null) {
        this.id = id;
        this.isLoading = true;
        this._storage.getAllInventory(id).subscribe(
          (data: any) => {
            console.log(data);
            this.variation = data.payload;
            this.detailForm.patchValue(data.payload);
            this.isLoading = false;
          },
          (error) => {
            Swal.fire('Lỗi!', 'Có lỗi xảy ra dữ liệu.', 'error');
          }
        );
      } else {
        this._router.navigate(['../item-units/list']);
      }
    });
  }

  calculator(adjust: number, quantity: number) {
    const reason = Number(this.detailForm.value.reason);
    console.log(adjust + ' _ ' + quantity);
    if (adjust == undefined && quantity == undefined) {
      return this.result = 0;
    }
    if (reason === 1) {
      //Nhập kho
      // Số tồn mới = Số tồn cũ + Số điều chỉnh
      return this.result = adjust + quantity;
    } else if (reason == 2) {
      //hoàn trả
      //Số tồn mới = Số tồn cũ + Số điều chỉnh
      return this.result = adjust + quantity;
    }else if (reason == 3) {
      //đếm lại
      //Số tồn mới = Số điều chỉnh
      return this.result = adjust
    }else if (reason == 4) {
      //hỏng hóc
      //Số tồn mới = Số tồn cũ - Số điều chỉnh
      return this.result = quantity - adjust;
    }else if (reason == 5) {
      //bị trộm
      //Số tồn mới = Số tồn cũ - Số điều chỉnh
      return this.result = quantity - adjust;
    }else if (reason == 6) {
      //thất lạc
      //Số tồn mới = Số tồn cũ - Số điều chỉnh
      return this.result = quantity - adjust;
    } else {
      return this.result = 0;
    }
  }

  onSubmit(): void {
    if(this.detailForm.valid){
      let quantity_old = Number(this.detailForm.value.quantity)
      const reason = Number(this.detailForm.value.reason);
      let quantity_edit = 0;
      if (reason === 1) {
        quantity_edit = (this.adjust);
      }
      else if (reason === 2) {
        quantity_edit = (this.adjust);
      }
      else if (reason === 3) {
        quantity_edit =  this.adjust - quantity_old;
      }
      else if (reason === 4) {
        quantity_edit = -(this.adjust);
      }
      else if (reason === 5) {
        quantity_edit = -(this.adjust);
      }
      else if (reason === 6) {
        quantity_edit = -(this.adjust);
      }

      const dataSend = {
        variation_id: this.variation.variation_id,
        quantity: quantity_edit,
        batch_id: this.variation.batch_id
      }
      console.log(dataSend);
      const inventory_id = this.variation.inventory_id;
      this._storage.updateQuantity(dataSend, inventory_id).subscribe(
        (response: any) => {
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
            this._router.navigate(['/storage/detail/list']);
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
        }
      )

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
