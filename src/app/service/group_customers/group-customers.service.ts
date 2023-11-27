import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { GroupCustomers } from 'src/app/interface/group_customers/group-customers';
@Injectable({
  providedIn: 'root'
})
export class GroupCustomersService  extends CRUDServiceService<GroupCustomers> {
  constructor(
    http: HttpClient,
    dataService: HandleDataService
 ) {
   super(http, dataService);
   this.apiUrl = this.dataService.getUrl('group_customers');
 }
}
