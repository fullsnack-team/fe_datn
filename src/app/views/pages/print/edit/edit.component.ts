import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ParamMap } from '@angular/router';
import {
  debounceTime,
  switchMap,
  distinctUntilChanged,
  map,
} from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationsService } from 'src/app/service/locations/locations.service';
import { PrintService } from 'src/app/service/print/print.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  oldForm: any;
  listLocation: any;
  salesUnit: any[] = [];
  printSize: any[] = [];
  public defaultForm: any;
  public myContent: any;
  public myContentPreview: SafeHtml;
  isLoading = true;
  public config = {
    height: '700px',
    toolbar: [
      [
        'Source',
        '-',
        'Bold',
        'Italic',
        'Underline',
        '-',
        'Cut',
        'Copy',
        'Paste',
        '-',
        'Undo',
        'Redo',
        '-',
        'Find',
        'Replace',
        '-',
        'SelectAll',
        '-',
        'JustifyLeft',
        'JustifyCenter',
        'JustifyRight',
        'JustifyBlock',
        '-',
        'BulletedList',
        'NumberedList',
        '-',
        'Flash',
        'Table',
        'HorizontalRule',
        'Smiley',
        'SpecialChar',
        '-',
        'Styles',
        'Format',
        'Font',
        'FontSize',
        '-',
        'TextColor',
        'BGColor',
        '-',
      ],
    ],
  };

  constructor(
    private _locationService: LocationsService,
    private modalService: NgbModal,
    private _printService: PrintService,
    private _router: Router,
    private sanitizer: DomSanitizer
  ) {
    this._printService.GetOneRecord(`1`).subscribe((res) => {
      if (res.status == true) {
        this.oldForm = res.payload.form;
        this.myContentPreview = this.getSafeHtml(this.oldForm);
        // console.log(this.oldForm);
      }
    });
    this.defaultForm = `
    <div>
<p><strong>{Ten_Cua_hang}</strong></p>

<p>{Ten_Chi_Nhanh} - {Dia_Chi_Chi_Nhanh}</p>

<p>{Dien_Thoai_Chi_Nhanh}</p>

<hr />
<p>&nbsp;</p>

<h2 style="text-align:center"><strong>H&Oacute;A ĐƠN B&Aacute;N H&Agrave;NG</strong></h2>

<p>&nbsp;</p>

<div>
<div>
<table border="0" cellpadding="1" cellspacing="1" style="width:100%">
	<tbody>
		<tr>
			<td><strong>Ng&agrave;y: </strong>{Ngay_Tao}</td>
			<td><strong>HĐ: {Ma_Don_Hang}</strong></td>
		</tr>
		<tr>
			<td><strong>Nh&acirc;n vi&ecirc;n: </strong>&nbsp;{Nguoi_Phu_Trach}</td>
			<td>&nbsp;</td>
		</tr>
	</tbody>
</table>

<p>&nbsp;</p>
</div>
</div>

<div>
<table align="center" border="0" cellpadding="1" cellspacing="1" style="width:100%">
	<tbody>
		<tr>
			<td style="text-align:justify; width:40%">
			<h3><strong>Sản phẩm</strong></h3>
			</td>
			<td style="text-align:justify">
			<h3><strong>Đơn gi&aacute;</strong></h3>
			</td>
			<td style="text-align:justify">
			<h3><strong>Số lượng</strong></h3>
			</td>
			<td style="text-align:justify">
			<h3><strong>Th&agrave;nh tiền</strong></h3>
			</td>
		</tr>
		<tr>
			<td colspan="4">{Listproducts}</td>
		</tr>
		<tr>
			<td>KM</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>{Chiet_khau_Phien_Ban}</td>
		</tr>
		<tr>
			<td>Thuế SP</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>{Thue_Phien_Ban}</td>
		</tr>
		<tr>
			<td>Cộng tiền h&agrave;ng</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>{Tong_Tien_Hang}</td>
		</tr>
		<tr>
			<td>Chiết khấu SP</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>{Tong_Chiet_Khau_San_Pham}</td>
		</tr>
		<tr>
			<td>Chiết khấu đơn</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>{Chiet_Khau_Don_Hang}</td>
		</tr>
		<tr>
			<td>Tổng tiền thuế</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>{Tong_Thue}</td>
		</tr>
		<tr>
			<td>Ph&iacute; kh&aacute;c</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>{Phi_Khac}</td>
		</tr>
		<tr>
			<td>
			<h3><strong>TỔNG TIỀN</strong></h3>
			</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>{Tong_Can_Thanh_Toan}</td>
		</tr>
		<tr>
			<td>Tiền kh&aacute;ch đưa</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>{Khach_Thanh_Toan}</td>
		</tr>
		<tr>
			<td>Ghi nợ</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>{Tien_No}</td>
		</tr>
		<tr>
			<td>Tiền trả lại</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>{Tien_Tra}</td>
		</tr>
		<tr>
			<td>
			<h4><strong>Kh&aacute;ch h&agrave;ng: </strong></h4>
			</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>{Ten_Khach_Hang}</td>
		</tr>
		<tr>
			<td>
			<h4><strong>SĐT:&nbsp;&nbsp;</strong></h4>
			</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>{Dien_Thoai_Khach}</td>
		</tr>
	</tbody>
</table>

<p>&nbsp;</p>

<hr />
<p>&nbsp;</p>
</div>

<h3 style="text-align:center"><strong>CẢM ƠN QU&Yacute; KH&Aacute;CH V&Agrave; HẸN GẶP LẠI</strong></h3>

<h3 style="text-align:center"><strong>Powered by NextShop</strong></h3>
</div>

        <script type="text/javascript">
            function checkAndHideId(targetId, condition, containerIds) {
              var target = document.getElementById(targetId);
              var targetValue = target.innerHTML.trim();
              if (targetValue == "&nbsp;" || targetValue == condition) {
                for (const containerId of containerIds) {
                  var container = document.getElementById(containerId);
                  container.style.display = "none";
                }
              }
              return;
            }
            function checkAndHideClass(containerClass, condition, targetClass) {
              var containers = document.getElementsByClassName(containerClass);
              for (const container of containers) {
                var targets = container.getElementsByClassName(targetClass);
                if (targets) {
                  if (
                    targets[0] &&
                    (targets[0].innerHTML.trim() == "&nbsp;" ||
                      targets[0].innerHTML.trim() == condition)
                  ) {
                    container.style.display = "none";
                  }
                }
              }
              return;
            }
            checkAndHideId("mc_address", "", ["mc_address"]);
            checkAndHideId("mc_phone", "", ["mc_phone"]);
            checkAndHideId("bill_debt", "0", ["bill_debt_container"]);
            checkAndHideId("customer_name", "Khách vãng lai", [
              "customer_name_container",
              "bill-bottom-dash-line",
            ]);
            checkAndHideId("customer_name", "Khách vãng lai", [
              "customer_phone_container",
            ]);
            checkAndHideClass(
              "bill_item_promotion_container",
              "0",
              "bill_item_promotion"
            );
            checkAndHideClass("bill_item_tax_container", "0", "bill_item_tax");
        </script>
   `;

    this._locationService.GetData().subscribe(
      (res: any) => {
        this.isLoading = true;
        if (res.status == true) {
          this.listLocation = res.payload;
          this.isLoading = false;
          // console.log(this.listLocation);
        }
      },
      (error) => {
        Swal.fire('Lỗi!', 'Có lỗi xảy ra khi load chi nhánh.', 'error');
      }
    );
  }

  onChange({ editor }: any) {
    this.myContentPreview = this.getSafeHtml(editor.getData());
  }

  ngOnInit(): void {
    this.salesUnit = [
      {
        id: 0,
        name: 'Đơn bán hàng',
      },
    ];

    this.printSize = [
      {
        id: 0,
        name: 'Khổ in A4',
      },
      {
        id: 1,
        name: 'Khổ in A5',
      },
      {
        id: 2,
        name: 'Khổ in K57',
      },
      {
        id: 3,
        name: 'Khổ in K80',
      },
    ];
  }
  openXlModal(content: TemplateRef<any>) {
    this.modalService
      .open(content, { size: 'xl' })
      .result.then((result) => {
        console.log('Modal closed' + result);
      })
      .catch((res) => { });
  }

  onSubmit() {
    // this.submitEvent.emit();
    const dataSend = {
      id: 1,
      name: 'Đơn bán hàngg',
      form: JSON.parse(JSON.stringify(this.oldForm)),
      default: 0,
    };
    console.log(dataSend);

    this._printService.update(dataSend).subscribe(
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
          this._router.navigate(['../print']);
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
      (error: any) => {
        // console.log(error);
        if (error.error.status == false) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: 'Lỗi!',
            text: `${error.error.meta.errors.name[0]}`,
            icon: 'error',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        }
      }
    );
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  toDefault() {
    Swal.fire({
      title: 'Biểu mẫu này sẽ trở về mặc định?',
      text: 'Bạn sẽ không thể hoàn tác lại hành động này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, tiến hành!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.oldForm = this.defaultForm;
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: 'Thành công!',
          text: 'Biểu mẫu đã trở về mặc định',
          icon: 'success',
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
      }
    });
  }
}
