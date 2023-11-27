import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { ItemUnitsService } from 'src/app/service/item_units/item-units.service';

@Component({
  selector: 'app-item-units-create',
  templateUrl: './item-units-create.component.html',
  styleUrls: ['./item-units-create.component.scss']
})
export class ItemUnitsCreateComponent implements OnInit {
  unitsForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
  });
  constructor(private _unitsService: ItemUnitsService, private _router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.unitsForm.valid) {
      // console.log(this.brandForm.value);
      const dataToSend = {
        name: String(this.unitsForm.value.name) || "",
      };

      this._unitsService.create(dataToSend).subscribe(
        (response: any) => {

          if (response.status == true) {
            this.unitsForm.reset();
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
            this._router.navigate(['../item-units/list']);
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
          // console.log(error);
          if (error.error.status == false) {
            Swal.fire({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              title: "Lỗi!",
              text: `${error.error.meta.errors.name[0]}`,
              icon: "error",
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });
          }
        }
      );
    } else {
      console.log("Error create item-units!");
    }
  }
}
