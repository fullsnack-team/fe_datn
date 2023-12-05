import { Component, OnInit } from '@angular/core';

import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from 'src/app/service/report/report.service';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  preserveWhitespaces: true,
})
export class DashboardComponent implements OnInit {
  /**
   * Apex chart
   */
  title = 'ng-chart';

  chart: any = []
  totalToday: number = 0;
  totalBillToday: number = 0;
  dataChartRevenue : any;
  focusclick : number = 0
  /**
   * NgbDatepicker
   */
  currentDate: NgbDateStruct;

  constructor(
    private calendar: NgbCalendar,
    private ReportService: ReportService
  ) {}

  ngOnInit(): void {
    this.currentDate = this.calendar.getToday();
    this.ReportService.general().subscribe((data: any) => {
      this.totalToday = data.payload.total_price;
      this.totalBillToday = data.payload.order_completed;
    });

    this.ReportService.income('today').subscribe((response: any) => {
      this.dataChartRevenue = response;
      console.log(this.dataChartRevenue);
      
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
    


  ;
 


    // Some RTL fixes. (feel free to remove if you are using LTR))
  
  }

  getInfoClick(status: number) {
    let optionDate = null;
    
    switch (status) {
      case 0:
        optionDate = 'today';
        break;
      case 1:
        optionDate = 'yesterday';
        break;
      case 2:
        optionDate = 'sevenDays';
        break;
      case 3:
        optionDate = 'thirtyDays';
        break;
      default :
        optionDate = 'today';
        break;
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
    this.focusclick =  status;
    this.ReportService.income(optionDate).subscribe((response: any) => {
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
    console.log(this.dataChartRevenue);
    
  }

  
}
