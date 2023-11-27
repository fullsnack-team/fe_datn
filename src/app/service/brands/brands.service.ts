import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { Brands } from 'src/app/interface/brands/brands';

@Injectable({
  providedIn: "root",
})
export class BrandsService extends CRUDServiceService<Brands>{
  constructor(
    http: HttpClient,
    dataService: HandleDataService
 ) {
   super(http, dataService);
   this.apiUrl = this.dataService.getUrl('brands');
 }
}
