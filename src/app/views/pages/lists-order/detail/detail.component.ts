import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/service/order/order.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  dataOneFake: any;
  // = {
  //   id : 1,
  //   location_id : 1,
  //   customer_id : 1,
  //   created_by : 1,
  //   discount : 0,
  //   discount_type : 1,
  //   tax : 0,
  //   service_charge : 0,
  //   total_product : 2,
  //   total_price : 800000,
  //   status : 1,
  //   payment_status : 2,
  //   created_at : "2023-11-16 13:07:48",
  //   updated_at :  "2023-11-16 13:07:48" ,
  //   customer_data: {
  //     id : 1,
  //     group_customer_id : 1,
  //     type : 0,
  //     name : "Mrs. Guadalupe Howe V",
  //     gender : '1',
  //     dob : "2023-10-10",
  //     email : 'qruecker@gmail.com',
  //     tel :'+13522029219',
  //     status : 1,
  //     province_code : 100000,
  //     district_code : 29,
  //     ward_code : 10222,
  //     address_detail : 'Nhà cách mặt đất 1m, xung quanh toàn đất là đất và...',
  //     note : 'Đang tuyển vợ',
  //     created_at : '2023-11-16 13:01:17',
  //     updated_at : '2023-11-16 13:01:17',
  //     customer_type : 0
  //   },
  //   order_detail: [{
  //       id : 1,
  //       order_id : 1,
  //       variation_id : 3,
  //       batch_id : null,
  //       discount : 0,
  //       discount_type : 1,
  //       tax : 0,
  //       quantity : 1,
  //       total_price : 0,
  //       variations : {
  //         id : 1,
  //         product_id : 1,
  //         sku : 'WW5K5174VN/SV',
  //         barcode : 'D9VT5UF',
  //         variation_name : 'Đỏ',
  //         display_name : 'Đỏ',
  //         image : null,
  //         price_import : 1200000,
  //         price_export : 800000,
  //         status : 1,
  //         created_at : null,
  //         updated_at: null
  //       }
  //     },
  //     {
  //       id : 2,
  //       order_id : 1,
  //       variation_id : 3,
  //       batch_id : null,
  //       discount : 0,
  //       discount_type : 1,
  //       tax : 0,
  //       quantity : 1,
  //       total_price : 0,
  //       batches : [{
  //         id : 1,
  //         code : 203,
  //         variation_id : 1,
  //         manufacture_date : '11/17/2023',
  //         expiration_date  : '11/17/2023',
  //         created_at : null,
  //         update_at : null,
  //       }],
  //       variations : {
  //         id : 2,
  //         product_id : 1,
  //         sku : 'WW10K5233YW/SV',
  //         barcode : '15_EOSF',
  //         variation_name : 'Xanh',
  //         display_name : 'Xanh',
  //         image : null,
  //         price_import : 700000,
  //         price_export : 500000,
  //         status : 1,
  //         created_at : null,
  //         updated_at: null
  //       }
  //     }
  //   ],
  //   payment: [
  //     {
  //       id : 1,
  //       paymentable_id : 1,
  //       amount : 200000,
  //       amount_in : 200000,
  //       amount_refund : 0,
  //       payment_method : 0,
  //       payment_at : '2023-11-16 13:07:48',
  //       reference_code : null,
  //       note : null,
  //       created_by : 1,
  //       created_at : '2023-11-16 13:07:48',
  //       updated_at : '2023-11-16 13:07:48'
  //     },
  //     {
  //       id : 2,
  //       paymentable_id : 2,
  //       amount : 600000,
  //       amount_in : 600000,
  //       amount_refund : 0,
  //       payment_method : 2,
  //       payment_at : '2023-11-16 13:07:48',
  //       reference_code : null,
  //       note : null,
  //       created_by : 1,
  //       created_at : '2023-11-16 13:07:48',
  //       updated_at : '2023-11-16 13:07:48'
  //     }
  //   ]
  // }
  id: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private OrderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((queryParams) => {
      const id = queryParams.get('id');
      if (id !== null) {
        this.id = id;

        this.OrderService.GetOneRecord(id).subscribe(
          (data) => {
            this.dataOneFake = data.payload;
            this.dataOneFake.amount_in = this.dataOneFake.payment.reduce(
              (total: number, item: any) => {
                if (item.payment_method === 0 || item.payment_method === 1) {
                  total += item.amount;
                }
                return total;
              },
              0
            );
            this.dataOneFake.change =
              this.dataOneFake.amount_in > this.dataOneFake.total_price
                ? this.dataOneFake.amount_in - this.dataOneFake.amount_refund
                : 0;
          },
          (error) => {
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi dữ liệu.', 'error');
          }
        );
      } else {
        this.router.navigate(['../categories/list']);
      }
    });
  }
}
