import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { DatalayoutService } from 'src/app/service/handleDataComponent/datalayout.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomersService } from 'src/app/service/customers/customers.service';
import { ListProducts } from 'src/app/interface/listProduct/list-products';
import { ListProductsService } from 'src/app/service/listProduct/list-products.service';
import { OrderService } from 'src/app/service/order/order.service';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { DebtsService } from 'src/app/service/debts/debts.service';
import { environment } from '../../../../../environments/environment';
import { ViewChild } from '@angular/core';
import { PrintService } from 'src/app/service/print/print.service';
import { TabwindowsService } from 'src/app/service/window/tabwindows.service';
import { SettingService } from '../../../../service/setting/setting.service';
import { ppid } from 'process';

@Component({
  selector: 'app-tabshop',
  templateUrl: './tabshop.component.html',
  styleUrls: ['./tabshop.component.scss'],
})
export class TabshopComponent implements OnInit {
  quantity: number = 0;
  basicModalCloseResult: string = '';
  modelRadio = 1;
  modelTypePay = 0;
  defaultAccordionCode: any;
  listProductCart: any;
  tabDefault: number = 0;
  currentPrice: number;
  priceFormModal: number;
  discount: number = 0;
  tax: number = 0;
  dataCurrent: any;
  totalMoney: number;
  productValues: any = {};
  modalData: any;
  singleTax: number = 0;
  DiscountBill: number = 0;
  taxBill: number = 0;
  modelRadioBill: number = 1;
  priceBill: number = 0;
  dataBill: any;
  cashPrice: number = 0;
  paymentPrice: number = 0;
  changeBill: number = 0;
  noteBill: string;
  people: any = [];
  batchesData: any = [];
  selectedSearchPersonId: number = 1;
  dataAdd: {
    name: string;
    tel: string;
  } = {
    name: '',
    tel: '',
  };
  dataPerson: any;
  dataInfoUser: any;
  ListProducts: any[];
  versionProduct: any;
  pricePayment: number;
  iconsData: any = [
    {
      id: 0,
      icon: '../../../../../assets/images/others/Payment_Cash.svg',
      name: 'Tiền mặt',
    },
    {
      id: 1,
      icon: '../../../../../assets/images/others/Payment_Transfer.svg',
      name: 'Chuyển Khoản',
    },
    {
      id: 2,
      icon: '../../../../../assets/images/others/Debt.68ccc6d1.svg',
      name: 'Ghi nợ',
    },
  ];

  dataBtnPayment: any;
  customTemplateSelectedPeople: any;

  selectedPeopleBatches: any;
  productItemsBatches: any;
  idbatches: number;

  modelRadioPrintf: number = 1;
  formPrintf: any;
  dataObject: any = {};
  tenant: any;
  constructor(
    private modalService: NgbModal,
    private DatalayoutService: DatalayoutService,
    private CustomersService: CustomersService,
    private ListProductsService: ListProductsService,
    private OrderService: OrderService,
    private PaymentService: PaymentService,
    private DebtsService: DebtsService,
    private PrintService: PrintService,
    private TabwindowsService: TabwindowsService,
    private settingService: SettingService
  ) {}

  @ViewChild('printf') myModal: any;

  ngOnInit(): void {
    console.log(this.ListProducts);
    this.PrintService.GetOneRecord('1').subscribe((data: any) => {
      this.formPrintf = data.payload;
    });

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.tenant = JSON.parse(storedUser);
    } else {
      console.log('Không có dữ liệu người dùng trong LocalStorage');
    }
    this.ListProductsService.getProducts().subscribe((data: any) => {
      this.ListProducts = Object.values(data.payload);
      console.log(data.payload);

      if (data.payload) {
        for (const iterator in data.payload) {
          for (const item of data.payload[iterator]) {
            item.quantity = item.variation_quantities.reduce(
              (sum: number, valueCurrent: any) => sum + valueCurrent.quantity,
              0
            );
          }
        }
      }

      // variation_quantities
    });

    this.DatalayoutService.currentData.subscribe((data) => {
      if (data.hasOwnProperty('tabOrder')) {
        this.dataCurrent = data.tabOrder;
        this.listProductCart = data.tabOrder.map(
          (value: any, index: number) => {
            return value.ListProductCart;
          }
        );

        this.dataInfoUser = data.tabOrder.map((value: any, index: number) => {
          return value.infoOrder;
        });
        if (Object.keys(data.tabOrder[this.tabDefault].infoOrder).length > 0) {
          this.selectedSearchPersonId =
            data.tabOrder[this.tabDefault].infoOrder.id;
        }
      } else {
        this.dataCurrent = this.dataCurrent;
        this.listProductCart = this.dataCurrent.map(
          (value: any, index: number) => {
            return value.ListProductCart;
          }
        );
        this.dataInfoUser = this.dataCurrent.map(
          (value: any, index: number) => {
            return value.infoOrder;
          }
        );
        if (
          Object.keys(this.dataCurrent[this.tabDefault].infoOrder).length > 0
        ) {
          this.selectedSearchPersonId =
            this.dataCurrent[this.tabDefault].infoOrder.id;
        }
      }
      // this.dataCurrent = data.tabOrder;
      // this.listProductCart = data.tabOrder.map((value: any, index: number) => {
      //   return value.ListProductCart;
      // });

      this.totalMoney = this.listProductCart[this.tabDefault].reduce(
        (total: number, current: any) => {
          return total + current.result;
        },
        0
      );

      this.productItemsBatches = data.dataBatches;

      this.tabDefault = data.tabCurrent;
      this.modalData = data.tabModal;
      this.dataBtnPayment = data.payment;
      // console.log(data.payment[this.tabDefault][0].pricePayment);
      // if(data.payment[this.tabDefault][0].pricePayment > 0){

      //     this.pricePayment = data.payment[this.tabDefault].reduce((acc :number, item : any) => acc + item.pricePayment,0 )
      // }
      if (!this.dataBill) {
        this.dataBill = data.dataBill;
        this.priceBill = data.dataBill[this.tabDefault].totalPrice;
        this.singleTax = data.dataBill[this.tabDefault].discount;
        this.DiscountBill = data.dataBill[this.tabDefault].tax;
        this.taxBill = data.dataBill[this.tabDefault].service;
        this.modelRadioBill = data.dataBill[this.tabDefault].radio;
        this.cashPrice = data.dataBill[this.tabDefault].cash;
        this.pricePayment = data.dataBill[this.tabDefault].cash;

        this.changeTotalBill();
        if (data.dataBill[this.tabDefault].note) {
          this.noteBill = data.dataBill[this.tabDefault].note;
          this.noteBillEvent();
        }
      }
    });

