import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { Suppliers } from 'src/app/interface/suppliers/suppliers';
@Injectable({
  providedIn: 'root'
})
export class SuppliersService extends CRUDServiceService<Suppliers> {

  constructor(
    http: HttpClient,
    dataService: HandleDataService
 ) {
   super(http, dataService);
   this.apiUrl = this.dataService.getUrl('suppliers');
 }


}
