import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { Products } from 'src/app/interface/products/products';
@Injectable({
  providedIn: 'root'
})
export class ProductsService extends CRUDServiceService<Products>  {

  constructor(
    http: HttpClient,
    dataService: HandleDataService
 ) {
   super(http, dataService);
   this.apiUrl = this.dataService.getUrl('products');
 }
}
