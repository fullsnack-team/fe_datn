import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HandleDataService} from '../baseHandle/handle-data.service';
import {CRUDServiceService} from '../baseHandle/crudservice.service';
import {Customers} from 'src/app/interface/customers/customers';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {SettingService} from "../setting/setting.service";

@Injectable({
  providedIn: 'root',
})
export class CustomersService extends CRUDServiceService<Customers> {

  private readonly domain_name: String;
  private apiUrlProducts: string = environment.apiTennatv1;

  constructor(
    http: HttpClient,
    dataService: HandleDataService,
    private settingService: SettingService,
  ) {
    super(http, dataService);
    this.apiUrl = this.dataService.getUrl('customers');
    this.domain_name = this.settingService.tenant?.name;
  }


  createQuickly(data: any) {
    // console.log({
    //   domain_name: this.settingService.tenant.name,
    //   location: this.settingService.location.id, statusCreate: 1, ...data
    // });

    return this.http.post(`${this.apiUrlProducts}customers/store`, {
      domain_name: this.settingService.tenant.name,
      location: this.settingService.location.id, statusCreate: 1, ...data,
      type : 0
    },this.header);
  }

  getCustomer() {
    return this.http.post(
      `${this.dataService.getUrl('get-customer')}`,
      this.handleData(),this.header
    );
  }

  handleData(data: any = {}) {
    return {
      domain_name: this.domain_name,
      ...data,
    };
  }

}

