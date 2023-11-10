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
  constructor(
    private router : Router,
    private DatalayoutService : DatalayoutService
  ) { }

  ngOnInit(): void {
    let tabOrder = localStorage.getItem('tabOrder');
    let tabCurrentJson = localStorage.getItem('TabCurrentIndex')!;
    let tabModalJson = localStorage.getItem('TabModal')!;
    let OutPutResult = localStorage.getItem('dataBill')!;
    if (!tabOrder || !tabCurrentJson || !tabModalJson || !OutPutResult) {
        this.tabOder =[
          {
            ListProductCart: [{
              id: 1,
              image: '123',
              display_name: 'làm đẹp',
              sku : 'C653153A449SSJ',
              unit: 'chai',
              quanity: 2,
              price_export: 100000,
              result: 200000
            },{
              id: 2,
              image: '123',
              display_name: 'làm đẹp 2',
              sku : 'C653153A449SSJ',
              unit: 'chai',
              quanity: 2,
              price_export: 100000,
              result: 200000
            },{
              id: 3,
              image: '123',
              display_name: 'làm đẹp 3',
              sku : 'C653153A449SSJ',
              unit: 'chai',
              quanity: 2,
              price_export: 100000,
              result: 200000
            }],
            infoOrder: {}
          } ,
          {
            ListProductCart: [{
              id: 1,
              image: '123',
              display_name: 'làm đẹp tab2',
              sku : 'C653153A449SSJ',
              unit: 'chai',
              quanity: 2,
              price_export: 300000,
              result: 200000
            },{
              id: 2,
              image: '1234',
              display_name: 'làm đẹp 2 tab2',
              sku : 'C653153A449SSJ',
              unit: 'cm',
              quanity: 3,
              price_export: 150000,
              result: 300000
            },{
              id: 3,
              image: '1234',
              display_name: 'làm đẹp 2 tab2',
              sku : 'C653153A449SSJ',
              unit: 'cm',
              quanity: 3,
              price_export: 200000,
              result: 300000
            }],
            infoOrder: {}
          } 
        ];

        this.tabCurrent = 0;
        this.modalPrice = [
          [
            {
              id : 1 ,
              priceCurrent : 100000,
              discount : 10,
              tax : 0,
              radioDiscount : 1,
              result : 90000
            },
            {
              id : 2 ,
              priceCurrent : 100000,
              discount : 0,
              tax : 0,
              radioDiscount : 1,
              result : 100000
            },
            {
              id : 3 ,
              priceCurrent : 100000,
              discount : 0,
              tax : 0,
              radioDiscount : 1,
              result : 100000
            }
          ],
          [
            {
              id : 1 ,
              priceCurrent : 300000,
              discount : 0,
              tax : 0,
              radioDiscount : 1,
              result : 300000
            },
            {
              id : 2 ,
              priceCurrent : 150000,
              discount : 0,
              tax : 0,
              radioDiscount : 1,
              result : 150000
            },
            {
              id : 3 ,
              priceCurrent : 200000,
              discount : 0,
              tax : 0,
              radioDiscount : 1,
              result : 200000
            }
          ]
        ]

        this.dataBill = [
          {
            discount : 12,
            tax : 10,
            totalPrice : 891000,
            service : 0,
            radio : 1,
            cash : 0,
          },
          {
            discount : 10,
            tax : 10,
            totalPrice : 900000,
            service : 0,
            radio : 1,
            cash : 0,
          }
        ]
        localStorage.setItem('tabOrder', JSON.stringify(this.tabOder));
        localStorage.setItem('TabCurrentIndex', JSON.stringify(this.tabCurrent));
        localStorage.setItem('TabModal', JSON.stringify(this.modalPrice));
        localStorage.setItem('dataBill', JSON.stringify(this.dataBill));
        
    } else {
        this.tabOder = JSON.parse(tabOrder);
        this.tabCurrent = JSON.parse(tabCurrentJson);
        this.modalPrice =  JSON.parse(tabModalJson);
        this.dataBill =  JSON.parse(OutPutResult);
    }
    this.DatalayoutService.changeData({tabOrder :  this.tabOder ,tabCurrent : this.tabCurrent,tabModal : this.modalPrice,dataBill : this.dataBill });
    

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
    
    this.DatalayoutService.triggerEvent('addTabOder',{tabOder : this.tabOder});
  }

  onLogout(e: Event) {
    e.preventDefault();
    localStorage.removeItem('isLoggedin');

    if (!localStorage.getItem('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    }
  }
}
