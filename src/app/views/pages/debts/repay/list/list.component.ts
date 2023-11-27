import { Component, OnInit, AfterViewInit, TemplateRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { DataTable } from 'simple-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { Debts } from 'src/app/interface/debts/debts';
import { DebtsService } from 'src/app/service/debts/debts.service';

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

  constructor(
    private _recoService: DebtsService,
    private modalService: NgbModal

  ) {
    this.listRepay = new Observable();
   }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void{
    this.isLoading = true;
    this._recoService.getAllRepay({type: 1}).subscribe({
      next: (res: any) => {
        // console.log(res.data);
        if(res.status == true){
          this.listRepay = of(res.payload.data) ;
          const payment: any[] = res.payload.data
          console.log(res.payload.data);
          this.totalRevenue = 0;
          if(res.payload.data){
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
                  // this.addDeleteEventHandlers();
              });
              }, 0)
            })

        }
      },
      error: (err: any) => {
        console.log(err);
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
