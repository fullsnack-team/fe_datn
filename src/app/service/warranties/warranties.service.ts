import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { Warranties } from 'src/app/interface/warranties/warranties';
@Injectable({
  providedIn: 'root'
})
export class WarrantiesService extends CRUDServiceService<Warranties> {
  constructor(
     http: HttpClient,
     dataService: HandleDataService
  ) {
    super(http, dataService);
    this.apiUrl = this.dataService.getUrl('warranties');
  }

 

  
}
