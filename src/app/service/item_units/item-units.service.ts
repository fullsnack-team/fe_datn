import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { ItemUnits } from 'src/app/interface/item_units/item-units';
@Injectable({
  providedIn: 'root'
})
export class ItemUnitsService extends  CRUDServiceService<ItemUnits> {
  constructor(
    http: HttpClient,
    dataService: HandleDataService
 ) {
   super(http, dataService);
   this.apiUrl = this.dataService.getUrl('item_units');
 }
}
