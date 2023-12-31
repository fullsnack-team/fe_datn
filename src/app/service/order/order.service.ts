import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OrderService extends CRUDServiceService<any> {
  constructor(
    http: HttpClient,
    dataService: HandleDataService
 ) {
   super(http, dataService);
   this.apiUrl = this.dataService.getUrl('orders');
 }
 GetAllOrder(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}`, this.dataService.handleData(data), this.header);
}

}
