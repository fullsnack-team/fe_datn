import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { DataTable } from 'simple-datatables';
import { ItemUnitsService } from 'src/app/service/item_units/item-units.service';
import { OrderService } from 'src/app/service/order/order.service';
import { Order } from 'src/app/interface/order/order';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  fakeData: Observable<Order[]>;
//    : any = [{
//     id : 1,
//     location_id : 1,
//     customer_id : 1,
//     created_by : 1,
//     discount : 0,
//     discount_type : 1,
//     tax : 0,
//     service_charge : 0,
//     total_product : 2,
//     total_price : 800000,
//     status : 1,
//     payment_status : 2,
//     created_at : "2023-11-16 13:07:48",
//     updated_at :  "2023-11-16 13:07:48" ,
//     customer_data: {
//       id : 1,
//       group_customer_id : 1,
//       type : 0,
//       name : "Mrs. Guadalupe Howe V",
//       gender : '1',
//       dob : "2023-10-10",
//       email : 'qruecker@gmail.com',
//       tel :'+13522029219',
//       status : 1,
//       province_code : 100000,
//       district_code : 29,
//       ward_code : 10222,
//       address_detail : 'Nhà cách mặt đất 1m, xung quanh toàn đất là đất và...',
//       note : 'Đang tuyển vợ',
//       created_at : '2023-11-16 13:01:17',
//       updated_at : '2023-11-16 13:01:17',
//       customer_type : 0
//     },
//     order_detail: [{
//         id : 1,
//         order_id : 1,
//         variation_id : 3,
//         batch_id : null,
//         discount : 0,
//         discount_type : 1,
//         tax : 0,
//         quantity : 1,
//         total_price : 0
//       },
//       {
//         id : 1,
//         order_id : 1,
//         variation_id : 3,
//         batch_id : null,
//         discount : 0,
//         discount_type : 1,
//         tax : 0,
//         quantity : 1,
//         total_price : 0
//       }
//     ],
//     payment: [
//       {
//         id : 1,
//         paymentable_id : 1,
//         amount : 200000,
//         amount_in : 200000,
//         amount_refund : 0,
//         payment_method : 0,
//         payment_at : '2023-11-16 13:07:48',
//         reference_code : null,
//         note : null,
//         created_by : 1,
//         created_at : '2023-11-16 13:07:48',
//         updated_at : '2023-11-16 13:07:48'
//       },
//       {
//         id : 2,
//         paymentable_id : 2,
//         amount : 600000,
//         amount_in : 600000,
//         amount_refund : 0,
//         payment_method : 2,
//         payment_at : '2023-11-16 13:07:48',
//         reference_code : null,
//         note : null,
//         created_by : 1,
//         created_at : '2023-11-16 13:07:48',
//         updated_at : '2023-11-16 13:07:48'
//       }
//     ]
//   }
// ];
  isLoading = false;
  constructor(
    private _unitsService: ItemUnitsService,
    private OrderService:OrderService
    ) {
      this.fakeData = new Observable();
  }

  ngOnInit(): void {
    this.refreshData();
  }

  ngAfterViewInit(): void {
    this.fakeData.subscribe(() => {
      setTimeout(() => {
        const db = new DataTable('#dataTableExample');
        setTimeout(() => {
          const db = new DataTable('#dataTableExample');
          db.on('datatable.init', () => {
            this.addDeleteEventHandlers();
        });
        }, 0)
      }, 0);
    });
  }

  addDeleteEventHandlers(): void {
    const deleteButtons = document.getElementsByClassName('btn-danger');
    Array.from(deleteButtons).forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = (event.target as Element).getAttribute('id');
        this.deleteItem(Number(id));
      });
    });
  }

  // ...

  deleteItem(id: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: 'Bạn sẽ không thể hoàn tác lại hành động này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, xóa nó!',
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, delete the category
        this._unitsService.delete(id).subscribe(
          (response) => {
            Swal.fire({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 1000,
              title: "Đã xóa!",
              text: "Đơn vị đã được xóa.",
              icon: "success",
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });
            // Navigate to the list after successful deletion
            setTimeout(() => {
              location.reload();
            }, 1000);
          },
          (error) => {
            if(error.success == false){
              Swal.fire('Lỗi!',`${error.meta.name}`, 'error');
            }
          }
        );
      }
    });
  }

  refreshData(): void{
    this.isLoading = true;
    this.OrderService.GetData().subscribe({
      next: (res: any) => {
        // console.log(res.status);
        if(res.status == true){
          this.fakeData = of(res.payload.data) ;
          this.isLoading = false;
          this.fakeData.subscribe(
            (res)=> {
              setTimeout(() => {
                const db = new DataTable('#dataTableExample');
                db.on('datatable.init', () => {
                  this.addDeleteEventHandlers();
              });
              }, 0)
            })

        }
      },
      error: (err: any) => {
        console.log(err);
        Swal.fire('Lỗi!', 'Có lỗi xảy ra. Vui lòng liên hệ QTV.', 'error');
      }
    })
  }

}
