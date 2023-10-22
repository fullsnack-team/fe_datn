import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { LocationsService } from 'src/app/service/locations/locations.service';
import { AresService } from 'src/app/service/ares/ares.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  private readonly domain_name: String;
  status: any = [];
  is_main: any = [];
  private provinceChangeSubject = new Subject<number>();
  private districtChangeSubject = new Subject<number>();
  provinces: any = [];
  districts: any = [];
  wards: any = [];
  isWardDataLoaded: boolean = false;
  img: File | '';

  locationsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    image: new FormControl(''),
    description: new FormControl(''),
    tel: new FormControl('', Validators.required),
    email: new FormControl(''),

    province_code: new FormControl(''),
    district_code: new FormControl(''),
    ward_code: new FormControl(''),
    address_detail: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    is_main: new FormControl('', Validators.required),
  });

  constructor(
    private formBuilder: FormBuilder,
    private _locaService: LocationsService,
    private AresService: AresService,
    private router: Router
  ) {
    this.domain_name = environment.domain_name;
  }

  ngOnInit(): void {
    this.status = [
      { id: 0, name: 'Đóng cửa' },
      { id: 1, name: 'Hoạt động' },
    ];
    this.is_main = [
      { id: 0, name: 'Chi nhánh mặc định' },
      { id: 1, name: 'Chi nhánh phụ' },
    ];
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
      });
  }

  onProvinceChange(): void {
    this.provinceChangeSubject.next(
      Number(this.locationsForm.value.province_code)
    );
  }

  onDistrictChange(): void {
    this.districtChangeSubject.next(
      Number(this.locationsForm.value.district_code)
    );
  }

  onFileChange(event: any) {
    const files = event.target.files;

    if (files && files.length > 0) {
      const img = files[0];
      // console.log(this.img);

      // Kiểm tra loại tệp
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(img.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Loại tệp không hợp lệ. Chỉ chấp nhận các tệp JPG, PNG hoặc GIF.',
        }).then(() => {
          // Sau khi hiển thị lỗi, reset giá trị của input file
          event.target.value = '';
        });
        return;
      }

      // Kiểm tra kích thước tệp (ví dụ: không quá 5MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (img.size > maxSizeInBytes) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Kích thước tệp quá lớn. Vui lòng chọn một tệp nhỏ hơn 5MB.',
        }).then(() => {
          // Sau khi hiển thị lỗi, reset giá trị của input file
          event.target.value = '';
        });
        return;
      }

      // Lưu trữ tệp hình ảnh và tiếp tục xử lý nếu tệp hợp lệ
      this.img = img;
      console.log('Tệp hình ảnh hợp lệ.');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không có tệp nào được chọn.',
      }).then(() => {
        // Sau khi hiển thị lỗi, reset giá trị của input file
        event.target.value = '';
      });
      return;
    }
  }

  onSubmit() {
    if (this.locationsForm.valid) {
      const formData = new FormData();

      const locationsData = this.locationsForm.value;
      formData.append('domain_name', String(this.domain_name));
      if (this.locationsForm.value.image) {
      formData.append('image', this.img);
      }
      formData.append('name', String(locationsData.name));
      formData.append('email', String(locationsData.email));
      formData.append('tel', String(locationsData.tel));
      formData.append('status', String(locationsData.status));
      formData.append('is_main', String(locationsData.is_main));
      formData.append('address_detail', String(locationsData.address_detail));
      formData.append('created_by', '1');
      formData.append('province_code', String(locationsData.province_code));
      formData.append('district_code', String(locationsData.district_code));
      formData.append('ward_code', String(locationsData.ward_code));
      formData.append('description', String(locationsData.description));
      // console.log(this.img);

      this._locaService.createFormData(formData).subscribe(
        (response: any) => {
          if (response.status == true) {
            this.locationsForm.reset();
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thành công!',
              text: 'Thêm chi nhánh thành công',
              icon: 'success',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            this.router.navigate(['../locations/list']);
          } else {
            console.log(response);
            const errorMessages = [];
            for (const key in response.meta) {
              const messages = response.meta[key];
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
