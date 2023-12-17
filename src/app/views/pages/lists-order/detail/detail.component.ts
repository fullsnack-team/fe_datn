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
  id: string;
  isLoading = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private OrderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((queryParams) => {
      this.isLoading = true;
      const id = queryParams.get('id');
      if (id !== null) {
        this.id = id;

        this.OrderService.GetOneRecord(id).subscribe(
          (data) => {
            this.dataOneFake = data.payload;
            console.log(data.payload);
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
                this.isLoading = false;
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
