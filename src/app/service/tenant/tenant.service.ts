import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HandleDataService} from "../baseHandle/handle-data.service";
import {LocalStorageService} from "../localStorage/localStorage.service";
import {AuthService} from "../auth/auth.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  private publicApiUrl;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    this.publicApiUrl = environment.apiPublicv1;
  }

  getTenantsByUser() {
    const token = this.authService.getToken('tenant_token');
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `${token}`)
    }
    return this.http.get<any>(`${this.publicApiUrl}tenants`, header);
  }

  create(data: any) {
    const token = this.authService.getToken('tenant_token');
    const user = this.localStorageService.get('tenant_token').user;
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `${token}`)
    }
    return this.http.post<any>(`${this.publicApiUrl}tenants/store`, {user_id: user.id, ...data}, header);
  }
}
