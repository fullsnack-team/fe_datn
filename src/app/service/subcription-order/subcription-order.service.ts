import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HandleDataService} from "../baseHandle/handle-data.service";
import {CRUDServiceService} from "../baseHandle/crudservice.service";
import {AuthService} from "../auth/auth.service";
import {LocalStorageService} from "../localStorage/localStorage.service";
import {environment} from "../../../environments/environment";
import {SettingService} from "../setting/setting.service";

@Injectable({
  providedIn: 'root'
})
export class SubcriptionOrderService {

  publicApiUrl: string;

  domain_name: string;

  constructor(
    private http: HttpClient,
    private dataService: HandleDataService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private settingService: SettingService,
  ) {
    this.publicApiUrl = environment.apiPublicv1;
    this.domain_name = this.settingService.tenant.name;
  }

  create(data: any) {
    const token = this.authService.getToken();
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `${token}`)
    }
    return this.http.post<any>(`${this.publicApiUrl}tenants/subscription-orders`, {domain_name: this.domain_name, ...data}, header);
  }
}
