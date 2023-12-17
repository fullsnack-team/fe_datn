import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SettingService} from "../setting/setting.service";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private pricingApiUrl: string = environment.apiPublicv1 + 'pricings';
  private pricingByTenantApiUrl: string = environment.apiTennatv1 + 'pricings';
  protected header: HttpHeaders | any;
  protected token: string | null;

  constructor(
    private http: HttpClient,
    private settingService: SettingService,
    private authSerivce: AuthService,
  ) {
    this.token = this.authSerivce.getToken();
    this.header = {
      headers: new HttpHeaders()
        .set('Authorization', `${this.token}`)
    }
  }

  get list() {
    return this.http.get(this.pricingApiUrl);
  }

  get() {
    return this.http.post(`${this.pricingByTenantApiUrl}`, {
      domain_name: this.settingService.tenant?.name
    }, this.header);
  }
}
