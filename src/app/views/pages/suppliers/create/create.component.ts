import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {SuppliersService} from 'src/app/service/suppliers/suppliers.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {GroupSuppliersService} from 'src/app/service/group_suppliers/group-suppliers.service';
import {AresService} from 'src/app/service/ares/ares.service';
import {debounceTime, switchMap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  types: any = [];
  GroupsCustomers: any = [];
  private provinceChangeSubject = new Subject<number>();
  private districtChangeSubject = new Subject<number>();
  provinces: any = [];
  districts: any = [];
  wards: any = [];
  status: any = [];
  isWardDataLoaded: boolean = false;
  customersForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl(1),
    group_supplier_id: new FormControl(''),
    province_code: new FormControl(''),
    district_code: new FormControl(''),
    ward_code: new FormControl(''),
    email: new FormControl('', [CustomValidators.email]),
    tel: new FormControl('', [Validators.required, Validators.pattern(/^(03|05|07|08|09)+([0-9]{8})$/)]),
    status: new FormControl(1),
    address_detail: new FormControl(''),
    note: new FormControl(''),
  });

  constructor(
    private SuppliersService: SuppliersService,
    private GroupSuppliersService: GroupSuppliersService,
    private AresService: AresService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.types = [
      {id: 0, name: 'Cá nhân'},
      {id: 1, name: 'Doanh nghiệp'},
    ];

    this.status = [
      {id: 0, name: 'Kích hoạt'},
      {id: 1, name: 'Không kích hoạt'},
    ];

    this.GroupSuppliersService.GetData().subscribe((data: any) => {
      this.GroupsCustomers = data.payload;
    });

    this.AresService.getProvinces().subscribe((data: any) => {
      this.provinces =
        data.status != 'error'
          ? data.results
          : [{id: 0, name: `${data.message}`}];
    });

    this.provinceChangeSubject
      .pipe(
        debounceTime(300),
        switchMap((province_code) =>
          this.AresService.getDistricts(province_code)
        )
      )
      .subscribe((data) => {
        this.districts =
          data.status != 'error'
            ? data.results
            : [{id: 0, name: `${data.message}`}];
      });

    this.districtChangeSubject
      .pipe(
        debounceTime(300),
        switchMap((district_code) => this.AresService.getWards(district_code))
      )
      .subscribe((data) => {
        this.wards =
          data.status != 'error'
            ? data.results
            : {id: 0, name: `${data.message}`, status: false};
        this.isWardDataLoaded = data.status != 'error' ? true : false;
        // if (this.wards && this.wards.status != false) {
        //   this.customersForm
        //     ?.get('ward_code')
        //     ?.setValidators(Validators.required);
        //   this.customersForm?.get('ward_code')?.updateValueAndValidity();
        // } else {
        //   console.log(this.wards);
        //   this.customersForm.value.ward_code = '';
        // }
      });
  }

  onProvinceChange(): void {
    // this.AresService.getDistricts(Number(this.customersForm.value.province_code)).subscribe(data => {
    //   this.districts = data.results;
    // });
    this.provinceChangeSubject.next(
      Number(this.customersForm.value.province_code)
    );
  }

  onDistrictChange(): void {
    // this.AresService.getWards(Number(this.customersForm.value.district_code)).subscribe(data => {
    //   this.wards = data.results;
    //   console.log(data);

    // });
    this.districtChangeSubject.next(
      Number(this.customersForm.value.district_code)
    );
  }

  onSubmit() {
    const submitBtn = document.querySelector('#submitBtn');
    if (this.customersForm.valid) {
      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'disabled');
      }
      const dataToSend = {
        name: String(this.customersForm.value.name),
        type: Number(this.customersForm.value.type) || null,
        group_customer_id: Number(this.customersForm.value.group_supplier_id) || null,
        province_code: Number(this.customersForm.value.province_code) || null,
        district_code: Number(this.customersForm.value.district_code) || null,
        email: String(this.customersForm.value.email) || null,
        tel: String(this.customersForm.value.tel),
        status: Number(this.customersForm.value.status),
        address_detail: String(this.customersForm.value.address_detail) || null,
        note: String(this.customersForm.value.note) || null,
        ward_code: Number(this.customersForm.value.ward_code) || null,
        created_at: new Date(),
        updated_at: null,
      };

      // console.log(dataToSend);

      this.SuppliersService.create(dataToSend).subscribe(
        (response: any) => {
          if (response.status == true) {
            this.customersForm.reset();
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thành công!',
              text: 'Thêm khách hàng thành công',
              icon: 'success',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            this.router.navigate(['../suppliers/list']);
          } else {
            if (submitBtn) {
              submitBtn.removeAttribute('disabled');
            }
            // console.log(response);
            const errorMessages = [];
            for (const key in response.meta.errors) {
              const messages = response.meta.errors[key];
              for (const message of messages) {
                errorMessages.push(`${key}: ${message}`);
              }
            }
            this.showNextMessage(errorMessages);
            // for (const message of errorMessages) {
            //   Swal.fire({
            //     toast: true,
            //     position: 'top-end',
            //     showConfirmButton: false,
            //     timer: 3000,
            //     title: 'Thất bại!',
            //     text: message,
            //     icon: 'error',
            //     timerProgressBar: true,
            //     didOpen: (toast) => {
            //       toast.addEventListener('mouseenter', Swal.stopTimer);
            //       toast.addEventListener('mouseleave', Swal.resumeTimer);
            //     },
            //   });
            // }

          }
        },
        (error) => {
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
        }
      });
    }
  }

}
