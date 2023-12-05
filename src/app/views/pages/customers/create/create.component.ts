import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomersService } from 'src/app/service/customers/customers.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { GroupCustomersService } from 'src/app/service/group_customers/group-customers.service';
import { AresService } from 'src/app/service/ares/ares.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
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
    type: new FormControl(0),
    dob: new FormControl(''),
    group_customer_id: new FormControl(''),
    province_code: new FormControl(''),
    district_code: new FormControl(''),
    ward_code: new FormControl(''),
    email: new FormControl(''),
    tel: new FormControl('', Validators.required),
    status: new FormControl(1),
    address_detail: new FormControl(''),
    note: new FormControl(''),
    gender: new FormControl(0),
  });

  codeProvince: any;
  codeDistrict: any;
  codeWard: any;
  province: any;
  district: any[] = [];
  ward: any[] = [];

  constructor(
    private CustomersService: CustomersService,
    private GroupCustomersService: GroupCustomersService,
    private AresService: AresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.types = [
      { id: 0, name: 'Cá nhân' },
      { id: 1, name: 'Doanh nghiệp' },
    ];

    this.status = [
      { id: 0, name: 'Kích hoạt' },
      { id: 1, name: 'Không kích hoạt' },
    ];

    this.GroupCustomersService.GetData().subscribe((data: any) => {
      this.GroupsCustomers = data.payload.data;
    });

    this.AresService.getProvinces().subscribe((data: any) => {
      this.provinces =
        data.status != 'error'
          ? data.results
          : [{ id: 0, name: `${data.message}` }];
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
            : [{ id: 0, name: `${data.message}` }];
            this.district = data.results
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
            : { id: 0, name: `${data.message}`, status: false };
            this.ward = data.results;
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
      // this.codeDistrict =
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
    if (this.customersForm.valid) {
      // const nameDistrict = this.district.find(item => item.id == this.codeDistrict).name;
      // const nameWard = this.ward.find(item => item.id == this.codeWard).name;
      const dataToSend = {
        name: String(this.customersForm.value.name),
        type: Number(this.customersForm.value.type) || 0,
        dob: String(this.customersForm.value.dob) || null,
        group_customer_id: Number(this.customersForm.value.group_customer_id) || null,
        province_code: Number(this.customersForm.value.province_code) || null,
        gender: Number(this.customersForm.value.gender),
        district_code: Number(this.customersForm.value.district_code) || null,
        email: String(this.customersForm.value.email) || null,
        tel: String(this.customersForm.value.tel),
        status: Number(this.customersForm.value.status),
        address_detail: String(this.customersForm.value.address_detail ) || null,
        note: String(this.customersForm.value.note) || null,
        ward_code: Number(this.customersForm.value.ward_code) || null,
        created_at: new Date(),
        updated_at: null,
      };
      // + ', '  +  this.provinces[this.codeProvince].name 
      // + nameWard + ', ' + nameDistrict + ', '
      // console.log(nameDistrict, nameWard);

      console.log(dataToSend);

      this.CustomersService.create(dataToSend).subscribe(
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
            this.router.navigate(['../customers/list']);
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
          console.log(error);
          Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
        }
      );
    } else {
      alert('Không để trống');
    }
  }

  showNextMessage(errorMessages : any) {
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
