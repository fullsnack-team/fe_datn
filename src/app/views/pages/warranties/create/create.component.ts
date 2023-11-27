import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn,AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router} from '@angular/router';
import { WarrantiesService } from 'src/app/service/warranties/warranties.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  simpleItems: any = [];
  warrantiesForm = new FormGroup({
    name: new FormControl('', Validators.required),
    period: new FormControl('',[Validators.required,Validators.min(0)]),
    unittype: new FormControl('', Validators.required)
  });
  constructor(private wanrrities: WarrantiesService,  private router: Router) {}

  ngOnInit(): void {
    this.simpleItems = [ { id: 0, name: 'Ngày' },
    { id: 1, name: 'Tháng' },
    { id: 2, name: 'Năm' }];
  }


  onSubmit() {
    if (this.warrantiesForm.valid) {
        const dataToSend = {
          name: this.warrantiesForm.value.name || "",
          unit: Number(this.warrantiesForm.value.unittype),
          period :  Number(this.warrantiesForm.value.period),
          created_date: new Date(),
          update_date: null,
        };
        this.wanrrities.create(dataToSend).subscribe(
          (response : any) => {
            if (response.status == true) {
              this.warrantiesForm.reset();
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
              this.router.navigate(['../warranties/list']);
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
            if(error.error.status == false){
              Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                title: "Thành công!",
                text: `${error.error.meta.errors.name}`,
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
      alert('Không để trống');
    }
  }

}
