import { Component, OnInit, AfterViewInit, TemplateRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { DataTable } from 'simple-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { Debts } from 'src/app/interface/debts/debts';
import { DebtsService } from 'src/app/service/debts/debts.service';
import { LocationsService } from 'src/app/service/locations/locations.service';
import { LocalStorageService } from 'src/app/service/localStorage/localStorage.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListRepayComponent implements OnInit {

  listRepay: Observable<any>;
  isLoading = false;
  basicModalCloseResult: string = '';
  totalRevenue: number;
  uncollectedMoney: number;

  inventory: any[] = [];
  codeInventory: number;

  constructor(
    private _recoService: DebtsService,
    private modalService: NgbModal,
    private _locationService: LocationsService,
    private _localStorage: LocalStorageService,

  ) {
    this.listRepay = new Observable();
   }

  ngOnInit(): void {
    this.refreshData(null);
    this._locationService.GetData().subscribe({
      next: (res: any) => {
        if (res.status == true) {
          this.inventory = res.payload;
          // console.log(this.inventory);
        }
      },
    });
  }
  onInventory() {
    if (this.codeInventory) {
      // console.log(this.codeInventory);
      this.refreshData(this.codeInventory);
    } else {
      this.refreshData(null);
    }
  }

  refreshData(id: any): void{
    this.isLoading = true;
    let inventory = this._localStorage.get('location');
    let dataSend = null;
    if (inventory.name != "Tất cả") {
      dataSend = {
        location_id: inventory.id,
        type: 1,
      };
    } else {
      dataSend = {
        type: 1,
      };
    }
    this._recoService.getAllRepay(dataSend).subscribe({
      next: (res: any) => {
        // console.log(res.data);
        if(res.status == true){
          this.listRepay = of(res.payload) ;
          const payment: any[] = res.payload
          // console.log(res.payload.data);
          this.totalRevenue = 0;
          if(res.payload){
            payment.forEach((payment) => {
              this.totalRevenue += payment.amount_debt;
            });
            payment.forEach((payment) => {
              this.uncollectedMoney = payment.amount_debt - payment.amount_paid;
            });
          }
          this.isLoading = false;
          // console.log(this.listBrands);
          this.listRepay.subscribe(
            (res)=> {
              setTimeout(() => {
                const db = new DataTable('#dataTableExample');
                db.on('datatable.init', () => {
                  // db.destroy();
                  // this.addDeleteEventHandlers();
              });
              }, 0)
            })

        }
      },
      error: (err: any) => {
        // console.log(err);
        Swal.fire('Lỗi!', 'Có lỗi xảy ra.', 'error');
      }
    })
  }

  status(key: number): any{
    // const result = [];
    if(key == 0){
       return ['Quá hạn', 'bg-danger'];
    }else if(key == 1){
      return ['Chưa thanh toán', 'bg-warning'];
    }else if(key == 2){
      return ['Thanh toán 1 phần', 'bg-primary']
    }else if(key == 3){
      return ['Đã thanh toán', 'bg-success']
    }

  }

}
