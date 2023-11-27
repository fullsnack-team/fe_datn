import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatalayoutService } from 'src/app/service/handleDataComponent/datalayout.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'navbar-sell',
  templateUrl: './navbarsell.component.html',
  styleUrls: ['./navbarsell.component.scss']
})
export class NavbarsellComponent implements OnInit {
  tabOder : any;
  tabCurrent : number ;
  modalPrice : any;
  dataBill :  any;
  payment : any;
  modalBatches : any;
  docElement: HTMLElement;
isFullScreen: boolean = false;
  constructor(
    private router : Router,
    private DatalayoutService : DatalayoutService
  ) { }

  ngOnInit(): void {
    this.docElement = document.documentElement;
    let tabOrder = localStorage.getItem('tabOrder');
    let tabCurrentJson = localStorage.getItem('TabCurrentIndex')!;
    let tabModalJson = localStorage.getItem('TabModal')!;
    let OutPutResult = localStorage.getItem('dataBill')!;
    let paymentResult = localStorage.getItem('dataPayment')!;
    let modalBathches= localStorage.getItem('dataBatches')!;
    if (!tabOrder || !tabCurrentJson || !tabModalJson || !OutPutResult || !paymentResult || !modalBathches) {
        this.tabOder =[
          {
            ListProductCart: [
            //   {
            //   id: 1,
            //   image: '123',
            //   display_name: 'làm đẹp',
            //   sku : 'C653153A449SSJ',
            //   unit: 'chai',
            //   quanity: 2,
            //   price_export: 100000,
            //   result: 200000
            // },{
            //   id: 2,
            //   image: '123',
            //   display_name: 'làm đẹp 2',
            //   sku : 'C653153A449SSJ',
            //   unit: 'chai',
            //   quanity: 2,
            //   price_export: 100000,
            //   result: 200000
            // },{
            //   id: 3,
            //   image: '123',
            //   display_name: 'làm đẹp 3',
            //   sku : 'C653153A449SSJ',
            //   unit: 'chai',
            //   quanity: 2,
            //   price_export: 100000,
            //   result: 200000
            // }
          ],
            infoOrder: {}
          }
        ];

        this.tabCurrent = 0;
        this.modalPrice = [
          [
            // {
            //   id : 1 ,
            //   priceCurrent : 100000,
            //   discount : 10,
            //   tax : 0,
            //   radioDiscount : 1,
            //   result : 90000
            // },
            // {
            //   id : 2 ,
            //   priceCurrent : 100000,
            //   discount : 0,
            //   tax : 0,
            //   radioDiscount : 1,
            //   result : 100000
            // },
            // {
            //   id : 3 ,
            //   priceCurrent : 100000,
            //   discount : 0,
            //   tax : 0,
            //   radioDiscount : 1,
            //   result : 100000
            // }
          ]
        ]
        this.modalBatches = [
          [
          
          ]
        ]


        this.dataBill = [
          {
            discount : 0,
            tax : 0,
            totalPrice : 0,
            service : 0,
            radio : 1,
            cash : 0,
          }
        ]

        this.payment = [
          [
            {
              payment_method : 0,
              pricePayment : 0,
              status : false
            }
          ]
        ]
        localStorage.setItem('tabOrder', JSON.stringify(this.tabOder));
        localStorage.setItem('TabCurrentIndex', JSON.stringify(this.tabCurrent));
        localStorage.setItem('TabModal', JSON.stringify(this.modalPrice));
        localStorage.setItem('dataBill', JSON.stringify(this.dataBill));
        localStorage.setItem('dataPayment', JSON.stringify(this.payment));
        localStorage.setItem('dataBatches', JSON.stringify(this.modalBatches));

        
    } else {
        this.tabOder = JSON.parse(tabOrder);
        this.tabCurrent = JSON.parse(tabCurrentJson);
        this.modalPrice =  JSON.parse(tabModalJson);
        this.dataBill =  JSON.parse(OutPutResult);
        this.payment =   JSON.parse(paymentResult);
        this.modalBatches =   JSON.parse(modalBathches);
    }
    this.DatalayoutService.changeData({tabOrder :  this.tabOder ,tabCurrent : this.tabCurrent,tabModal : this.modalPrice,dataBill : this.dataBill,payment : this.payment,dataBatches : this.modalBatches });
    

    this.DatalayoutService.currentData.subscribe((data) => {
      
      this.tabCurrent = data.tabCurrent;

    })

    this.DatalayoutService.eventCurrent.subscribe((event : any) => {
      switch (event.name) {
          case 'changeData':
            this.DatalayoutService.changeData({tabOrder :  event.data.tabOrder ,tabCurrent : event.data.tabCurrent,tabModal : event.data.tabModal });
            break;
      }
    })
  }

  changeTab(i: number) {
    this.DatalayoutService.triggerEvent('changeTab',{id : i});
    this.tabCurrent = i;
  }
  fullScreen(){
    if (!this.isFullScreen) {
      this.docElement.requestFullscreen();
    }
    else {
      document.exitFullscreen();
    }
    this.isFullScreen = !this.isFullScreen;
  }
  removeTab(index : number){
    if(index > 0){
      this.DatalayoutService.triggerEvent('removeTab',{idRemove : index,modalData : this.modalPrice});
    }else {
      console.log(this.tabOder[0].ListProductCart.length);
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: 'Thất bại!',
        text: 'Không thể xóa vì là đơn hàng mặc định',
        icon: 'error',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
    }
    
  }
  AddOder(){
    console.log(this.tabOder);
    
    this.DatalayoutService.triggerEvent('addTabOder',{tabOder : this.tabOder,modalDataAdd : this.modalPrice});
  }

  onLogout(e: Event) {
    e.preventDefault();
    localStorage.removeItem('isLoggedin');

    if (!localStorage.getItem('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    }
  }
}
