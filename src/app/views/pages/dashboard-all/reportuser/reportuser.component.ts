import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/service/report/report.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reportuser',
  templateUrl: './reportuser.component.html',
  styleUrls: ['./reportuser.component.scss']
})
export class ReportuserComponent implements OnInit {

  start_time : string ;
  end_time : string;
  customer : any = [];
  result : any = {};


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
    this.ReportService.customer('thirtyDays').subscribe((response: any) => {
      console.log(response.payload.data);
      
      this.customer = response.payload.data;
      this.result.quanlityResult = response.payload.data.reduce((index : number, item: any) => {
        return index + item.total_product;
      },0)
      this.result.quanlitySell = response.payload.data.reduce((index : number, item: any) => {
        return index + item.total_price;
      },0)
    
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
    this.ReportService.customer('fromTo',this.start_time,this.end_time).subscribe((response: any) => {
      this.customer = response.payload.data;
      this.result.quanlityResult = response.payload.data.reduce((index : number, item: any) => {
        return index + item.total_product;
      },0)
      this.result.quanlitySell = response.payload.data.reduce((index : number, item: any) => {
        return index + item.total_price;
      },0)
    });
  }
  

}
