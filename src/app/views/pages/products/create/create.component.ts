import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { ProductsService } from 'src/app/service/products/products.service';
import { CategoriesService } from 'src/app/service/categories/categories.service';
import { WarrantiesService } from 'src/app/service/warranties/warranties.service';
import { ItemUnitsService } from 'src/app/service/item_units/item-units.service';
import { BrandsService } from 'src/app/service/brands/brands.service';
import { of } from 'rxjs';
import { map, expand, take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  isLoading = false;
  item_units: any;
  categories: any;
  brands: any;
  warranties: any;
  manage_type: any;
  dataAttributes: string = '';
  // valuesAtribute: { id: number, text: string }[] = [];
  simpleItems: {
    name: string;
    attribute_values: { id?: number; value: string }[];
    newItemText: string;
  }[] = [];
  nameAttributes: string[] = [];
  countCreate = 0;
  indexOld: number;
  // valuesAtribute: {index : number,values :{ id: number, text: string }[]}[] = [];
  newItemText: string = '';
  weightValue: string = '';
  nextItemId: number = 1;
  form: FormGroup;
  rows: FormArray;

  statusVersionDefault : boolean = false;
  originalArray: any[] = [];

  dataValueVariable: any[];
  statusFormType = false;
  itemBoxTypeQuality: number = 1;
  itemBoxId: number = 1;
  itemBoxTypeQualityArray: any[] = Array(this.itemBoxTypeQuality).fill(null);
  productsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    weight: new FormControl(0),
    description: new FormControl(''),
    manage_type: new FormControl(0),
    brand_id: new FormControl(0),
    warranty_id: new FormControl(0),
    item_unit_id: new FormControl(0),
    category_id: new FormControl(0),
    status: new FormControl(1),
    image: new FormControl(''),
    attributes: new FormControl(this.simpleItems),
    variations: new FormControl(this.originalArray),
  });
  // this.simpleItems
  // this.originalArray
  constructor(
    private ProductsService: ProductsService,
    private router: Router,
    private ItemUnitsService: ItemUnitsService,
    private CategoriesService: CategoriesService,
    private BrandsService: BrandsService,
    private WarrantiesService: WarrantiesService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.countCreate == 0) {
      this.simpleItems.push({
        name: '',
        attribute_values: [],
        newItemText: '',
      });
      this.countCreate++;
      this.indexOld = 0;
    }
    this.manage_type = [
      { id: 0, name: 'Thường' },
      { id: 1, name: 'Theo Lô/HSD' },
    ];
    // this.ItemUnitsService.GetData().subscribe((data: any) => {
    //   this.item_units = data.payload.data;
    // });
    this.isLoading = true;
    //  this.ItemUnitsService.get().subscribe((data: any) => {
    //   this.item_units = data.payload.data;
    // });

    this.ItemUnitsService.GetData().subscribe((data: any) => {
      this.item_units = data.payload.data;
    });

    this.CategoriesService.GetData().subscribe((data: any) => {
      this.categories = data.payload.data;
    });

    this.BrandsService.GetData().subscribe((data: any) => {
      this.brands = data.payload.data;
    });

    this.WarrantiesService.GetData().subscribe((data: any) => {
      this.warranties = data.payload.data;
    });

    this.renderVersion({ status: false });
   
    this.isLoading = false;
  }
  createItemFormGroup(item: any): FormGroup {
    return this.fb.group({
      sku: [item.sku],
      barcode: [item.barcode],
      variation_name: [item.variation_name],
      display_name: [item.display_name],
      image: [item.image],
      price_import: [item.price_import],
      price_export: [item.price_export],
      status: [item.status],
    });
  }
  addAttributesForm() {
    this.itemBoxTypeQuality++;
    this.itemBoxTypeQualityArray = Array(this.itemBoxTypeQuality).fill(null);
    this.simpleItems.push({
      name: '',
      attribute_values: [],
      newItemText: '',
    });
  }

  renderVersion({
    dataDefalut = [
      {
        sku: null,
        barcode: null,
        variation_name: "Mặc định",
        display_name:  "Mặc định",
        image: null,
        price_import: 0,
        price_export: 0,
        status: 1,
      },
    ],
    status = true,
  } = {}) {
    console.log(dataDefalut);
    
    if (status) {
      let combinedArray$ = of(
        this.simpleItems[0].attribute_values.map((item) => ({
          sku: null,
          barcode: null,
          variation_name: item.value,
          display_name: item.value,
          image: null,
          price_import: 0,
          price_export: 0,
          status: 1,
        }))
      ).pipe(
        expand((acc, index) => {
          if (index >= this.simpleItems.length - 1) {
            return of([]);
          }
          let values = this.simpleItems[index + 1].attribute_values.map(
            (item) => item.value
          );
          return of(
            acc.flatMap((item) =>
              values.map((value) => ({
                sku: null,
                barcode: null,
                variation_name: `${item.variation_name}-${value}`,
                display_name: `${item.variation_name}-${value}`,
                image: null,
                price_import: 0,
                price_export: 0,
                status: 1,
              }))
            )
          );
        }),
        take(this.simpleItems.length)
      );

      this.form = this.fb.group({
        rows: this.fb.array([]),
      });
      this.rows = this.form.get('rows') as FormArray;

      combinedArray$.subscribe((combinedArray) => {
        console.log(combinedArray);

        this.originalArray = combinedArray;
        this.productsForm.get('variations')!.setValue(combinedArray);
        while (this.rows.length !== 0) {
          this.rows.removeAt(0);
        }

        combinedArray.forEach((item) => {
          this.rows.push(this.createItemFormGroup(item));
        });

        this.rows.valueChanges.subscribe((value) => {
          this.originalArray = value; // Should now also print 4 arrays
          this.productsForm.value.variations = value;
        });
      });
    } else {
      console.log(dataDefalut);

      this.form = this.fb.group({
        rows: this.fb.array([]),
      });
      this.rows = this.form.get('rows') as FormArray;
      this.originalArray = dataDefalut;
      this.productsForm.get('variations')!.setValue(dataDefalut);
      if (this.rows) {
        while (this.rows.length !== 0) {
          this.rows.removeAt(0);
        }
      }

      dataDefalut.forEach((item: any) => {
        this.rows.push(this.createItemFormGroup(item));
      });

      this.rows.valueChanges.subscribe((value) => {
        this.originalArray = value; // Should now also print 4 arrays
        this.productsForm.value.variations = value;
      });
    }
  }
  removeAttributesForm(index: number) {
    if (this.itemBoxTypeQuality > 1) {
      this.itemBoxTypeQuality--;
      this.itemBoxTypeQualityArray.splice(index, 1);
      this.simpleItems.splice(index, 1);
      this.renderValue();
      // console.log(index);
      console.log(this.simpleItems);
    }
  }
  addItem(index: number) {
    // console.log(index);
    if (
      this.simpleItems[index].newItemText.trim() !== '' &&
      this.simpleItems[index].attribute_values
    ) {
      if (
        this.simpleItems[index].attribute_values.some(
          (item) => item.value === this.simpleItems[index].newItemText
        )
      ) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: 'Thất bại!',
          text: 'Giá trị này đã tồn tại!',
          icon: 'error',
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
      } else {
        this.simpleItems[index].attribute_values.push({
          value: this.simpleItems[index].newItemText,
        });
        this.simpleItems[index].newItemText = '';
        console.log(this.simpleItems);
        this.statusVersionDefault = true;
        this.CheckStatusform();
      }
    }
  }

  removeItem(index: number, indexValue: number) {
    // console.log(this.simpleItems);
    this.simpleItems[indexValue].attribute_values.splice(index, 1);
  }

  CheckStatusform() {
    this.statusFormType = true;
    let nameAttributeTracker: { [key: string]: boolean } = {};
    for (let item of this.simpleItems) {
      if (item.name === '') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: 'Thất bại!',
          text: 'Thuộc tính không được để trống!',
          icon: 'error',
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        this.statusFormType = false;
        return;
      } else if (item.attribute_values.length === 0) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: 'Thất bại!',
          text: 'Giá trị không được để trống!',
          icon: 'error',
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        this.statusFormType = false;
        return;
      } else if (nameAttributeTracker[item.name]) {
        // If the nameAttribute is already in the tracker, it's a duplicate
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: 'Thất bại!',
          text: 'nameAttribute không được trùng!',
          icon: 'error',
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        this.statusFormType = false;
        return;
      }
      nameAttributeTracker[item.name] = true;
    }
  }

  renderValue() {
    this.dataValueVariable = this.simpleItems.map((value, index) => {
      return {
        name: value.name,
        value: value.attribute_values
          .map((data, i) => {
            return data.value;
          })
          .join(','),
      };
    });
    this.renderVersion();
  }
  openBasicModal(content: TemplateRef<any>) {
    this.modalService
      .open(content, {})
      .result.then((result) => {
        // this.dataAttributes = "Modal closed" + result
        // console.log('Modal closed with:', result);
        // console.log('Weight value:', this.weightValue);
        // console.log('abc:',this.simpleItems);
        if (result) {
          this.renderValue();
          this.CheckStatusform();
        }
      })
      .catch((res) => {});
  }

  onSubmit() {
    if (this.productsForm.valid) {
      // this.originalArray
      // value.forEach((item: any, index: number) => {
      //   if (item.sku) {
      //     console.log(`Item at index ${index} has SKU.`);
      //   } else {
      //     console.log(`Item at index ${index} has no SKU.`);
      //     // Gán giá trị ngẫu nhiên cho sku tại đây
      //     const skuControl = this.rows.controls[index].get('sku');
      //     if (skuControl) {
      //       skuControl.setValue(this.generateRandomString(10), {
      //         emitEvent: false,
      //       });
      //     }
      //   }
      // });
      
      const dataToSend = {
        ...this.productsForm.value,
        name: this.productsForm.value.name || '',
        status: Number(this.productsForm.value.status),
        attributes: this.checkAtribute(),
        variations: this.originalArray.map((item) => {
          const newItem = { ...item };
          if (newItem.sku === null) {
            newItem.sku = this.generateRandomString(10);
          }

          if(newItem.variation_name == "Mặc định" || newItem.display_name == "Mặc định" ){
            newItem.variation_name = this.productsForm.value.name;
            newItem.display_name = this.productsForm.value.name;
          }
          return newItem;
        }),
        created_at: new Date(),
        updated_at: null,
      };
      console.log(this.originalArray);
      console.log(dataToSend);
      this.ProductsService.create(dataToSend).subscribe(
        (response: any) => {
          if (response.status == true) {
            this.productsForm.reset();
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
            this.router.navigate(['../products/list']);
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
          console.log(error);
          Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
        }
      );
    } else {
      alert('Không để trống');
    }
  }

  checkAtribute(){
    if (this.simpleItems.every(item => item.name === '' && item.attribute_values.length === 0 && item.newItemText === '')) {
      return null;
  } else {
      return this.simpleItems;
  }
  }

  generateRandomString(length: number): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
