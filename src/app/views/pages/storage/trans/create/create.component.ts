import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {Observable, Subject, debounceTime, map, of} from 'rxjs';

import {LocationsService} from 'src/app/service/locations/locations.service';
import {SearchProductService} from 'src/app/service/searchProduct/search-product.service';
import {StorageImportService} from 'src/app/service/storage/storage-import.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  isLoading = false;
  storageTransForm = new FormGroup({
    reason: new FormControl('', Validators.required),
    note: new FormControl(''),
    inventory_id_out: new FormControl('', Validators.required),
    inventory_id: new FormControl('', Validators.required),
    quantity: new FormControl(''),
  });
  inputSerach = new FormGroup({
    input: new FormControl(''),
  });
  input: any = {};
  products: any[] = [];
  editRowID: any = '';
  listProduct: any[] = [];

  //
  inventory: any[] = [];
  codeInventoryOut: number;
  codeInventoryIn: number;

  constructor(
    private _location: LocationsService,
    private _product: SearchProductService,
    private _storage: StorageImportService,
    private router: Router
  ) {
    this.isLoading = true;

    this._location.GetData().subscribe((res: any) => {
      this.inventory = res.payload;

    });
    this._storage.getAllInventory(null).subscribe((res: any) => {
      this.listProduct = res.payload;
      this.isLoading = false;

    });
  }

  ngOnInit(): void {
  }

  onInventoryOut() {
    // console.log(this.codeInventoryOut);
    // this.products = [];
    if (this.codeInventoryOut != null) {
      const dataSend = {
        inventory_id: this.codeInventoryOut,
      };
      this._storage.getAllVariation(dataSend).subscribe((res: any) => {
        this.listProduct = res.payload;
        // console.log(this.listProduct);
      });
    } else {
      this._storage.getAllVariation(null).subscribe((res: any) => {
        this.listProduct = res.payload;
      });
    }
    this.products = [];
  }

  Edit(val: any) {
    this.editRowID = val;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Ngăn chặn hành động mặc định của nút Enter
      // Bạn có thể thêm xử lý khác ở đây nếu cần
    }
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : this.listProduct
            .filter(
              (v) =>
                v.product_name_variation
                  .toLowerCase()
                  .indexOf(term.toLowerCase()) > -1
            )
            .slice(0, 10)
      )
    );
  formatter = (x: { product_name_variation: string }) =>
    x.product_name_variation;

  searchProduct() {
    console.log(this.input);

    if (this.input && (this.input.quantity === 0 || !('quantity' in this.input))) {
      this.showNextMessage(['Sản phẩm này có số lượng bằng 0 hoặc không có số lượng!']);
    }
    if (this.input != '' && this.input.id != undefined && this.input.quantity > 0) {
      // Kiểm tra xem sản phẩm vừa nhập có trùng với sản phẩm nào trong this.products không
      const existingProduct = this.products.find(
        (product) => product.variation_id === this.input.id
      );

      if (!existingProduct) {
        const data = {
          id: this.input.id,
          sku: this.input.sku,
          name: this.input.product_name_variation,
          variation_id: this.input.variation_id,
          inventory: this.input.quantity != '' ? this.input.quantity : 0,
          batch_id: 1,
          price: this.input.price_import,
          price_type: 0,
          quantity: 0,
        };
        this.products.push(data);
        this.inputSerach.reset();
      } else {
        this.inputSerach.reset();
      }

      // console.log(this.products);
    }else{
      this.showNextMessage(['Vui lòng kiểm tra lại tồn kho sản phẩm tại kho xuất']);
    }
  }

  resultTotal(e: any) {
    this.updateQuantity(
      this.products,
      +e.target.id,
      +e.target.value,
      e.target.name
    );
  }

  updateQuantity(array: any, id: number, newQuantity: any, name: string) {
    // console.log(name);

    const typeUpdate = name === 'quantity' ? 'quantity' : 'price';
    const resultType = name === 'quantity' ? 'price' : 'quantity';
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        array[i][typeUpdate] = newQuantity;
        array[i].result = newQuantity * array[i][resultType];
        // console.log(array[i]);
        break;
      }
    }
  }

  removeProduct(index: number): void {
    this.products.splice(index, 1);
  }

  onSubmit(): void {
    const submitBtn = document.querySelector('#submitBtn');
    if (this.storageTransForm.valid && this.products.length > 0) {
      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'disabled');
      }
      let flag = true;
      const dataSend = {
        reason: this.storageTransForm.value.reason,
        inventory_id_in: this.storageTransForm.value.inventory_id,
        inventory_id_out: this.storageTransForm.value.inventory_id_out,
        partner_id: null,
        partner_type: null,
        // trans_type: 2,
        note: this.storageTransForm.value.note,
        // status: 2,
        created_by: 1,
        inventory_transaction_details: JSON.parse(
          JSON.stringify(this.products)
        ),
      };

      this.products.forEach((value) => {
        // console.log(value);
        if (value.quantity == 0) {
          flag = false;
          this.showNextMessage(['Số lượng phải lớn hơn 0']);
        }
      });
      // console.log(dataSend);
      if (flag == true) {
        this._storage.createTrans(dataSend).subscribe(
          (response: any) => {
            if (response.status == true) {
              this.storageTransForm.reset();
              Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                title: 'Thành công!',
                text: 'Thêm đơn chuyển thành công',
                icon: 'success',
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer);
                  toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
              });
              this.router.navigate([
                // `../storage/trans/detail/${response.payload}`,
                `../storage/trans/list`,
              ]);
            } else {
              if (submitBtn) {
                submitBtn.removeAttribute('disabled');
              }
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
            if (submitBtn){
              submitBtn.removeAttribute('disabled');
            }
            // console.log(error);
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
          }
        );
      }
    } else {
      this.showNextMessage(['Sản phẩm không được để trống!'])
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
