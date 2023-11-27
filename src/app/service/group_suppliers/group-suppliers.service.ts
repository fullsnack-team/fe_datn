import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { GroupSuppliers } from 'src/app/interface/group_suppliers/group-suppliers';
@Injectable({
  providedIn: 'root'
})
export class GroupSuppliersService extends CRUDServiceService<GroupSuppliers> {

 
  constructor(
    http: HttpClient,
    dataService: HandleDataService
 ) {
   super(http, dataService);
   this.apiUrl = this.dataService.getUrl('group_suppliers');
 }
}
