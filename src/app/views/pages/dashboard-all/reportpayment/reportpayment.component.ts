import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/service/report/report.service';
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-reportpayment',
  templateUrl: './reportpayment.component.html',
  styleUrls: ['./reportpayment.component.scss']
})
export class ReportpaymentComponent implements OnInit {

  title = 'ng-chart';
  start_time : string ;
  end_time : string;
  payments : any = [];
  result : any = {};
  chart : any = [];

  constructor(
    private ReportService: ReportService
  ) {
   
   }

  ngOnInit(): void {
    const currentDate = new Date();

    // Lấy thời gian 1 tháng trước
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    this.start_time = this.formatDate(oneMonthAgo);
    this.end_time = this.formatDate(currentDate);
    this.ReportService.payment('thirtyDays').subscribe((response: any) => {
      console.log(response.payload);
      
      this.payments = response.payload;
      this.chart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: response.payload.title,
          datasets: [
            {
              label: 'Doanh thu',
              data: response.payload.data,
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      
    });
  }

  private formatDate(date: Date): string {
    // Chuyển đổi ngày thành chuỗi theo định dạng yyyy-MM-dd
    return date.toISOString().split('T')[0];
  }

  searchDate(){
   
   
    if(this.end_time <= this.start_time){
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: 'Thất bại!',
        text: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu !',
        icon: 'error',
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
      return;
    }

    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      title: 'Thành Công!',
      text: 'Đang tải dữ liệu mới ! Vui lòng chờ...',
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
    // this.chart.destroy();
    console.log(this.start_time,this.end_time);
    this.ReportService.payment('fromTo',this.start_time,this.end_time).subscribe((response: any) => {
      this.payments = response.payload;
  
    });
  }
  

}
