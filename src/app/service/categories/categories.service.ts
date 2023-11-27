import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { Categories } from '../../interface/categories/categories';
@Injectable({
  providedIn: 'root',
})
export class CategoriesService extends CRUDServiceService<Categories> {
  constructor(
     http: HttpClient,
     dataService: HandleDataService
  ) {
    super(http, dataService);
    this.apiUrl = this.dataService.getUrl('categories');
  }



}
