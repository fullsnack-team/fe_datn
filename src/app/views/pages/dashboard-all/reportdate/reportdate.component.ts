import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { ReportService } from 'src/app/service/report/report.service';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reportdate',
  templateUrl: './reportdate.component.html',
  styleUrls: ['./reportdate.component.scss']
})
export class ReportdateComponent implements OnInit {

  title = 'ng-chart';

  chart: any = [];
  start_time : string;
  end_time : string;


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
    this.ReportService.income('thirtyDays').subscribe((response: any) => {
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
    this.chart.destroy();
    this.ReportService.income('fromTo',this.start_time,this.end_time).subscribe((response: any) => {
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
  
}
