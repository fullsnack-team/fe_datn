import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SuppliersService } from 'src/app/service/suppliers/suppliers.service';
import { GroupSuppliersService } from 'src/app/service/group_suppliers/group-suppliers.service';
import { AresService } from 'src/app/service/ares/ares.service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  id: string;
  isLoading = false;
  types: any = [];
  status: any = [];
  provinces: any = [];
  districts: any = [];
  wards: any = [];
  GroupsCustomers: any = [];
  isWardDataLoaded: boolean = false;
  private provinceChangeSubject = new Subject<number>();
  private districtChangeSubject = new Subject<number>();
  customersForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl(1),
    group_supplier_id: new FormControl(''),
    province_code: new FormControl(''),
    district_code: new FormControl(''),
    ward_code: new FormControl(''),
    email: new FormControl(''),
    tel: new FormControl('', Validators.required),
    status: new FormControl(1),
    address_detail: new FormControl(''),
    note: new FormControl(''),
  });
  constructor(
    private SuppliersService: SuppliersService,
    private GroupSuppliersService: GroupSuppliersService,
    private AresService: AresService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.GroupSuppliersService.GetData().subscribe((data: any) => {
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
        this.isWardDataLoaded = data.status != 'error' ? true : false;
        if (this.wards && this.wards.status != false) {
          this.customersForm
            ?.get('ward_code')
            ?.setValidators(Validators.required);
          this.customersForm?.get('ward_code')?.updateValueAndValidity();
        } else {
          console.log(this.wards);
          this.customersForm.value.ward_code = '';
        }
      });

    this.route.paramMap.subscribe((queryParams) => {
      const id = queryParams.get('id');
      if (id !== null) {
        this.id = id;
        this.isLoading = true;
        this.SuppliersService.GetOneRecord(id).subscribe(
          (data) => {
            const customerData = data.payload;
            // Chuyển đổi giá trị gender sang kiểu number
            customerData.gender = String(customerData.gender);
            this.customersForm.patchValue(customerData);
            this.onProvinceChange();
            this.onDistrictChange();
            this.isLoading = false; // Stop loading
          },
          (error) => {
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
          }
        );
      } else {
        this.router.navigate(['../suppliers/list']);
      }
    });


    
  }

  
  onProvinceChange(): void {
    this.provinceChangeSubject.next(
      Number(this.customersForm.value.province_code)
    );
  }

  onDistrictChange(): void {
    this.districtChangeSubject.next(
      Number(this.customersForm.value.district_code)
    );
  }
  onSubmit() {
    if (this.customersForm.valid) {
      const dataToSend = {
        ...this.customersForm.value,
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
        updated_at: new Date().toISOString(),
        id: this.id,
      };

      this.SuppliersService.update(dataToSend).subscribe(
        (response) => {
          if (response.status == true) {
            this.customersForm.reset();
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thành công!',
              text: 'Cập nhật khách hàng thành công',
              icon: 'success',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            this.router.navigate(['../suppliers/list']);
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

            // Swal.fire({
            //   toast: true,
            //   position: 'top-end',
            //   showConfirmButton: false,
            //   timer: 3000,
            //   title: 'Thất bại!',
            //   text: message,
            //   icon: 'error',
            //   timerProgressBar: true,
            //   didOpen: (toast) => {
            //     toast.addEventListener('mouseenter', Swal.stopTimer);
            //     toast.addEventListener('mouseleave', Swal.resumeTimer);
            //   },
            // });
          }
        },
        (error) => {
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
