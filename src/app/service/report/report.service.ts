import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { Observable } from 'rxjs';
import { SettingService } from '../setting/setting.service';
@Injectable({
  providedIn: 'root'
})
export class ReportService extends CRUDServiceService<any> {
  private readonly domain_name: String;
  constructor(http: HttpClient, dataService: HandleDataService, private SettingService: SettingService,) {
    super(http, dataService);
    this.apiUrl = this.dataService.getUrl('report');
  }

  general() {

    return this.http.post(
      `${this.apiUrl}/general`,
      {
        domain_name: this.SettingService.tenant.name
      },this.header)
    }

    income(option: string,start_date : string = '',end_date : string = '') {
      return this.http.post(
        `${this.apiUrl}/income`,
        {
          domain_name: this.SettingService.tenant.name,
          location : this.SettingService.location.id,
          option : option,
          start_date,
          end_date
        },this.header)
      }

      products(option: string,start_date : string = '',end_date : string = ''){
        return this.http.post(
          `${this.apiUrl}/products`,
          {
            domain_name: this.SettingService.tenant.name,
            location : this.SettingService.location.id,
            option : option,
            start_date,
            end_date
          },this.header)
      }


      customer(option: string,start_date : string = '',end_date : string = ''){
        return this.http.post(
          `${this.apiUrl}/customers`,
          {
            domain_name: this.SettingService.tenant.name,
            location : this.SettingService.location.id,
            option : option,
            start_date,
            end_date
          },this.header)
      }

      payment(option: string,start_date : string = '',end_date : string = ''){
        console.log({
          domain_name: this.SettingService.tenant.name,
          location : this.SettingService.location.id,
          option : option,
          start_date,
          end_date
        });
        return this.http.post(
          `${this.apiUrl}/payment-methods`,
          {
            domain_name: this.SettingService.tenant.name,
            location : this.SettingService.location.id,
            option : option,
            start_date,
            end_date
          },this.header)
      }


}
