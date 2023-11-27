import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {ConfigService} from "../config/config.service";
@Injectable({
  providedIn: 'root'
})
export class ListProductsService {
  private apiUrlProducts : string = environment.apiTennatv1;
  constructor(private http: HttpClient, private configService: ConfigService) { }
  getProducts() {
    return this.http.post(`${this.apiUrlProducts}get-product`,{ domain_name: this.configService.domain_name,
    location: this.configService.location_id,});
  }

}