    this.DatalayoutService.eventCurrent.subscribe((event) => {
      let dataOrder = null;
      let dataBill = null;
      let dataModal = null;
      let dataPayment = null;
      let dataBatches = null;
      switch (event.name) {
        case 'addTabOder':
          if (this.dataCurrent.length < 4) {
            const { modalDataAdd } = event.data;
            this.totalMoney = 0;
            this.dataCurrent.push({
              ListProductCart: [],
              infoOrder: {},
            });
            this.dataBill.push({
              discount: 0,
              tax: 0,
              totalPrice: 0,
              service: 0,
              radio: 1,
              cash: 0,
            });

            this.dataBtnPayment.push([
              {
                payment_method: 0,
                pricePayment: 0,
                status: false,
              },
            ]);
            this.productItemsBatches.push([]);
            console.log(modalDataAdd);
            modalDataAdd.push([]);

            dataModal = modalDataAdd;
            // this.modalData.push([]);
            this.tabDefault = this.dataCurrent.length - 1;
            dataBatches = this.productItemsBatches;
            dataOrder = this.dataCurrent;
            dataBill = this.dataBill;

            dataPayment = this.dataBtnPayment;
            this.listProductCart = this.dataCurrent.map(
              (value: any, index: number) => {
                return value.ListProductCart;
              }
            );
            this.singleTax = this.dataBill[this.tabDefault].discount;
            this.DiscountBill = this.dataBill[this.tabDefault].tax;
            this.taxBill = this.dataBill[this.tabDefault].service;
            this.modelRadioBill = this.dataBill[this.tabDefault].radio;
            this.priceBill = this.dataBill[this.tabDefault].totalPrice;
            this.cashPrice = this.dataBill[this.tabDefault].cash;
            this.pricePayment = this.dataBill[this.tabDefault].cash;
            this.changeTotalBill();
            if (this.dataBill[this.tabDefault].note) {
              this.noteBill = this.dataBill[this.tabDefault].note;
              this.noteBillEvent();
            }

            if (
              Object.keys(this.dataCurrent[this.tabDefault].infoOrder).length >
              0
            ) {
              this.selectedSearchPersonId =
                this.dataCurrent[this.tabDefault].infoOrder.id;
            } else {
              this.selectedSearchPersonId = 1;
            }
            localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
            localStorage.setItem('dataBill', JSON.stringify(this.dataBill));
            localStorage.setItem('TabModal', JSON.stringify(modalDataAdd));
            localStorage.setItem(
              'dataPayment',
              JSON.stringify(this.dataBtnPayment)
            );
            localStorage.setItem(
              'dataBatches',
              JSON.stringify(this.productItemsBatches)
            );
            this.DatalayoutService.changeData({ tabCurrent: this.tabDefault });
            localStorage.setItem(
              'TabCurrentIndex',
              JSON.stringify(this.tabDefault)
            );

            // window.location.reload();
          } else {
            dataOrder = this.dataCurrent;
            dataBill = this.dataBill;
            dataBatches = this.productItemsBatches;
            dataModal = this.modalData;
            dataPayment = this.dataBtnPayment;
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thất bại!',
              text: 'Đơn hàng đã đạt giới hạn vui lòng thanh toán 4 đơn hàng trước đó',
              icon: 'error',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
          }

          this.dataCurrent = dataOrder;
          this.dataBill = dataBill;
          this.dataBtnPayment = dataPayment;
          this.productItemsBatches = dataBatches;
          this.modalData = dataModal;
          console.log(this.dataBill);
          break;
        case 'changeTab':
          const { id } = event.data;
          this.tabDefault = id;
          this.totalMoney = this.listProductCart[this.tabDefault].reduce(
            (total: number, current: any) => {
              return total + current.result;
            },
            0
          );
          this.singleTax = this.dataBill[this.tabDefault].discount;
          this.DiscountBill = this.dataBill[this.tabDefault].tax;
          this.taxBill = this.dataBill[this.tabDefault].service;
          this.modelRadioBill = this.dataBill[this.tabDefault].radio;
          this.priceBill = this.dataBill[this.tabDefault].totalPrice;
          this.cashPrice = this.dataBill[this.tabDefault].cash;
          this.pricePayment = this.dataBill[this.tabDefault].cash;

          this.changeTotalBill();
          if (this.dataBill[this.tabDefault].note) {
            this.noteBill = this.dataBill[this.tabDefault].note;
            this.noteBillEvent();
          } else {
            this.noteBill = '';
          }

          console.log(this.dataCurrent[this.tabDefault]);

          if (
            Object.keys(this.dataCurrent[this.tabDefault].infoOrder).length > 0
          ) {
            this.selectedSearchPersonId =
              this.dataCurrent[this.tabDefault].infoOrder.id;
          } else {
            this.selectedSearchPersonId = 1;
          }
          localStorage.setItem(
            'TabCurrentIndex',
            JSON.stringify(this.tabDefault)
          );
          break;
        case 'removeTab':
          const { idRemove, modalData } = event.data;

          if (idRemove > 0) {
            this.dataCurrent.splice(idRemove, 1);
            this.dataBill.splice(idRemove, 1);
            this.dataBtnPayment.splice(this.tabDefault, 1);
            modalData.splice(this.tabDefault, 1);
            this.productItemsBatches.splice(this.tabDefault, 1);
            dataModal = modalData;
            this.tabDefault = idRemove == 0 ? 0 : idRemove - 1;
            this.singleTax = this.dataBill[this.tabDefault].discount;
            this.DiscountBill = this.dataBill[this.tabDefault].tax;
            this.taxBill = this.dataBill[this.tabDefault].service;
            this.modelRadioBill = this.dataBill[this.tabDefault].radio;
            this.priceBill = this.dataBill[this.tabDefault].totalPrice;
            dataOrder = this.dataCurrent;
            dataBill = this.dataBill;
            dataPayment = this.dataBtnPayment;
            dataBatches = this.productItemsBatches;
            if (
              Object.keys(this.dataCurrent[this.tabDefault].infoOrder).length >
              0
            ) {
              this.selectedSearchPersonId =
                this.dataCurrent[this.tabDefault].infoOrder.id;
            } else {
              this.selectedSearchPersonId = 1;
            }

            localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
            localStorage.setItem('dataBill', JSON.stringify(this.dataBill));
            localStorage.setItem('TabModal', JSON.stringify(modalData));
            localStorage.setItem(
              'dataPayment',
              JSON.stringify(this.dataBtnPayment)
            );
            localStorage.setItem(
              'dataBatches',
              JSON.stringify(this.productItemsBatches)
            );
            this.DatalayoutService.changeData({ tabCurrent: this.tabDefault });
            localStorage.setItem(
              'TabCurrentIndex',
              JSON.stringify(this.tabDefault)
            );
          }
          this.dataCurrent = dataOrder;
          this.dataBill = dataBill;
          this.modalData = dataModal;
          this.dataBtnPayment = dataPayment;
          this.productItemsBatches = dataBatches;
          break;
        default:
          throw new Error('Error Event component');
      }
    });

