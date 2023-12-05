import { Component, OnInit } from '@angular/core';
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
import { ChangeDetectionStrategy } from '@angular/core';

import { SuppliersService } from 'src/app/service/suppliers/suppliers.service';
import { LocationsService } from 'src/app/service/locations/locations.service';
import { Product } from 'src/app/interface/product/product';
import { SearchProductService } from 'src/app/service/searchProduct/search-product.service';
import { StorageImportService } from 'src/app/service/storage/storage-import.service';
import { StorageImport } from 'src/app/interface/storage/storage-import';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  listSupplier: any = [];
  listLocation: any[] = [];
  listProduct: any[] = [];
  products: any[] = [];
  input: any = {};
  editRowID: any = '';
  price: any;
  quantity: any;
  isLoading = false;
  totalMoney: number;
  storageImportForm = new FormGroup({
    reason: new FormControl('', Validators.required),
    note: new FormControl(''),
    partner_id: new FormControl('', Validators.required),
    inventory_id: new FormControl('', Validators.required),
    price: new FormControl(''),
    quantity: new FormControl(''),
  });
  inputSerach = new FormGroup({
    input: new FormControl(''),
  });
  constructor(
    private _supplier: SuppliersService,
    private _location: LocationsService,
    private _storage: StorageImportService,
    private router: Router,
    private _product: SearchProductService
  ) {
    this._supplier.GetData().subscribe((res: any) => {
      this.listSupplier = res.payload;
      console.log(this.listSupplier);
    });
    this._product.GetData().subscribe((res: any) => {
      this.listProduct = res.payload;
      console.log(this.listProduct);
    });

    this._location.GetData().subscribe((res: any) => {
      this.listLocation = res.payload;
      // console.log(this.listLocation);
    });
  }
  Edit(val: any) {
    this.editRowID = val;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
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
                  v.product_name_variation.toLowerCase().indexOf(term.toLowerCase()) >
                  -1
              )
              .slice(0, 10)
      )
    );
  formatter = (x: { product_name_variation: string }) => x.product_name_variation;

  searchProduct() {
    if (this.input != '' && this.input.id != undefined) {
      // Kiểm tra xem sản phẩm vừa nhập có trùng với sản phẩm nào trong this.products không
      const existingProduct = this.products.find(
        (product) => product.variation_id === this.input.id
      );

      if (!existingProduct) {
        const data = {
          id: this.input.id,
          name: this.input.product_name_variation,
          variation_id: this.input.id,
          batch_id: 1,
          price: this.input.price_import,
          price_type: 0,
          quantity: 0,
          result: 0,
        };
        this.products.push(data);
        this.inputSerach.reset();
      } else {
        this.inputSerach.reset();
      }

      console.log(this.products);
    }
  }

  calculateTotal(index1: number, index2: number): number {
    return index1 * index2;
  }
  calculateTotalPrice(): number {
    let total = 0;
    for (let i = 0; i < this.products.length; i++) {
      total += this.products[i].price * this.products[i].quantity;
    }
    return total;
  }
  removeProduct(index: number): void {
    this.products.splice(index, 1);
  }
  resultTotal(e: any) {
    this.updateQuantity(
      this.products,
      +e.target.id,
      +e.target.value,
      e.target.name
    );
    this.totalMoney = this.products.reduce((total: number, current: any) => {
      return total + current.result;
    }, 0);
  }
  updateQuantity(array: any, id: number, newQuantity: any, name: string) {
    console.log(name);

    const typeUpdate = name === 'quantity' ? 'quantity' : 'price';
    const resultType = name === 'quantity' ? 'price' : 'quantity';
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        array[i][typeUpdate] = newQuantity;
        array[i].result = newQuantity * array[i][resultType];
        console.log(array[i]);

        break;
      }
    }
  }

  onSubmit() {
    // If confirmed, delete the category
    if (this.storageImportForm.valid && this.products.length > 0) {
      const datasend = {
        reason: this.storageImportForm.value.reason,
        inventory_id: this.storageImportForm.value.inventory_id,
        partner_id: this.storageImportForm.value.partner_id,
        partner_type: 0,
        trans_type: 0,
        note: this.storageImportForm.value.note,
        status: 1,
        created_by: 1,
        inventory_transaction_details: JSON.parse(
          JSON.stringify(this.products)
        ),
      };
      console.log(datasend);
      this._storage.createData(datasend).subscribe(
        (response: any) => {
          if (response.status == true) {
            this.storageImportForm.reset();
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thành công!',
              text: 'Thêm đơn nhập thành công',
              icon: 'success',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            this.router.navigate([
              `../storage/import/detail/${response.payload}`,
            ]);
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
        (error) => {
          console.log(error);
          Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
        }
      );
    } else {
      alert('Sản phẩm không được để trống');
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
