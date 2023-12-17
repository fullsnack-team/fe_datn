import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SettingService } from '../setting/setting.service';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root',
})
export class ListProductsService {
  private apiUrlProducts: string = environment.apiTennatv1;
  constructor(
    private http: HttpClient,
    private settingService: SettingService,
    private authService: AuthService
  ) {}
  getProducts() {
    const token = this.authService.getToken();
    // console.log(token);
    const header = {
      headers: new HttpHeaders().set('Authorization', `${token}`),
    };
    return this.http.post(
      `${this.apiUrlProducts}get-product`,
      {
        domain_name: this.settingService.tenant?.name,
        location_id: this.settingService.location?.id,
        inventory_id: this.settingService.inventory?.id,
      },
      header
    );
  }
}
