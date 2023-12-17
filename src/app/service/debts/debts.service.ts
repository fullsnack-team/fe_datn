import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Debts } from './../../interface/debts/debts';
import {SettingService} from "../setting/setting.service";

@Injectable({
  providedIn: 'root'
})
export class DebtsService extends CRUDServiceService<Debts> {
  private readonly domain_name: String;

  constructor(
    http: HttpClient,
    dataService: HandleDataService,
    private settingService: SettingService
 ) {
   super(http, dataService);
   this.apiUrl = this.dataService.getUrl('debt');
   this.domain_name = this.settingService.tenant?.name;
 }

 createDebts(data : any){
  console.log(this.handleData(data));
  
  return this.http.post(`${this.apiUrl}/store`, this.handleData(data), this.header);
 }

 getAllRecovery(data: any){
  return this.http.post(`${this.apiUrl}`, this.handleData(data), this.header);
 }

 getAllRepay(data: any){
  return this.http.post(`${this.apiUrl}`, this.handleData(data), this.header);
 }
 handleData(data: any = {}) {
  return {
    domain_name: this.domain_name,
    ...data,
    location_id : this.settingService.location.id
  };
}
}