    this.CustomersService.getCustomer().subscribe((response: any) => {
      // console.log(response.payload.data);
      this.people = response.payload;
      console.log(response);

      console.log(response);
      if (response.payload.length > 0) {
        this.people.forEach((person: any) => {
          person.displayName = `${person.name} - ${person.tel}`;
        });
      }
    });
  }

  peopleEvent(): void {
    const selectedPerson = this.people.find(
      (person: any) => person.id === this.selectedSearchPersonId
    );
    this.dataPerson = selectedPerson;
    this.updateBill(this.dataInfoUser, this.tabDefault, selectedPerson);
    localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
  }

  scrollTo(element: any) {
    element.scrollIntoView({ behavior: 'smooth' });
  }

  noteBillEvent(): void {
    this.updateBill(this.dataBill, this.tabDefault, {
      note: this.noteBill,
    });
    localStorage.setItem('dataBill', JSON.stringify(this.dataBill));
  }

  changeTotalBill() {
    if (this.cashPrice > this.priceBill) {
      this.changeBill = this.cashPrice - this.priceBill;
      this.paymentPrice = 0;
    } else {
      this.changeBill = 0;
      this.paymentPrice = this.priceBill - this.cashPrice;
    }
  }

  checkDataModalDiscount(e : any){
    // console.log(+e.target.value);
    // console.log(this.modelRadioBill);
    if (this.modelRadioBill === 1) {
        if(+e.target.value > 100) {
          this.DiscountBill = 100;
          e.target.value = 100;
        }
    }
  }

  // Tính toán tiền bill
  resultBill(idTab: number) {
    console.log("vào bill");
    
    // console.log(this.singleTax);
    // console.log(this.totalMoney, this.DiscountBill, this.totalMoney);
    let priceCurrent = null;
    if (this.singleTax < 0) {
      this.singleTax = 0;
    } 

    if (this.modelRadioBill === 1) {
      const total = this.totalMoney * Number(this.DiscountBill);
      priceCurrent =
        this.totalMoney -
        total / 100 +
        ((this.totalMoney - total / 100) * this.singleTax) / 100 +
        Number(this.taxBill);
    } else {
      const total = this.totalMoney - Number(this.DiscountBill);
      priceCurrent =
        total + (total * this.singleTax) / 100 + Number(this.taxBill);
    }

    this.priceBill = priceCurrent;
    // console.log(this.dataBill[idTab]);
    // console.log(this.dataBill[this.tabDefault]);
    this.updateBill(this.dataBill, idTab, {
      discount: this.singleTax,
      tax: this.DiscountBill,
      totalPrice: this.priceBill,
      service: this.taxBill,
      radio: this.modelRadioBill,
    });

    localStorage.setItem('dataBill', JSON.stringify(this.dataBill));
  }

  // Sửa tính toán tiền phải trả
  changeCash(event: any): void {
    if (!event.target.value) {
      this.cashPrice = 0;
      event.target.value = 0;
      this.pricePayment = 0;
    }

    if (this.cashPrice > this.priceBill) {
      this.changeBill = this.cashPrice - this.priceBill;
      this.paymentPrice = 0;
    } else {
      this.changeBill = 0;
      this.paymentPrice = this.priceBill - this.cashPrice;
    }
    console.log(event.target.value);
    this.updateBill(this.dataBill, this.tabDefault, {
      cash: this.cashPrice,
    });
    localStorage.setItem('dataBill', JSON.stringify(this.dataBill));
  }

  // Tính toán giá tiền và update lại
  resultTotal(e: any) {
    if (+e.target.value > 0) {
      console.log(+e.target.value);

      this.updateQuantity(
        this.listProductCart[this.tabDefault],
        +e.target.id,
        +e.target.value,
        e.target.name
      );
    } else {
      console.log(+e.target.value);
      e.target.value = 0;
      this.updateQuantity(
        this.listProductCart[this.tabDefault],
        +e.target.id,
        0,
        e.target.name
      );
    }

    this.totalMoney = this.listProductCart[this.tabDefault].reduce(
      (total: number, current: any) => {
        return total + current.result;
      },
      0
    );
    this.priceBill = this.totalMoney;
    localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
  }

  resultTotalBatches(e: any) {
    this.updateQuantity(
      this.listProductCart[this.tabDefault],
      +e.target.id,
      +e.target.value,
      e.target.name
    );
    this.totalMoney = this.listProductCart[this.tabDefault].reduce(
      (total: number, current: any) => {
        return total + current.result;
      },
      0
    );
    localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
  }

  // Bật modal hiển thị vesion products
  openBasicModalVerison(content: TemplateRef<any>, items: any) {
    this.versionProduct = items;
    this.modalService
      .open(content, {})
      .result.then((result) => {
        console.log(result);
        if (result) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: 'Thành công!',
            text: 'Thêm sản phẩm thành công',
            icon: 'success',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        }
      })
      .catch((res) => {});
  }


  openBasicModalDiscount(content: TemplateRef<any>) {
    this.modalService
      .open(content, {})
      .result.then((result) => {
        console.log(result);
        if (result) {
          this.resultBill(this.tabDefault);
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: 'Thành công!',
            text: 'Áp dụng thành công',
            icon: 'success',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        }})
      }
  openBasicModalUserAdd(content: TemplateRef<any>) {
    this.modalService
      .open(content, {})
      .result.then((result) => {
        console.log(result);
        if (result) {
          this.updateBill(this.dataInfoUser, this.tabDefault, this.dataAdd);
          console.log(this.dataCurrent);
          
          this.CustomersService.createQuickly(this.dataAdd).subscribe(
            (data: any) => {
              console.log(data);
              if (data.status) {
                this.people = data.payload;
                console.log(data.payload);

                if (data.payload.length > 0) {
                  this.people.forEach((person: any) => {
                    person.displayName = `${person.name} - ${person.tel}`;
                  });
                }
                const dataFind = data.payload.find(
                  (person: any) => person.name === this.dataAdd.name
                );
                this.selectedSearchPersonId = dataFind.id;
                this.updateBill(this.dataInfoUser, this.tabDefault, dataFind);
                localStorage.setItem(
                  'tabOrder',
                  JSON.stringify(this.dataCurrent)
                );

                this.dataAdd.name = '';
                this.dataAdd.tel = '';
              } else {
                console.log(data);

                const errorMessages = [];
                for (const key in data.meta.errors) {
                  const messages = data.meta.errors[key];
                  for (const message of messages) {
                    errorMessages.push(`${key}: ${message}`);
                  }
                }
                this.showNextMessage(errorMessages);
              }
            }
          );
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: 'Thành công!',
            text: 'Áp dụng thành công',
            icon: 'success',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        }
      })
      .catch((res) => {});
  }

  // openBasicModalPrintf(content: TemplateRef<any>){
  //   this.modalService.open(content, {}).result.then((result) => {
  //     this.basicModalCloseResult = "Modal closed" + result
  //   }).catch((res) => {});
  // }

  // Xóa sản phẩm khỏi cart
  removeItemCart(id: number) {
    if (id > -1) {
      this.listProductCart[this.tabDefault].splice(id, 1);
      this.totalMoney = this.listProductCart[this.tabDefault].reduce(
        (total: number, current: any) => {
          return total + current.result;
        },
        0
      );
      this.modalData[this.tabDefault].splice(id, 1);
      console.log(this.productItemsBatches);
      if (this.productItemsBatches) {
        this.productItemsBatches[this.tabDefault].splice(id, 1);
      }
      this.resultBill(this.tabDefault);
      localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
      localStorage.setItem('TabModal', JSON.stringify(this.modalData));
      localStorage.setItem(
        'dataBatches',
        JSON.stringify(this.productItemsBatches)
      );
    }
  }

  // Kiểm tra trạng thái tiền
  statusTotal() {
    if (this.modelRadio == 1) {
      this.discount = 100;
    }
  }

  // Kiểm tra đầu vào data
  limitInput(event: any) {
    console.log(this.discount, this.modelRadio);

    if (this.modelRadio == 1 && this.discount > 100) {
      event.target.value = 100;
      this.discount = 100;
    } else if (this.discount < 0) {
      event.target.value = 0;
      this.discount = 0;
    } else {
      this.discount =
        this.discount > this.priceFormModal
          ? this.priceFormModal
          : this.discount;
      event.target.value = this.discount;
    }
    this.totalMoney = this.listProductCart[this.tabDefault].reduce(
      (total: number, current: any) => {
        return total + current.result;
      },
      0
    );
  }

  updateBatches(id: number) {
    const dataFind = this.productItemsBatches[this.tabDefault].find(
      (item: any) => item.id === id
    );
    dataFind.batches = this.selectedPeopleBatches;
    localStorage.setItem(
      'dataBatches',
      JSON.stringify(this.productItemsBatches)
    );
  }

  checkDataModalTarget(e: any) {
    console.log(e.target.value);
    if (this.checkValueInput(e.target.value) == false) {
      e.target.value = '0';
    } else {
      e.target.value = this.removeLeadingZeros(e.target.value);
    }
  }

  checkDataModalNumber(e: any) {
    console.log(e.target.value);
    if (this.checkValueInput(e.target.value) == false) {
      e.target.value = '';
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: 'Thất bại!',
        text: 'Vui lòng nhập số điện thoại đúng định dạng',
        icon: 'success',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

    }
  }

  removeLeadingZeros(inputData: string) {
    // Kiểm tra xem chuỗi có bắt đầu bằng số 0 hay không
    if (inputData.startsWith('0')) {
      // Bỏ các ký tự 0 ở đầu chuỗi
      return inputData.replace(/^0+/, '');
    }
    return inputData;
  }

  

  checkValueInput(value: string) {
    // Sử dụng biểu thức chính quy để kiểm tra chuỗi
    var pattern = /^[0-9]+$/;

    // Sử dụng test để kiểm tra
    return pattern.test(value);
  }

  openBasicModalPrice(content: TemplateRef<any>, id: number, index: number) {
    this.priceFormModal = this.modalData[this.tabDefault][index].priceCurrent;
    this.discount = this.modalData[this.tabDefault][index].discount;
    this.tax = this.modalData[this.tabDefault][index].tax;
    this.modelRadio = this.modalData[this.tabDefault][index].radioDiscount;
    this.modalService
      .open(content, {})
      .result.then((result) => {
        // console.log(result);
        // console.log(this.priceFormModal,this.discount,this.tax);
        console.log(this.modelRadio);

        if (result) {
          let priceCurrent = null;
          if (this.modelRadio === 1) {
            const total = this.priceFormModal * Number(this.discount);
            priceCurrent =
              this.priceFormModal -
              total / 100 +
              ((this.priceFormModal - total / 100) * this.tax) / 100;
          } else {
            const total = this.priceFormModal - Number(this.discount);
            priceCurrent = total + (total * this.tax) / 100;
          }
          const objData = {
            priceCurrent: +this.priceFormModal,
            discount: this.discount,
            tax: +this.tax,
            radioDiscount: this.modelRadio,
            result: priceCurrent,
          };
          console.log(objData);
          console.log(this.modalData);
          this.updateQuantity(
            this.listProductCart[this.tabDefault],
            +id,
            priceCurrent,
            'price'
          );
          this.updateModal(this.modalData[this.tabDefault], +id, objData);
          this.totalMoney = this.listProductCart[this.tabDefault].reduce(
            (total: number, current: any) => {
              return total + current.result;
            },
            0
          );
          this.resultBill(this.tabDefault);
          localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
          localStorage.setItem('TabModal', JSON.stringify(this.modalData));
          // console.log(this.modalData[this.tabDefault]);
          // console.log(this.modalData);

          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: 'Thành công!',
            text: 'Áp dụng thành công',
            icon: 'success',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        }
      })
      .catch((res) => {});
  }

  changePayment(type: number = 0) {
    let itemsUpdate =
      this.dataBtnPayment[this.tabDefault][
        this.dataBtnPayment[this.tabDefault].length - 1
      ];
    // console.log(this.pricePayment,type,this.cashPrice,itemsUpdate);
    console.log(itemsUpdate);

    let dataUpdate = null;
    if (!itemsUpdate.status) {
      console.log(
        this.dataBtnPayment[this.tabDefault].length
      );
      
      // if(itemsUpdate.pricePayment >= this.priceBill && itemsUpdate.status == false){
        if(this.dataBtnPayment[this.tabDefault].length === 1 && type == 2){
        itemsUpdate.pricePayment = this.priceBill;
        itemsUpdate.status = true;
      }
      itemsUpdate.payment_method = this.modelTypePay;
      itemsUpdate.pricePayment = +itemsUpdate.pricePayment;
      console.log(this.dataBtnPayment);

      if (itemsUpdate.pricePayment > this.priceBill) {
        this.changeBill = itemsUpdate.pricePayment - this.priceBill;
        this.paymentPrice = 0;
      } else {
        this.changeBill = 0;
        this.paymentPrice = this.priceBill - itemsUpdate.pricePayment;
      }

      this.pricePayment = this.dataBtnPayment[this.tabDefault].reduce(
        (acc: number, item: any) => acc + item.pricePayment,
        0
      );

      if (this.modelTypePay == 0) {
        this.cashPrice = this.pricePayment;
      } else {
        this.cashPrice = 0;
      }
    } else {
      console.log(this.dataBtnPayment[this.tabDefault].length + "test");
    
        if (this.pricePayment < this.priceBill) {
          console.log(type);
  
          if (type == 2) {
            this.dataBtnPayment[this.tabDefault].push({
              payment_method: 2,
              pricePayment: this.paymentPrice,
              status: true,
            });
  
            this.pricePayment = this.dataBtnPayment[this.tabDefault].reduce(
              (acc: number, item: any) => acc + item.pricePayment,
              0
            );
  
            if (this.pricePayment > this.priceBill) {
              this.changeBill = this.pricePayment - this.priceBill;
              this.paymentPrice = 0;
            } else {
              this.changeBill = 0;
              this.paymentPrice = this.priceBill - this.pricePayment;
            }
          } else {
            this.dataBtnPayment[this.tabDefault].push({
              payment_method: type,
              pricePayment: 0,
              status: false,
            });
          }
  
          dataUpdate = this.dataBtnPayment;

    }

      
    }

    localStorage.setItem('dataPayment', JSON.stringify(this.dataBtnPayment));
  }

  // Xác nhận thanh toán
  paymentOrder(type: number) {
    const data =
      this.dataBtnPayment[this.tabDefault][
        this.dataBtnPayment[this.tabDefault].length - 1
      ];

    // data.payment_method = this.modelTypePay;
    // data.pricePayment = +this.pricePayment;
    data.status = true;

    // console.log(this.modelTypePay);
    // console.log(this.priceBill);
    // this.pricePayment
    // changeCash()
    if (this.pricePayment > this.priceBill) {
      this.changeBill = this.pricePayment - this.priceBill;
      this.paymentPrice = 0;
    } else {
      this.changeBill = 0;
      this.paymentPrice = this.priceBill - this.pricePayment;
    }

    this.updateBill(this.dataBill, this.tabDefault, {
      cash: this.pricePayment,
    });

    localStorage.setItem('dataPayment', JSON.stringify(this.dataBtnPayment));

    // this.priceBill
    // this.cashPrice
    // if(this.priceBill){

    // }
  }

  addProduct(item: any) {

    
    this.modalData = JSON.parse(localStorage.getItem('TabModal')!);
    console.log(this.modalData);
    const ResultFind = this.listProductCart[this.tabDefault].find(
      (itemCurrent: any) => itemCurrent.id === item.id
    );
    console.log(ResultFind);
    

    if (ResultFind) {
      if(ResultFind.quanity >= ResultFind.quantity){
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: 'Thất bại!',
          text: 'Đã đạt giới hạn sản phẩm cho phép vui lòng nhập thêm để thêm tiếp!',
          icon: 'error',
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        return;
      }
      ResultFind.quanity = ResultFind.quanity + 1;
        ResultFind.result = ResultFind.quanity * ResultFind.price_export;
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: 'Thành công!',
          text: 'Cập nhật sản phẩm thành công!',
          icon: 'success',
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
      
    } else {
      console.log(item);

      this.listProductCart[this.tabDefault].push({
        ...item,
        quanity: 1,
        result: 1 * item.price_export,
      });

      this.modalData[this.tabDefault].push({
        id: item.id,
        priceCurrent: item.price_export,
        discount: 0,
        tax: 0,
        radioDiscount: 1,
        result: item.price_export,
      });

      if (item.batchs.length > 0) {
        this.productItemsBatches[this.tabDefault].push({
          id: item.id,
          batches: [],
        });
        // this.selectedPeopleBatches
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: 'Cảnh báo!',
          text: 'Vui lòng chọn lô sản phẩm',
          icon: 'warning',
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
      } else {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: 'Thành công!',
          text: 'Thêm sản phẩm thành công',
          icon: 'success',
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
      }
    }

    console.log(this.modalData);

    localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
    localStorage.setItem('TabModal', JSON.stringify(this.modalData));
    localStorage.setItem(
      'dataBatches',
      JSON.stringify(this.productItemsBatches)
    );
    this.totalMoney = this.listProductCart[this.tabDefault].reduce(
      (total: number, current: any) => {
        return total + current.result;
      },
      0
    );
    this.resultBill(this.tabDefault);

    localStorage.setItem('dataBill', JSON.stringify(this.dataBill));

    // console.log(this.dataCurrent);
  }

  addProductQuality(item: any) {
    this.modalData = JSON.parse(localStorage.getItem('TabModal')!);
    this.dataBill = JSON.parse(localStorage.getItem('dataBill')!);
    Swal.fire({
      title: 'Bán vượt quá số tồn kho',
      text: 'Sản phẩm này hiện không đủ số lượng trong kho. Bạn vẫn muốn bán chứ ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Quay lại',
      confirmButtonText: 'Tiếp tục bán',
    }).then((result) => {
      if (result.isConfirmed) {
        const ResultFind = this.listProductCart[this.tabDefault].find(
          (itemCurrent: any) => itemCurrent.id === item.id
        );
        console.log(this.listProductCart);
        console.log(ResultFind);

        if (ResultFind) {
          ResultFind.quanity = ResultFind.quanity + 1;
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: 'Thành công!',
            text: 'Cập nhật sản phẩm thành công!',
            icon: 'success',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        } else {
          console.log(item.id);
          if (item.batchs.length > 0) {
            this.productItemsBatches[this.tabDefault].push({
              id: item.id,
              batches: [],
            });
          }

          this.listProductCart[this.tabDefault].push({
            ...item,
            quanity: 1,
            result: 1 * item.price_export,
          });

          this.modalData[this.tabDefault].push({
            id: item.id,
            priceCurrent: item.price_export,
            discount: 0,
            tax: 0,
            radioDiscount: 1,
            result: item.price_export,
          });

          console.log(this.dataCurrent);
          console.log(this.listProductCart);

          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: 'Thành công!',
            text: 'Thêm sản phẩm thành công',
            icon: 'success',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        }
        localStorage.setItem(
          'dataBatches',
          JSON.stringify(this.productItemsBatches)
        );
        localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
        localStorage.setItem('TabModal', JSON.stringify(this.modalData));
        this.totalMoney = this.listProductCart[this.tabDefault].reduce(
          (total: number, current: any) => {
            return total + current.result;
          },
          0
        );

        this.resultBill(this.tabDefault);
      }
    });
  }

  openLgModalBatches(content: TemplateRef<any>, id: number) {
    console.log(id);

    const data = this.listProductCart[this.tabDefault].find(
      (item: any) => item.id === id
    );
    this.batchesData = data.batchs;

    this.idbatches = id;
    // const data = batches.
    for (let i = 0; i < this.batchesData.length; i++) {
      let batchId = this.batchesData[i].id;

      // Tìm các phần tử trong mảng quality có batch_id tương ứng
      let matchingQuality = data.variation_quantities.filter(
        (item: any) => item.batch_id === batchId
      );

      let totalQuantity = matchingQuality.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );
      this.batchesData[i].quality = totalQuantity;
      this.batchesData[i].payQuality = 1;
    }

    const ResultData = this.productItemsBatches[this.tabDefault].find(
      (item: any) => item.id === id
    );
    this.selectedPeopleBatches = ResultData.batches;

    console.log(ResultData);

    this.modalService
      .open(content, { size: 'lg' })
      .result.then((result) => {
        if (result) {
          data.quanity = ResultData.batches.reduce(
            (acc: number, item: any) => acc + item.payQuality,
            0
          );
          localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: 'Thành công!',
            text: 'Áp dụng lô hàng thành công',
            icon: 'success',
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        }
      })
      .catch((res) => {});
  }

  openLgModal(content: TemplateRef<any>) {
    const dataProductCurrent = this.listProductCart[this.tabDefault].filter(
      (item: any) => item.batchs.length > 0
    );

    console.log(this.tenant);

    // console.log(this.listProductCart[this.tabDefault]);

    for (let index = 0; index < dataProductCurrent.length; index++) {
      const element = dataProductCurrent[index];
      const dataFind = this.productItemsBatches[this.tabDefault].find(
        (dataBatches: any) => dataBatches.id === element.id
      );

      if (dataFind.batches.length == 0) {
        const data = this.listProductCart[this.tabDefault].find(
          (item: any) => item.id === element.id
        );
        this.batchesData = data.batchs;
        for (let i = 0; i < this.batchesData.length; i++) {
          let batchId = this.batchesData[i].id;

          // Tìm các phần tử trong mảng quality có batch_id tương ứng
          let matchingQuality = data.variation_quantities.filter(
            (item: any) => item.batch_id === batchId
          );

          let totalQuantity = matchingQuality.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          );
          this.batchesData[i].quality = totalQuantity;
          this.batchesData[i].payQuality = 1;
        }
        const resultBatches = element.batchs.find(
          (itemBathces: any) => itemBathces.quality > 0
        );
        dataFind.batches.push(resultBatches);

        localStorage.setItem(
          'dataBatches',
          JSON.stringify(this.productItemsBatches)
        );
      }

      console.log(this.dataCurrent);
    }
    console.log(this.dataBtnPayment);

    this.modelTypePay =
      this.dataBtnPayment[this.tabDefault][
        this.dataBtnPayment[this.tabDefault].length - 1
      ].payment_method;
    this.pricePayment = this.dataBtnPayment[this.tabDefault].reduce(
      (acc: number, item: any) => acc + item.pricePayment,
      0
    );
    if (this.pricePayment > this.priceBill) {
      this.changeBill = this.pricePayment - this.priceBill;
      this.paymentPrice = 0;
    } else {
      this.changeBill = 0;
      this.paymentPrice = this.priceBill - this.pricePayment;
    }
    this.modalService
      .open(content, { size: 'lg' })
      .result.then((result) => {
        if (result) {
          console.log(this.priceBill);
          
          const dataSend = {
            customer_id: this.selectedSearchPersonId,
            created_by: this.tenant.id,
            discount: this.DiscountBill,
            discount_type: this.modelRadioBill,
            tax: this.singleTax,
            service_charge: this.taxBill,
            total_product: this.listProductCart[this.tabDefault].length,
            total_price: this.priceBill,
            status: 2,
            payment_status: 2,
            order_details: this.listProductCart[this.tabDefault].map(
              (item: any, index: number) => {
                return {
                  ...item,
                  batches_focus: this.productItemsBatches[this.tabDefault].find(
                    (itemBatches: any) => itemBatches.id == item.id
                  ),
                  priceModal: this.modalData[this.tabDefault].find(
                    (itemmodal: any) => itemmodal.id == item.id
                  ),
                };
              }
            ),
          };
          var currentDate = new Date();
          let dataformBtn: any;
          let dataformBatches: any;
          let productCart: any;
          var currentDateTime = currentDate.toLocaleString();

          const taxprice = this.listProductCart[this.tabDefault].reduce(
            (index: number, item: any) => {
              const priceFind = this.modalData[this.tabDefault].find(
                (itemmodal: any) => itemmodal.id == item.id
              );
              return index + (priceFind.priceCurrent - priceFind.result);
            },
            0
          );

          console.log(this.settingService.tenant);

          let obj = {
            Ten_Cua_hang: this.settingService.tenant.name,
            Ten_Chi_Nhanh: this.settingService.tenant.business_name,
            Dia_Chi_Chi_Nhanh: this.settingService.tenant.address,
            Dien_Thoai_Chi_Nhanh:
              this.tenant.tel == null ? '---' : this.tenant.tel,
            Nguoi_Phu_Trach: this.tenant.name,

            Ngay_Tao: currentDateTime,
            Ma_Don_Hang: null,
            Tong_Tien_Hang: this.priceBill,
            Tong_Chiet_Khau_San_Pham: `-${taxprice}`,
            Chiet_Khau_Don_Hang: this.DiscountBill,
            Tong_Thue: this.singleTax,
            Phi_Khac: 0,
            Tong_Can_Thanh_Toan: this.priceBill,
            Khach_Thanh_Toan: this.pricePayment,
            Tien_No: this.paymentPrice,
            Tien_Tra: this.changeBill,
            Ten_Khach_Hang: 'Khách ngoại lai',
            Dien_Thoai_Khach: '---',
            Listproducts: this.listProductCart[this.tabDefault].map(
              (item: any, index: number) => {
                return {
                  ...item,
                  batches_focus: this.productItemsBatches[this.tabDefault].find(
                    (itemBatches: any) => itemBatches.id == item.id
                  ),
                  priceModal: this.modalData[this.tabDefault].find(
                    (itemmodal: any) => itemmodal.id == item.id
                  ),
                };
              }
            ),
          };
          console.log(obj);

          // if (this.selectedSearchPersonId == 1) {
            console.log('đã vào đây');

            this.OrderService.create(
              dataSend,
              this.settingService.location?.id
            ).subscribe((data: any) => {
              // console.log(data.payload.id);
              console.log(data);

              if (data.status) {
                // Lấy thời gian hiện tại
                const now = new Date();

                // Lấy thời gian hiện tại cộng thêm 1 năm
                const nextYear = new Date();
                nextYear.setFullYear(nextYear.getFullYear() + 1);

                // Chuyển đổi sang định dạng Date
                const nowDate = new Date(now);
                const nextYearDate = new Date(nextYear);
                const { id: idOrder } = data.payload;
                const { id, type :  typeCustomer, name, tel } = this.people.find(
                  (person: any) => person.id === this.selectedSearchPersonId
                );
                console.log(this.people);
                obj.Ma_Don_Hang = idOrder;
                obj.Ten_Khach_Hang = name;
                obj.Dien_Thoai_Khach = tel;
                console.log(this.changeBill);
                
                console.log(this.dataBtnPayment[this.tabDefault]);
                
                const dataResult = this.dataBtnPayment[this.tabDefault].map(
                  (item: any) => {
                    if (this.changeBill > 0) {
                      if (
                        item.payment_method == 0 ||
                        item.payment_method == 1
                      ) {
                        return {
                          ...item,
                          paymentable_id: idOrder,
                          amount: this.priceBill,
                          amount_in: this.pricePayment,
                          amount_refund: this.changeBill,
                          note:
                            this.dataBill[this.tabDefault].note == undefined
                              ? ''
                              : this.dataBill[this.tabDefault].note,
                          reference_code: null,
                          statusMap: true,
                        };
                      } else {
                        return {
                          ...item,
                          paymentable_id: idOrder,
                          amount: this.priceBill,
                          amount_in: this.pricePayment,
                          amount_refund: this.changeBill,
                          note:
                            this.dataBill[this.tabDefault].note == undefined
                              ? ''
                              : this.dataBill[this.tabDefault].note,
                          reference_code: null,
                          statusMap: false,
                        };
                      }
                    } else {
                      if(item.payment_method == 2){
                        if (
                          item.payment_method == 0 ||
                          item.payment_method == 1
                        ) {
                          return {
                            ...item,
                            paymentable_id: idOrder,
                            amount: this.priceBill,
                            amount_in: this.pricePayment,
                            amount_refund: this.changeBill,
                            note:
                              this.dataBill[this.tabDefault].note == undefined
                                ? ''
                                : this.dataBill[this.tabDefault].note,
                            reference_code: null,
                            statusMap: true,
                          };
                        } else {
                          return {
                            ...item,
                            paymentable_id: idOrder,
                            amount: this.priceBill,
                            amount_in: this.pricePayment,
                            amount_refund: this.changeBill,
                            note:
                              this.dataBill[this.tabDefault].note == undefined
                                ? ''
                                : this.dataBill[this.tabDefault].note,
                            reference_code: null,
                            statusMap: false,
                          };
                        }
                      }else {
                        if (
                          item.payment_method == 0 ||
                          item.payment_method == 1
                        ) {
                          return {
                            ...item,
                            paymentable_id: idOrder,
                            amount: this.priceBill,
                            amount_in: this.pricePayment,
                            amount_refund: this.changeBill,
                            note:
                              this.dataBill[this.tabDefault].note == undefined
                                ? ''
                                : this.dataBill[this.tabDefault].note,
                            reference_code: null,
                            statusMap: true,
                          };
                        }
                      }
                    }
                  }
                );

                console.log(dataResult);
                
    
                const dataPayementApi = dataResult.filter(
                  (item: any) => item.statusMap == true
                );
                const dataDebtsApi = dataResult.find(
                  (item: any) => item.statusMap == false
                );

                console.log(dataPayementApi ,dataDebtsApi);
                // debugger;
                // debugger
                const objDebts = {
                  partner_id: id,
                  partner_type: typeCustomer,
                  debit_at: nowDate,
                  due_at: nextYearDate,
                  name,
                  amount_debt: this.paymentPrice,
                  amount_paid: 0,
                  note:
                    this.dataBill[this.tabDefault].note == undefined
                      ? ''
                      : this.dataBill[this.tabDefault].note,
                  type: 0,
                  status: 1,
                };

                // console.log(objDebts);
                // console.log(dataDebtsApi);
                console.log(objDebts);

                if (this.tabDefault == 0) {
                  if (dataPayementApi && dataDebtsApi) {
                    console.log("vào cái này rồi bố ạ");
                    
                    objDebts.amount_debt = dataDebtsApi.pricePayment;
                    this.DebtsService.createDebts(objDebts).subscribe(
                      (data: any) => {
                        if (data.status) {
                          Swal.fire({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            title: 'Thành Công!',
                            text: 'Đã đặt hàng thành công!!',
                            icon: 'success',
                            timerProgressBar: true,
                            didOpen: (toast) => {
                              toast.addEventListener(
                                'mouseenter',
                                Swal.stopTimer
                              );
                              toast.addEventListener(
                                'mouseleave',
                                Swal.resumeTimer
                              );
                            },
                          });

                          this.modalService
                            .open(this.myModal)
                            .result.then((result) => {
                              // console.log(result);
                              // console.log(obj);
                            
                              if (result) {
                                this.replaceKeysWithData(obj);
                                const newWindow =
                                  this.TabwindowsService.openWindow(
                                    'about:blank',
                                    'NewWindow',
                                    800,
                                    600
                                  );
                                newWindow?.document.write(
                                  `<html><head><title>Website quản lý bán hàng cho doanh nghiệp NextGo</title></head><body>${this.formPrintf.form}</body></html>`
                                );
                                newWindow?.document.close();
                                newWindow?.print();
                              }else {
                                window.location.reload();
                              }

                            })
                            .catch((res) => {});
                          // setTimeout(() => {
                          //   window.location.reload();
                          // }, 1000);
                        }
                      }
                    );
                    this.PaymentService.createPayment(dataResult).subscribe(
                      (data: any) => {
                        console.log(data);
                      }
                    );
                  } else {
                    if (this.paymentPrice > 0) {
                      dataResult.push({
                        payment_method: 2,
                        pricePayment: this.paymentPrice,
                        status: true,
                        paymentable_id: idOrder,
                        amount: this.priceBill,
                        amount_in: this.pricePayment,
                        amount_refund: this.changeBill,
                        note:
                          this.dataBill[this.tabDefault].note == undefined
                            ? ''
                            : this.dataBill[this.tabDefault].note,
                        reference_code: null,
                        statusMap: true,
                      });
                      this.PaymentService.createPayment(dataResult).subscribe(
                        (data: any) => {
                          console.log(data);
                        }
                      );
                      this.DebtsService.createDebts(objDebts).subscribe(
                        (data: any) => {
                          console.log(data);
                          if (data.status) {
                            Swal.fire({
                              toast: true,
                              position: 'top-end',
                              showConfirmButton: false,
                              timer: 3000,
                              title: 'Thành Công!',
                              text: 'Đã đặt hàng thành công!!',
                              icon: 'success',
                              timerProgressBar: true,
                              didOpen: (toast) => {
                                toast.addEventListener(
                                  'mouseenter',
                                  Swal.stopTimer
                                );
                                toast.addEventListener(
                                  'mouseleave',
                                  Swal.resumeTimer
                                );
                              },
                            });

                            this.modalService
                              .open(this.myModal)
                              .result.then((result) => {
                                console.log(result);
                              
                                console.log(obj);
                                if(result){
                                  this.replaceKeysWithData(obj);
                                  const newWindow =
                                    this.TabwindowsService.openWindow(
                                      'about:blank',
                                      'NewWindow',
                                      800,
                                      600
                                    );
                                  newWindow?.document.write(
                                    `<html><head><title>Website quản lý bán hàng cho doanh nghiệp NextGo</title></head><body>${this.formPrintf.form}</body></html>`
                                  );
                                  newWindow?.document.close();
                                  newWindow?.print();
                                }else {
                                  window.location.reload();
                                }
                              })
                              .catch((res) => {});
                            // setTimeout(() => {
                            //   window.location.reload();
                            // }, 1000);
                          }
                        }
                      );
                    } else {
                      this.PaymentService.createPayment(dataResult).subscribe(
                        (data: any) => {
                          console.log(data);
                        }
                      );

                      this.modalService
                        .open(this.myModal)
                        .result.then((result) => {
                          if(result){
                            this.replaceKeysWithData(obj);
                            const newWindow = this.TabwindowsService.openWindow(
                              'about:blank',
                              'NewWindow',
                              800,
                              600
                            );
                            newWindow?.document.write(
                              `<html><head><title>Website quản lý bán hàng cho doanh nghiệp NextGo</title></head><body>${this.formPrintf.form}</body></html>`
                            );
                            newWindow?.document.close();
                            newWindow?.print();
                          }else {
                            window.location.reload();
                          }
                        })
                        .catch((res) => {});
                    }

                    
                  }

                  this.dataCurrent[this.tabDefault].ListProductCart = [];
                    this.dataCurrent[this.tabDefault].infoOrder = [];
                    console.log(this.dataCurrent[this.tabDefault]);
                    this.listProductCart = this.dataCurrent.map(
                      (value: any, index: number) => {
                        return value.ListProductCart;
                      }
                    );
                    this.dataInfoUser = this.dataCurrent.map(
                      (value: any, index: number) => {
                        return value.infoOrder;
                      }
                    );

                    this.selectedSearchPersonId = 1;

                    this.pricePayment = this.dataBtnPayment[
                      this.tabDefault
                    ].reduce(
                      (acc: number, item: any) => acc + item.pricePayment,
                      0
                    );

                    this.changeBill = 0;
                    console.log(this.dataBill[this.tabDefault]);
                    

                    this.dataBill[this.tabDefault].cash =  0; 
                    this.dataBill[this.tabDefault].totalPrice =  0; 
                    this.dataBill[this.tabDefault].discount =  0; 
                    this.dataBill[this.tabDefault].tax =  0; 
                    this.dataBill[this.tabDefault].service =  0; 
                    this.dataBill[this.tabDefault].radio =  1; 
                    this.priceBill = 0;
                    this.totalMoney = 0;
                    this.cashPrice = 0;
                    this.paymentPrice =0;
                    // = {
                    //   discount: 0,
                    //   tax: 0,
                    //   totalPrice: 0,
                    //   service: 0,
                    //   radio: 1,
                    //   cash: 0,
                    // };

                    this.dataBtnPayment[this.tabDefault] = [
                      {
                        payment_method: 0,
                        pricePayment: 0,
                        status: false,
                      },
                    ];
                    this.productItemsBatches[this.tabDefault] = [];
                    this.modalData[this.tabDefault] = [];

                    dataformBtn = this.dataBtnPayment;
                    dataformBatches = this.productItemsBatches;
                    productCart = this.listProductCart;

                    localStorage.setItem(
                      'tabOrder',
                      JSON.stringify(this.dataCurrent)
                    );
                    localStorage.setItem(
                      'dataBill',
                      JSON.stringify(this.dataBill)
                    );
                    localStorage.setItem(
                      'TabModal',
                      JSON.stringify(this.modalData)
                    );
                    localStorage.setItem(
                      'dataPayment',
                      JSON.stringify(this.dataBtnPayment)
                    );
                    localStorage.setItem(
                      'dataBatches',
                      JSON.stringify(this.productItemsBatches)
                    );
                    this.dataBtnPayment = dataformBtn;
                    this.productItemsBatches = dataformBatches;
                    this.listProductCart = productCart;
                } else {
                  console.log(this.modalData);
                  if (dataPayementApi && dataDebtsApi) {
                    objDebts.amount_debt = dataDebtsApi.pricePayment;

                    this.PaymentService.createPayment(dataResult).subscribe(
                      (data: any) => {
                        console.log(data);
                      }
                    );
                    this.DebtsService.createDebts(objDebts).subscribe(
                      (data: any) => {
                        if (data.status) {
                          // console.log(dataDebtsApi);
                          // console.log(dataResult);

                          Swal.fire({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            title: 'Thành Công!',
                            text: 'Đã đặt hàng thành công!!',
                            icon: 'success',
                            timerProgressBar: true,
                            didOpen: (toast) => {
                              toast.addEventListener(
                                'mouseenter',
                                Swal.stopTimer
                              );
                              toast.addEventListener(
                                'mouseleave',
                                Swal.resumeTimer
                              );
                            },
                          });
                          this.modalService
                            .open(this.myModal)
                            .result.then((result) => {
                              console.log(result);

                              console.log(obj);
                              this.resultBill(this.tabDefault);
                              if(result){

                                this.replaceKeysWithData(obj);
                              const newWindow =
                                this.TabwindowsService.openWindow(
                                  'about:blank',
                                  'NewWindow',
                                  800,
                                  600
                                );
                              newWindow?.document.write(
                                `<html><head><title>Website quản lý bán hàng cho doanh nghiệp NextGo</title></head><body>${this.formPrintf.form}</body></html>`
                              );
                              newWindow?.document.close();
                              newWindow?.print();
                              }else {
                                window.location.reload();
                              }
                            })
                            .catch((res) => {});
                          // setTimeout(() => {
                          //   window.location.reload();
                          // },1000)
                        }
                      }
                    );
                  } else {
                    if (this.changeBill > 0) {
                      dataResult.push({
                        payment_method: 2,
                        pricePayment: this.paymentPrice,
                        status: true,
                        paymentable_id: idOrder,
                        amount: this.priceBill,
                        amount_in: this.pricePayment,
                        amount_refund: this.changeBill,
                        note:
                          this.dataBill[this.tabDefault].note == undefined
                            ? ''
                            : this.dataBill[this.tabDefault].note,
                        reference_code: null,
                        statusMap: true,
                      });
                      this.PaymentService.createPayment(dataResult).subscribe(
                        (data: any) => {
                          console.log(data);
                        }
                      );
                      this.DebtsService.createDebts(objDebts).subscribe(
                        (data: any) => {
                          if (data.status) {
                            Swal.fire({
                              toast: true,
                              position: 'top-end',
                              showConfirmButton: false,
                              timer: 3000,
                              title: 'Thành Công!',
                              text: 'Đã đặt hàng thành công!!',
                              icon: 'success',
                              timerProgressBar: true,
                              didOpen: (toast) => {
                                toast.addEventListener(
                                  'mouseenter',
                                  Swal.stopTimer
                                );
                                toast.addEventListener(
                                  'mouseleave',
                                  Swal.resumeTimer
                                );
                              },
                            });

                            this.modalService
                              .open(this.myModal)
                              .result.then((result) => {
                                console.log(result);
                                this.resultBill(this.tabDefault);
                                console.log(obj);

                                if(result){
                                  this.replaceKeysWithData(obj);
                                const newWindow =
                                  this.TabwindowsService.openWindow(
                                    'about:blank',
                                    'NewWindow',
                                    800,
                                    600
                                  );
                                newWindow?.document.write(
                                  `<html><head><title>Website quản lý bán hàng cho doanh nghiệp NextGo</title></head><body>${this.formPrintf.form}</body></html>`
                                );
                                newWindow?.document.close();
                                newWindow?.print();
                                }else {
                                  window.location.reload();
                                }
                              })
                              .catch((res) => {});
                            // setTimeout(() => {
                            //   window.location.reload();
                            // }, 1000);
                          }
                        }
                      );
                    } else {
                      this.PaymentService.createPayment(dataResult).subscribe(
                        (data: any) => {
                          console.log(data);
                        }
                      );

                      Swal.fire({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        title: 'Thành Công!',
                        text: 'Đã đặt hàng thành công!!',
                        icon: 'success',
                        timerProgressBar: true,
                        didOpen: (toast) => {
                          toast.addEventListener('mouseenter', Swal.stopTimer);
                          toast.addEventListener(
                            'mouseleave',
                            Swal.resumeTimer
                          );
                        },
                      });

                      this.modalService
                        .open(this.myModal)
                        .result.then((result) => {
                          this.resultBill(this.tabDefault);
                          if(result){
                            this.replaceKeysWithData(obj);
                          const newWindow = this.TabwindowsService.openWindow(
                            'about:blank',
                            'NewWindow',
                            800,
                            600
                          );
                          newWindow?.document.write(
                            `<html><head><title>Website quản lý bán hàng cho doanh nghiệp NextGo</title></head><body>${this.formPrintf.form}</body></html>`
                          );
                          newWindow?.document.close();
                          newWindow?.print();
                          }else {
                            window.location.reload();
                          }
                        })
                        .catch((res) => {});
                    }
                  }

                  this.dataCurrent.splice(this.tabDefault, 1);
                  this.dataBill.splice(this.tabDefault, 1);
                  this.dataBtnPayment.splice(this.tabDefault, 1);
                  this.modalData.splice(this.tabDefault, 1);
                  this.productItemsBatches.splice(this.tabDefault, 1);
                  this.tabDefault = this.tabDefault - 1;
                  this.singleTax = this.dataBill[this.tabDefault].discount;
                  this.DiscountBill = this.dataBill[this.tabDefault].tax;
                  this.taxBill = this.dataBill[this.tabDefault].service;
                  this.modelRadioBill = this.dataBill[this.tabDefault].radio;
                  this.priceBill = this.dataBill[this.tabDefault].totalPrice;

                  if (
                    Object.keys(this.dataCurrent[this.tabDefault].infoOrder)
                      .length > 0
                  ) {
                    this.selectedSearchPersonId =
                      this.dataCurrent[this.tabDefault].infoOrder.id;
                  } else {
                    this.selectedSearchPersonId = 1;
                  }

                  dataformBtn = this.dataBtnPayment;
                  dataformBatches = this.productItemsBatches;
                  productCart = this.listProductCart;

                  console.log(this.modalData);
                  localStorage.setItem(
                    'tabOrder',
                    JSON.stringify(this.dataCurrent)
                  );
                  localStorage.setItem(
                    'dataBill',
                    JSON.stringify(this.dataBill)
                  );
                  localStorage.setItem(
                    'TabModal',
                    JSON.stringify(this.modalData)
                  );
                  localStorage.setItem(
                    'dataPayment',
                    JSON.stringify(this.dataBtnPayment)
                  );
                  localStorage.setItem(
                    'dataBatches',
                    JSON.stringify(this.productItemsBatches)
                  );
                  this.DatalayoutService.changeData({
                    tabCurrent: this.tabDefault,
                  });

                  localStorage.setItem(
                    'TabCurrentIndex',
                    JSON.stringify(this.tabDefault)
                  );
                }
                // console.log(dataformBtn);

                this.listProductCart = productCart;

                this.dataBtnPayment = dataformBtn;
                this.productItemsBatches = dataformBatches;
                // console.log(this.dataBtnPayment);
              }else {
                const errorMessages = [];
                for (const key in data.meta.errors) {
                  const messages = data.meta.errors[key];
                  for (const message of messages) {
                    errorMessages.push(`${key}: ${message}`);
                  }
                }
                this.showNextMessage(errorMessages);
              }
            });
            console.log(this.dataBtnPayment);
          // } else {
          //   Swal.fire({
          //     toast: true,
          //     position: 'top-end',
          //     showConfirmButton: false,
          //     timer: 3000,
          //     title: 'Thất bại!',
          //     text: 'Vui lòng thêm khách hàng vào đơn!!',
          //     icon: 'error',
          //     timerProgressBar: true,
          //     didOpen: (toast) => {
          //       toast.addEventListener('mouseenter', Swal.stopTimer);
          //       toast.addEventListener('mouseleave', Swal.resumeTimer);
          //     },
          //   });
          // }
        }
      })
      .catch((res) => {});
  }

  replaceKeysWithData(objectData: any = {}) {
    console.log(objectData.Listproducts);
    for (const key in objectData) {
      if (key === 'Listproducts' && objectData.hasOwnProperty(key)) {
        const productListHtml = objectData.Listproducts.map(
          (detail: any, index: number) => {
            const placeholders = [
              'display_name',
              'priceModal',
              'quanity',
              'result',
            ];
            const productHtml = placeholders
              .map((property) => {
                if (property === 'priceModal') {
                  return `<td>${detail[property].result}</td>`;
                } else {
                  return `<td>${detail[property]}</td>`;
                }
              })
              .join('');

            const additionalRow = `<td>KM</td><td></td><td></td><td>${
              detail['priceModal'].priceCurrent - detail['priceModal'].result
            }</td>`;

            return `<tr>${productHtml}</tr><tr>${additionalRow}</tr>`;
          }
        ).join('');
        this.formPrintf.form = this.formPrintf.form.replace(
          '{Listproducts}',
          productListHtml
        );
      } else {
        console.log(2);
        const placeholder = `{${key}}`;
        const value = objectData[key];
        this.formPrintf.form = this.formPrintf.form.replace(
          new RegExp(placeholder, 'g'),
          value
        );
      }
    }
  }

  limitInputTax(event: any) {
    if (+event.target.value > 100) {
      event.target.value = 100;
      this.tax = 100;
    } else if (+event.target.value < 0 || event.target.value == '') {
      event.target.value = 0;
      this.tax = 0;
    }
  }

  increaseQuantity(id: number) {
    console.log(this.listProductCart[this.tabDefault]);
    const ResultFind = this.listProductCart[this.tabDefault].find(
      (itemCurrent: any) => itemCurrent.id === id
    );
    console.log(ResultFind);
    if(ResultFind.quanity >= ResultFind.quantity){
       Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Thất bại!',
              text: 'Vui lòng nhập thêm sản phẩm vào kho để thêm tiếp!!',
              icon: 'error',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            return;
    }
    
    let inputValue = <HTMLInputElement>document.getElementById(`${id}`);
    const count = 1 + Number(inputValue.value);
    this.updateQuantity(
      this.listProductCart[this.tabDefault],
      +id,
      count,
      'quanity'
    );
    this.totalMoney = this.listProductCart[this.tabDefault].reduce(
      (total: number, current: any) => {
        return total + current.result;
      },
      0
    );
    this.resultBill(this.tabDefault);
    localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
  }

  decreaseQuantity(id: number) {
    let inputValue = <HTMLInputElement>document.getElementById(`${id}`);
    if (+inputValue.value > 0) {
      this.updateQuantity(
        this.listProductCart[this.tabDefault],
        +id,
        Number(inputValue.value) - 1,
        'quanity'
      );
      this.totalMoney = this.listProductCart[this.tabDefault].reduce(
        (total: number, current: any) => {
          return total + current.result;
        },
        0
      );
      this.resultBill(this.tabDefault);
      console.log("test" + this.tabDefault);
      
      localStorage.setItem('tabOrder', JSON.stringify(this.dataCurrent));
    }
  }

  removeBatches(id: number) {}

  increaseQuantityBatches(id: number) {
    let inputValue = <HTMLInputElement>(
      document.getElementById(`quantityBatches-${id}`)
    );
    const count = 1 + Number(inputValue.value);
    // console.log(inputValue.value);
    const dataBatches = this.selectedPeopleBatches.find(
      (item: any) => item.id === id
    );
    dataBatches.payQuality = count;
    localStorage.setItem(
      'dataBatches',
      JSON.stringify(this.productItemsBatches)
    );
  }

  decreaseQuantityBatches(id: number) {
    let inputValue = <HTMLInputElement>(
      document.getElementById(`quantityBatches-${id}`)
    );
    if (+inputValue.value > 0) {
      console.log(this.productItemsBatches);

      const dataBatches = this.selectedPeopleBatches.find(
        (item: any) => item.id === id
      );
      dataBatches.payQuality = +inputValue.value - 1;
      localStorage.setItem(
        'dataBatches',
        JSON.stringify(this.productItemsBatches)
      );
    }
  }

  removePayment(index: number) {
    console.log(index);
    if (index == 0) {
      console.log(this.dataBtnPayment[this.tabDefault]);

      const data = this.dataBtnPayment[this.tabDefault][index];
      data.payment_method = 0;
      data.pricePayment = 0;
      data.status = false;
      this.pricePayment = this.dataBtnPayment[this.tabDefault].reduce(
        (acc: number, item: any) => acc + item.pricePayment,
        0
      );
      if (this.pricePayment > this.priceBill) {
        this.changeBill = this.pricePayment - this.priceBill;
        this.paymentPrice = 0;
      } else {
        this.changeBill = 0;
        this.paymentPrice = this.priceBill - this.pricePayment;
      }
      localStorage.setItem('dataPayment', JSON.stringify(this.dataBtnPayment));
    } else {
      this.dataBtnPayment[this.tabDefault].splice(index, 1);
      this.pricePayment = this.dataBtnPayment[this.tabDefault].reduce(
        (acc: number, item: any) => acc + item.pricePayment,
        0
      );
      if (this.pricePayment > this.priceBill) {
        this.changeBill = this.pricePayment - this.priceBill;
        this.paymentPrice = 0;
      } else {
        this.changeBill = 0;
        this.paymentPrice = this.priceBill - this.pricePayment;
      }
      localStorage.setItem('dataPayment', JSON.stringify(this.dataBtnPayment));
    }
    console.log(this.dataBtnPayment);
  }

  updateQuantity(array: any, id: number, newQuantity: any, name: string) {
    const typeUpdate = name === 'quanity' ? 'quanity' : 'price_export';
    const resultType = name === 'quanity' ? 'price_export' : 'quanity';
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        array[i][typeUpdate] = newQuantity;
        array[i].result = newQuantity * array[i][resultType];
        break;
      }
    }
  }

  updateModal(array: any, id: number, newQuantity: any) {
    console.log(array);

    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        for (const [key, value] of Object.entries(newQuantity)) {
          array[i][key] = value;
        }
        // array[i][typeUpdate] = newQuantity;
        // array[i].result = newQuantity * array[i][resultType];
        break;
      }
    }
  }

  updateBill(array: any, id: number, newQuantity: any) {
    console.log(array);
    for (let i = 0; i < array.length; i++) {
      if (i === id) {
        for (const [key, value] of Object.entries(newQuantity)) {
          array[i][key] = value;
        }
        // array[i][typeUpdate] = newQuantity;
        // array[i].result = newQuantity * array[i][resultType];
        break;
      }
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
