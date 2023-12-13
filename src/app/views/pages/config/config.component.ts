import { Component, OnInit, TemplateRef } from '@angular/core';
import { ConfigService } from '../../../service/config/config.service';
import { Router } from '@angular/router';
import { BusinessField } from '../../../interface/business-field/business-field';
import { Tenant } from '../../../interface/tenant/tenant';
import { BusinessFieldService } from '../../../service/business-field/business-field.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AresService } from 'src/app/service/ares/ares.service';
import { Config } from '../../../interface/config/config';
import { SettingService } from '../../../service/setting/setting.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../service/auth/auth.service';
import { PricingService } from '../../../service/pricing/pricing.service';
import { SubcriptionOrderService } from '../../../service/subcription-order/subcription-order.service';

@Component({
  selector: 'app-config',
  templateUrl: 'config.component.html',
  styleUrls: ['config.component.scss']
})
export class ConfigComponent implements OnInit {
  private provinceChangeSubject = new Subject<number>();
  private districtChangeSubject = new Subject<number>();
  isLoading = false;

  provinces: any = [];
  districts: any = [];
  wards: any = [];

  errorMessages: any = [];

  isWardDataLoaded: boolean = false;

  businessFields: BusinessField[];

  tenant: Tenant;

  types = [
    {
      value: 0,
      name: 'Nâng cấp',
    },
    {
      value: 1,
      name: 'Gia hạn',
    },
  ];

  config: any;

  order: {
    name: string;
    tel: any;
    type: number;
    pricing_id: string;
  } = {
    name: '',
    tel: '',
    type: 1,
    pricing_id: '',
  };

  businessTypes = [
    {
      value: 0,
      name: 'Hộ gia đình',
    },
    {
      value: 1,
      name: 'Cá nhân',
    },
  ];

