import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { StorageImport } from 'src/app/interface/storage/storage-import';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {SettingService} from "../setting/setting.service";

@Injectable({
  providedIn: 'root',
})
export class StorageImportService extends CRUDServiceService<any> {
  private readonly domain_name: String;
  constructor(http: HttpClient, dataService: HandleDataService, private settingService: SettingService,) {
    super(http, dataService);
    this.apiUrl = this.dataService.getUrl('storage');
    this.domain_name = this.settingService.tenant?.name;
  }

  getAll(data: any) {
    return this.http.post(`${this.apiUrl}` + '/import', this.handleData(data), this.header);
  }

  getOne(id: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/import/${id}`,
      this.dataService.handleData(id),this.header
    );
  }

  createData(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/import/create`,
      this.dataService.handleData(data),this.header
    );
  }

  cancel(id: string, data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/import/cancel/${id}`,
      this.dataService.handleData(data),this.header
    );
  }

  //trans
  getAllTrans(data: any) {
    return this.http.post(`${this.apiUrl}` + '/trans', this.handleData(data),this.header);
  }
  createTrans(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/trans/store`,
      this.dataService.handleData(data),this.header
    );
  }

  //
  getAllInventory(data: any){
    if(data == null){
      return this.http.post(
        this.dataService.getUrl('storage/get-variation'),
        this.dataService.handleData(data),this.header
      );
    }else{
      return this.http.post(
        this.dataService.getUrl(`storage/get-variation/${data}`),
        this.dataService.handleData(data),this.header
      );
    }
  }
  getAllVariation(data: any){
    return this.http.post(
      `${this.apiUrl}/get-variation-inventory`,
      this.dataService.handleData(data),this.header
    );
  }

  //update quantity variation
  updateQuantity(data: any, inventory_id: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/update-quantity/${inventory_id}`,
      this.dataService.handleData(data),this.header
    );
  }


  handleData(data: any = {}) {
    return {
      domain_name: this.domain_name,
      ...data,
    };
  }
}
