import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {SettingService} from "../setting/setting.service";
@Injectable({
  providedIn: 'root'
})
export class ListProductsService {
  private apiUrlProducts : string = environment.apiTennatv1;
  constructor(private http: HttpClient, private settingService: SettingService) { }
  getProducts() {
    return this.http.post(`${this.apiUrlProducts}get-product`,{ domain_name: this.settingService.tenant?.name,
    location_id: this.settingService.location?.id, inventory_id: this.settingService.inventory?.id });
  }

}
