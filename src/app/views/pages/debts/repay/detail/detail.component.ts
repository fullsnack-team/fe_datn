import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import {
  debounceTime,
  switchMap,
  distinctUntilChanged,
  map,
  catchError,
} from 'rxjs/operators';

import { Observable, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CustomersService } from 'src/app/service/customers/customers.service';
import { DebtsService } from 'src/app/service/debts/debts.service';
import { PaymentService } from 'src/app/service/payment/payment.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailRepayComponent implements OnInit {

  repayForm = new FormGroup({
    name: new FormControl('', Validators.required),
    amount_debt: new FormControl('', Validators.required),
    debit_at: new FormControl('', Validators.required),
    due_at: new FormControl('', Validators.required),
    note: new FormControl(''),
    partner_name: new FormControl(''),
    status: new FormControl(''),
    id: new FormControl(''),
  });

  debt: any;
  id: any;
  isLoading = false;
  basicModalCloseResult: string = '';
  typePayment: any[] = [];
  oldPayment: any[] = [];
  dataAdd: {
    payment_at: string;
    payment_method: number;
    amount_in: number;
    reference_code: string;
    note: string;
  } = {
    payment_at: '',
    payment_method: 0,
    amount_in: 0,
    reference_code: '',
    note: '',
  };
  totalPayment: any;

  constructor(
    private _debtService: DebtsService,
    private _paymentService: PaymentService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.typePayment = [
      { id: 0, name: 'Tiền mặt' },
      { id: 1, name: 'Chuyển khoản' },
    ];

    this.route.paramMap.subscribe((queryParams) => {
      const id = queryParams.get('id');
      if (id !== null) {
        this.id = id;
        this.isLoading = true;
        this._debtService.GetOneRecord(id).subscribe(
          (data) => {
            const debtData = data.payload;
            this.debt = data.payload;
            this.oldPayment = data.payload.payments;

            if (data.payload.payments != '') {
              console.log(this.oldPayment);
              this.totalPayment = 0;
              this.oldPayment.forEach((payment) => {
                this.totalPayment += payment.amount_in;
              });
              console.log('Tổng tiền thanh toán là: ' + this.totalPayment);
            } else {
              this.totalPayment = 0;
            }
            this.repayForm.patchValue({
              name: debtData.name,
              amount_debt: debtData.amount_debt,
              debit_at: debtData.debit_at,
              due_at: debtData.due_at,
              note: debtData.note,
              partner_name: debtData.partner_name,
              status: debtData.status,
            });
            this.isLoading = false;
          },
          (error) => {
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
          }
        );
      } else {
        this.router.navigate(['debts/repay/list']);
      }
    });
  }
  status(number: number): string {
    let result = '';

    switch (number) {
      case 0:
        result = 'Quá hạn';
        break;
      case 1:
        result = 'Chưa thanh toán';
        break;
      case 2:
        result = 'Thanh toán 1 phần';
        break;
      case 3:
        result = 'Đã thanh toán';
        break;
      default:
        result = 'Trạng thái không xác định';
        break;
    }

    return result;
  }
  paymentMethod(id: number) {
    let result = '';

    switch (id) {
      case 0:
        result = 'Tiền mặt';
        break;
      case 1:
        result = 'Chuyển khoản';
        break;
      default:
        result = 'Trạng thái không xác định';
        break;
    }
    return result;
  }

  openBasicModal(content: TemplateRef<any>) {
    this.modalService
      .open(content, {})
      .result.then((result) => {
        console.log(result);

        const dataSend = {
          id: this.id,
          amount: this.dataAdd.amount_in,
          amount_in: this.dataAdd.amount_in,
          amount_refund: 0,
          payment_method: this.dataAdd.payment_method,
          payment_at:
            this.dataAdd.payment_at != ''
              ? this.dataAdd.payment_at
              : new Date(),
          reference_code: this.dataAdd.reference_code,
          note: this.dataAdd.note,
        };
        console.log(dataSend);
        const cartInReturn = this.debt.amount_debt - this.debt.amount_paid;

        if (dataSend.amount > 0 && dataSend.amount <= cartInReturn) {
          this._paymentService
            .createDebtPayment(dataSend)
            .subscribe((response: any) => {
              if (response.status) {
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                  title: 'Thành công!',
                  text: 'Thêm thanh toán thành công',
                  icon: 'success',
                  timerProgressBar: true,
                  didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                  },
                });

                this.dataAdd = {
                  payment_at: '',
                  payment_method: 0,
                  amount_in: 0,
                  reference_code: '',
                  note: '',
                };
                window.location.reload();
              } else {
                console.log(response);
                const errorMessages = [];
                for (const key in response.meta.errors) {
                  const messages = response.meta.errors[key];
                  for (const message of messages) {
                    errorMessages.push(`${key}: ${message}`);
                  }
                }
                this.showNextMessage(errorMessages);
              }
            });
        } else {
          if(dataSend.amount > cartInReturn){
            this.showNextMessage(['Số tiền nhập không được lớn hơn số tiền phải trả'])
          }
          if(dataSend.amount < 0){
            this.showNextMessage(['Số tiền nhập không được nhỏ hơn hoặc bằng 0'])
          }
        }

        this.basicModalCloseResult = 'Modal closed' + result;
      })
      .catch((res) => {});
  }
  onSubmit(): void {
    if (this.repayForm.valid) {
      // Kiểm tra xem form có hợp lệ không trước khi log dữ liệu
      const dataSend = {
        ...this.debt,
        id: this.id,
        name: String(this.repayForm.value.name),
        amount_debt: Number(this.repayForm.value.amount_debt),
        debit_at: String(this.repayForm.value.debit_at),
        due_at: String(this.repayForm.value.due_at),
        note: String(this.repayForm.value.note),
        type: 0,
      };
      console.log(dataSend);
      this._debtService.update(dataSend).subscribe((response: any) => {
        if (response.status == true) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: 'Thành công!',
            text: 'Cập nhật thông tin khoản trả thành công',
            icon: 'success',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          // location.reload();
        } else {
          console.log(response);
          const errorMessages = [];
          for (const key in response.meta.errors) {
            const messages = response.meta.errors[key];
            for (const message of messages) {
              errorMessages.push(`${key}: ${message}`);
            }
          }
          this.showNextMessage(errorMessages);
        }
      });
      // Log dữ liệu từ form
      // Bạn có thể xử lý dữ liệu ở đây, gửi nó đến server hoặc thực hiện các hành động khác
    } else {
      console.log('Form không hợp lệ!'); // Log nếu form không hợp lệ
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
