import {Component, OnInit, TemplateRef} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import {ProductsService} from 'src/app/service/products/products.service';
import {CategoriesService} from 'src/app/service/categories/categories.service';
import {WarrantiesService} from 'src/app/service/warranties/warranties.service';
import {ItemUnitsService} from 'src/app/service/item_units/item-units.service';
import {BrandsService} from 'src/app/service/brands/brands.service';
import {of, Observable} from 'rxjs';
import {map, expand, take, last} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {Router, ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  id: string;
  isLoading = false;
  item_units: any;
  categories: any;
  brands: any;
  warranties: any;
  manage_type: any;
  dataAttributes: string = '';
  statusCheckVaribles: boolean = true;
  statusRequestvaribles: boolean = true;
  combinedArray$: Observable<any[]>;
  statusVersionDefault: boolean = false;
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

  originalArray: any[] = [];
  dataoldApi: any[] = [];
  varibles: any[] = [];
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
    status_attributes: new FormControl(this.statusCheckVaribles == true ? 0 : 1),
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
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
  }

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
      {id: 0, name: 'Thường'},
      {id: 1, name: 'Theo Lô/HSD'},
    ];
    // this.ItemUnitsService.GetData().subscribe((data: any) => {
    //   this.item_units = data.payload.data;
    // });
    //  this.ItemUnitsService.get().subscribe((data: any) => {
    //   this.item_units = data.payload.data;
    // });
    this.isLoading = true;
    this.ItemUnitsService.GetData().subscribe((data: any) => {
      this.item_units = data.payload;
    });

    this.CategoriesService.GetData().subscribe((data: any) => {
      this.categories = data.payload;
    });

    this.BrandsService.GetData().subscribe((data: any) => {
      this.brands = data.payload;
    });

    this.WarrantiesService.GetData().subscribe((data: any) => {
      this.warranties = data.payload;
    });

    this.route.paramMap.subscribe((queryParams) => {
      const id = queryParams.get('id');
      if (id !== null) {
        this.id = id;
        this.ProductsService.GetOneRecord(id).subscribe(
          (data) => {
            const customerData = data.payload;
            console.log(customerData);
            // Chuyển đổi giá trị gender sang kiểu number
            this.itemBoxTypeQuality = customerData.attributes.length;
            this.itemBoxTypeQualityArray = Array(this.itemBoxTypeQuality).fill(
              null
            );
            // customerData.variations
            this.varibles = customerData.variations;
            this.dataoldApi = JSON.parse(JSON.stringify(customerData.attributes));
            this.simpleItems = JSON.parse(JSON.stringify(customerData.attributes));
            this.renderValue(this.simpleItems, customerData.variations);
            if (customerData.variations.length == 1 && customerData.variations[0].variation_name == customerData.name) {
              this.statusRequestvaribles = false;
            }
            // this.statusRequestvaribles = customerData.variations.length == 1 ? false : true;
            this.productsForm.patchValue(customerData);
            this.isLoading = false; // Stop loading
          },
          (error) => {
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
          }
        );
      } else {
        this.router.navigate(['../customers/list']);
      }
    });
  }


  createItemFormGroup(item: any): FormGroup {
    let formGroup = this.fb.group({
      id: [item.id],
      product_id: [item.product_id],
      sku: [item.sku],
      barcode: [item.barcode],
      variation_name: [item.variation_name],
      display_name: [item.display_name],
      image: [item.image],
      price_import: [item.price_import],
      price_export: [item.price_export],
      status: [item.status],
    });

    formGroup.get('sku')!.disable();

    console.log(this.statusRequestvaribles);

    if (this.statusRequestvaribles == false) {
      formGroup.get('display_name')!.disable();
    }

    return formGroup;
  }

  addAttributesForm() {
    this.itemBoxTypeQuality++;
    this.itemBoxTypeQualityArray = Array(this.itemBoxTypeQuality).fill(null);
    this.simpleItems.push({
      name: '',
      attribute_values: [],
      newItemText: '',
    });
    this.CheckStatusform();
  }

  renderVersion(DataResult: any = [], dataOld: any = [], status: boolean) {
    console.log(dataOld);
    this.combinedArray$;
    if (DataResult.length > 0 || dataOld.length > 0) {
      // this.combinedArray$ = of(
      //   DataResult[0].attribute_values.map((item: any) => {
      //     if(item.id == undefined){
      //       return  ({
      //         sku: null,
      //         barcode: null,
      //         variation_name: item.value,
      //         display_name: item.value,
      //         image: null,
      //         price_import: 0,
      //         price_export: 0,
      //         status: 1,
      //       })
      //     }else {
      //       return ({
      //         id: item.id ,
      //         sku: null,
      //         barcode: null,
      //         variation_name: item.value,
      //         display_name: item.value,
      //         image: null,
      //         price_import: 0,
      //         price_export: 0,
      //         status: 1,
      //       })
      //     }

      //   }

      //   )
      // ).pipe(
      //   expand((acc, index) => {
      //     if (index >= this.simpleItems.length - 1) {
      //       return of([]);
      //     }
      //     let values = this.simpleItems[index + 1].attribute_values.map(
      //       (item) => item.value
      //     );
      //     return of(
      //       acc.flatMap((item: any) =>
      //         values.map((value) => {
      //           if(item.id == undefined){
      //             return  ({
      //               sku: null,
      //               barcode: null,
      //               variation_name: `${item.variation_name}-${value}`,
      //               display_name: `${item.variation_name}-${value}`,
      //               image: null,
      //               price_import: 0,
      //               price_export: 0,
      //               status: 1,
      //             })


      //           }else {
      //             return  ({
      //               id: item.id,
      //               sku: null,
      //               barcode: null,
      //               variation_name: `${item.variation_name}-${value}`,
      //               display_name: `${item.variation_name}-${value}`,
      //               image: null,
      //               price_import: 0,
      //               price_export: 0,
      //               status: 1,
      //             })
      //           }

      //         })
      //       )
      //     );
      //   }),
      //   take(this.simpleItems.length)
      // );
      if (status) {
        this.combinedArray$ = of(
          dataOld[0].attribute_values.map((item: any) => ({
              id: item.id,
              sku: null,
              barcode: null,
              variation_name: item.value,
              display_name: item.value,
              image: null,
              price_import: 0,
              price_export: 0,
              status: 1,
            })
          )
        ).pipe(
          expand((acc, index) => {
            if (index >= this.simpleItems.length - 1) {
              return of([]);
            }
            let values = this.simpleItems[index + 1].attribute_values.map(
              (item) => item.value
            );
            return of(
              acc.flatMap((item: any) =>
                values.map((value) =>
                  ({
                    sku: null,
                    barcode: null,
                    variation_name: `${item.variation_name}-${value}`,
                    display_name: `${item.variation_name}-${value}`,
                    image: null,
                    price_import: 0,
                    price_export: 0,
                    status: 1,
                  })
                )
              )
            );
          }),
          take(this.simpleItems.length)
        );

        this.form = this.fb.group({
          rows: this.fb.array([]),
        });
        this.rows = this.form.get('rows') as FormArray;

        this.combinedArray$.subscribe((combinedArray) => {
          // console.log(combinedArray); // Should print 4 arrays

          this.originalArray = combinedArray;
          this.productsForm.get('variations')!.setValue(combinedArray);
          console.log(combinedArray);

          // Clear the FormArray
          while (this.rows.length !== 0) {
            this.rows.removeAt(0);
          }

          combinedArray.forEach((item: any) => {
            this.rows.push(this.createItemFormGroup(item));
          });

          this.rows.valueChanges.subscribe((value) => {
            this.originalArray = value; // Should now also print 4 arrays
            this.productsForm.value.variations = value;
          });
        });
      } else {
        this.form = this.fb.group({
          rows: this.fb.array([]),
        });
        this.rows = this.form.get('rows') as FormArray;

        // this.combinedArray$.subscribe((combinedArray) => {
        // console.log(combinedArray); // Should print 4 arrays

        this.originalArray = DataResult;
        this.productsForm.get('variations')!.setValue(DataResult);
        console.log(this.originalArray);

        // Clear the FormArray
        while (this.rows.length !== 0) {
          this.rows.removeAt(0);
        }

        DataResult.forEach((item: any) => {
          this.rows.push(this.createItemFormGroup(item));
        });

        this.rows.valueChanges.subscribe((value) => {
          this.originalArray = value; // Should now also print 4 arrays
          this.productsForm.value.variations = value;
          console.log(value);

        });
      }

    } else {
      console.log('b');
      this.combinedArray$ = of(
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

      this.combinedArray$.subscribe((combinedArray) => {
        // console.log(combinedArray); // Should print 4 arrays

        this.originalArray = combinedArray;
        this.productsForm.get('variations')!.setValue(combinedArray);
        console.log(this.originalArray);

        // Clear the FormArray
        while (this.rows.length !== 0) {
          this.rows.removeAt(0);
        }

        combinedArray.forEach((item: any) => {
          this.rows.push(this.createItemFormGroup(item));
        });

        this.rows.valueChanges.subscribe((value) => {
          this.originalArray = value; // Should now also print 4 arrays
          this.productsForm.value.variations = value;
        });
      });
    }


  }

  removeAttributesForm(index: number) {
    if (this.itemBoxTypeQuality > 1) {
      this.itemBoxTypeQuality--;
      this.itemBoxTypeQualityArray.splice(index, 1);
      this.simpleItems.splice(index, 1);
      this.renderValue();
      console.log(this.simpleItems);
    }
  }

  addItem(index: number) {
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
        this.statusVersionDefault = true;
        console.log(this.simpleItems);
        this.CheckStatusform();
      }
    }
  }

  removeItem(index: number, indexValue: number) {
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

  renderValue(dataItem: any[] = [], variations: any[] = [], status: boolean = false) {


    if (dataItem.length > 0) {
      this.dataValueVariable = dataItem.map((value, index) => {
        return {
          name: value.name,
          value: value.attribute_values
            .map((data: any, i: number) => {
              return data.value;
            })
            .join(','),
        };
      });
    } else {
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
    }
    this.renderVersion(variations, dataItem, status);
  }

  openBasicModal(content: TemplateRef<any>) {
    this.modalService
      .open(content, {})
      .result.then((result) => {
      console.log(this.simpleItems);
      console.log(this.dataoldApi);
      if (result) {
        this.statusCheckVaribles = JSON.stringify(this.simpleItems) === JSON.stringify(this.dataoldApi);
        console.log(this.statusCheckVaribles);
        if (this.dataoldApi.length >= 1) {
          if (this.statusCheckVaribles) {
            this.renderValue(this.dataoldApi, this.varibles);
          } else {
            this.renderValue(this.simpleItems, this.varibles, true);
          }
        } else {
          this.renderValue();
        }
      }


      // this.dataAttributes = "Modal closed" + result
      // console.log('Modal closed with:', result);
      // console.log('Weight value:', this.weightValue);
      // console.log('abc:',this.simpleItems);

      this.CheckStatusform();
    })
      .catch((res) => {
      });
  }

  onSubmit() {
    const submitBtn = document.querySelector('#submitBtn');
    if (this.productsForm.valid) {
      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'disabled');
      }
      console.log(this.simpleItems);
      let statusCormfirm = this.statusCheckVaribles;
      const status_attributes = statusCormfirm == true ? 0 : 1;
      if (!statusCormfirm) {
        this.combinedArray$.pipe(last()).subscribe((combinedArray) => {
          this.originalArray = combinedArray;
          this.productsForm.get('variations')!.setValue(combinedArray);
          const dataToSend = {
            ...this.productsForm.value,
            name: this.productsForm.value.name || '',
            status: Number(this.productsForm.value.status),
            status_attributes: status_attributes,
            attributes:
              this.productsForm.value.attributes?.length === 0
                ? null
                : this.simpleItems,
            created_at: new Date(),
            updated_at: null,
            id: this.id,
          };

          console.log(this.simpleItems);
          console.log(dataToSend);

          this.ProductsService.update(dataToSend).subscribe(
            (response: any) => {
              if (response.status == true) {
                this.productsForm.reset();
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                  title: 'Thành công!',
                  text: 'Cập nhật sản phẩm thành công',
                  icon: 'success',
                  timerProgressBar: true,
                  didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                  },
                });
                this.router.navigate(['../products/list']);
              } else {
                if (submitBtn) {
                  submitBtn.removeAttribute('disabled');
                }
                // console.log(response);
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
              if (submitBtn) {
                submitBtn.removeAttribute('disabled');
              }
              console.log(error);
              Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
            }
          );
        });
      } else {
        const dataToSend = {
          ...this.productsForm.value,
          name: this.productsForm.value.name || '',
          status: Number(this.productsForm.value.status),
          status_attributes: status_attributes,
          attributes:
            this.productsForm.value.attributes?.length === 0
              ? null
              : this.productsForm.value.attributes,
          created_at: new Date(),
          updated_at: null,
          id: this.id,
        };

        console.log(dataToSend);

        this.ProductsService.update(dataToSend).subscribe(
          (response: any) => {
            if (response.status == true) {
              this.productsForm.reset();
              Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                title: 'Thành công!',
                text: 'Cập nhật sản phẩm thành công',
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
      }

    } else {
      alert('Không để trống');
    }
  }
}