  configForm = new FormGroup({
    business_name: new FormControl('', [Validators.required]),
    tel: new FormControl('', [
      Validators.pattern(/^(03|05|07|08|09)+([0-9]{8})$/),
    ]),
    email: new FormControl('', Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)),
    business_field_code: new FormControl('', [Validators.required]),
    business_type: new FormControl(''),
    business_registration: new FormControl(''),
    license_date: new FormControl(''),
    license_address: new FormControl(''),
    province_code: new FormControl(''),
    district_code: new FormControl(''),
    ward_code: new FormControl(''),
    address_detail: new FormControl('', [Validators.required]),
  });

  pricings: any;

  constructor(
    private router: Router,
    private configService: ConfigService,
    private businessFieldService: BusinessFieldService,
    private AresService: AresService,
    private settingService: SettingService,
    private modalService: NgbModal,
    private authService: AuthService,
    private pricingService: PricingService,
    private subcriptionOrderService: SubcriptionOrderService
  ) {
    this.tenant = this.settingService.tenant;
    this.order.name = this.tenant.name;
    this.order.tel = this.authService.user.tel ?? '';
    this.order.pricing_id = this.tenant.pricing.id;
  }

  ngOnInit(): void {

    this.getConfig();
    this.onProvinceChange();
    this.onDistrictChange();
    this.getBusinessFields();
    this.getPricing();


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
            console.log(data);
        this.isWardDataLoaded = data.status != 'error' ? true : false;
        if (this.wards && this.wards.status != false) {
          this.configForm
            ?.get('ward_code')
            ?.setValidators(Validators.required);
          this.configForm?.get('ward_code')?.updateValueAndValidity();
        } else {
          // console.log(this.wards);
          this.configForm.value.ward_code = '';
        }
      });




  }


  getBusinessFields() {
    this.businessFieldService.getBusinessFields().subscribe((response: any) => {
      this.businessFields = response.payload;
    });
  }

  getPricing() {
    this.pricingService.list.subscribe((response: any) => {
      this.pricings = response.payload;
    });
  }

  getConfig() {
    this.isLoading = true;
    this.configService.getConfig().subscribe((response: any) => {
      this.config = response.payload;
      // console.log(this.config);
      console.log(response.payload);



      this.config.province_code = Number(this.config.province_code);
      this.config.istrict_code = Number(this.config.district_code);
      this.config.ward_code = Number(this.config.ward_code);
      this.configForm.patchValue({
        ...this.config,
        business_name: this.config.business_name,
        tel: this.config.tel,
        email: this.config.email,
        business_field_code: this.config.business_field_code,
        business_type: this.config.business_type,
        business_registration: this.config.business_registration,
        license_date: this.config.license_date,
        license_address: this.config.license_address,
        address_detail: this.config.address_detail,
      });
      this.onProvinceChange();
      this.onDistrictChange();

      this.isLoading = false;

    });
  }

  onProvinceChange(): void {
    console.log(this.config.province_code);
    this.provinceChangeSubject.next(
      this.config.province_code
    );
  }

  onDistrictChange(): void {
    console.log(this.config.district_code);
    this.districtChangeSubject.next(
      Number(this.configForm.value.district_code)
    );
  }


  onSubmit() {
    this.errorMessages = [];

    if (this.configForm.valid) {
      const data = this.configForm.value;

      const businessFieldId = this.businessFields.find(
        (businessField: BusinessField) =>
          businessField.code == data.business_field_code
      )?.id;

      const formData = {
        id: String(this.config.id),
        business_name: String(data.business_name),
        tel: data.tel,
        business_field_code: String(data.business_field_code),
        business_field_id: String(businessFieldId),
        business_type: data.business_type ?? null,
        business_registration: data.business_registration ?? null,
        license_date: data.license_date ?? null,
        address_detail: String(data.address_detail),
        province_code: data.province_code ? Number(data.province_code) : '',
        district_code: data.province_code ? Number(data.province_code) : '',
        license_address: String(data.license_address),
        ward_code: data.ward_code ? Number(data.ward_code) : '',
      };

      this.configService.update(formData).subscribe(
        (response: any) => {
          if (response.status == true) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Cập nhật thành công',
              icon: 'success',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            this.router.navigate([`../setting/`]);
          } else {
            // console.log(response);
            const errorMessages = [];
            if (response.meta && typeof response.meta === 'object') {
              for (const key in response.meta.errors) {
                // errorMessages.push(`${response.meta}`);
                const messages = response.meta.errors[key];
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
          // console.log(error.error.meta);
          const errorMessages = [];
          if (error.error.meta && typeof error.error.meta === 'object') {
            for (const key in error.error.meta.errors) {
              // errorMessages.push(`${response.meta}`);
              const messages = error.error.meta.errors[key];
              for (const message of messages) {
                errorMessages.push(`${key}: ${message}`);
              }
            }
          } else {
            errorMessages.push(`${error.error.meta}`);
          }
          this.showNextMessage(errorMessages);
        }
      );
    }
  }

  handleDate = (date: any) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const dt = dateObj.getDate();
    return `${dt < 10 ? '0' + dt : dt}/${
      month < 10 ? '0' + month : month
    }/${year}`;
  };

  openBasicModal(content: TemplateRef<any>) {
    this.modalService
      .open(content, {})
      .result.then((result) => {
        // console.log(result);
        if (result == 'by: save button') {
          const dataSend = {
            name: this.order.name,
            tel: this.order.tel,
            pricing_id: this.order.pricing_id,
            type: this.order.type,
            tenant_id: this.tenant.id,
          };

          // console.log(dataSend);

          if (
            dataSend.name &&
            dataSend.tel &&
            dataSend.pricing_id &&
            dataSend.type !== null
          ) {
            this.subcriptionOrderService
              .create(dataSend)
              .subscribe((response: any) => {
                if (response.status) {
                  Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    title: 'Gửi yêu cầu hỗ trợ thành công!',
                    text: 'Nhân viên của NextGo sẽ sớm liên hệ lại với bạn!',
                    icon: 'success',
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.addEventListener('mouseenter', Swal.stopTimer);
                      toast.addEventListener('mouseleave', Swal.resumeTimer);
                    },
                  });

                  this.order = {
                    name: '',
                    tel: '',
                    pricing_id: '',
                    type: 0,
                  };
                  setTimeout(() => {
                    window.location.reload();
                  }, 1200);
                } else {
                  // console.log(response);
                  const errorMessages = [];
                  for (const key in response.meta.errors) {
                    const messages = response.meta.errors[key];
                    for (const message of messages) {
                      errorMessages.push(`${key}: ${message}`);
                    }
                  }
                  Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    title: 'Có lỗi xảy ra!',
                    text: `${errorMessages}`,
                    icon: 'error',
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.addEventListener('mouseenter', Swal.stopTimer);
                      toast.addEventListener('mouseleave', Swal.resumeTimer);
                    },
                  });
                }
              });
          } else {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thất bại!',
              text: 'Vui lòng nhập đầy đủ thông tin để được hỗ trợ',
              icon: 'error',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
          }
        }

        // this.basicModalCloseResult = 'Modal closed' + result;
      })
      .catch((res) => {});
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
