import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ParamMap } from '@angular/router';
import {
  debounceTime,
  switchMap,
  distinctUntilChanged,
  map,
  catchError,
} from 'rxjs/operators';

import { Observable, Subject } from 'rxjs';
import { CustomersService } from 'src/app/service/customers/customers.service';
import { DebtsService } from 'src/app/service/debts/debts.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateRecoveryComponent implements OnInit {
  resultModel: any;

  recoveryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    principal: new FormControl('', Validators.required),
    debit_at: new FormControl('', Validators.required),
    due_at: new FormControl('', Validators.required),
    partner: new FormControl(''),
    note: new FormControl(''),
  });
  listCustomer: any[] = [];
  flag = false;
  constructor(
    private _customerService: CustomersService,
    private _debtService: DebtsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._customerService.getCustomer().subscribe((res: any) => {
      this.listCustomer = res.payload;
      console.log(this.listCustomer);
    });
  }
  searchTerm: any[] = [];

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : this.listCustomer
              .filter(
                (v) => v.name_tel.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );
  formatter = (x: { name_tel: string }) => x.name_tel;

  onSubmit(): void {
    if (this.recoveryForm.valid) {
      const dataSend = {
        partner_id: Number(this.resultModel.id),
        partner_type: Number(this.resultModel.customer_type),
        debit_at: String(this.recoveryForm.value.debit_at),
        due_at: String(this.recoveryForm.value.due_at),
        type: Number(0),
        name: String(this.recoveryForm.value.name),
        amount_debt: Number(this.recoveryForm.value.principal),
        amount_paid: 0,
        note: String(this.recoveryForm.value.note),
        status: Number(1),
      };
      console.log(dataSend);
      this._debtService.createDebts(dataSend).subscribe(
        (response: any) => {
          if (response.status == true) {
            this.recoveryForm.reset();
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thành công!',
              text: 'Thêm khoản thu thành công',
              icon: 'success',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            this.router.navigate(['debts/recovery/list']);
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
        },
        (error: any) => {
          console.log(error);
          Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
        }
      );
    } else {
      alert('Không để trống');
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
