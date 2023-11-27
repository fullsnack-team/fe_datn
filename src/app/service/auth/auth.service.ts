import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HandleDataService} from '../baseHandle/handle-data.service';
import {CRUDServiceService} from '../baseHandle/crudservice.service';
import {Warranties} from 'src/app/interface/warranties/warranties';
import {User} from "../../interface/user/user";
import {LocalStorageService} from "../localStorage/localStorage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends CRUDServiceService<User> {
  constructor(
    http: HttpClient,
    dataService: HandleDataService,
    private localStorageService: LocalStorageService
  ) {
    super(http, dataService);
    this.apiUrl = this.dataService.getUrl('auth');
    this.publicUrl = this.dataService.getPulicUrl('auth');
  }

  getUserByEnterprise(data: any) {
    return this.http.post<any>(`${this.apiUrl}/get/enterprise`, data);
  }

  getTenants() {
    const token = this.getToken('tenant_token');
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `${token}`)
    }
    return this.http.get<any>(`${this.apiUrl}/tenants`, header);
  }

  loginByEnterprise(data: any) {
    const token = this.getToken('tenant_token');
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `${token}`)
    }
    return this.http.post<any>(`${this.apiUrl}/login/enterprise`, data, header);
  }

  getToken(key: string = 'token') {
    if (this.localStorageService.get(key)) {
      const tenant_token: {
        token: string,
        token_type: string,
        expires_at: string
      } = this.localStorageService.get(key);
      return `${tenant_token.token_type} ${tenant_token.token}`;
    }
    return null;
  }

  loginByStaff(data: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, data);
  }

  register(data: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  login(payload: any): { status: boolean, msg: string, type: "success" | "error" } {
    try {
      const {token, token_type, expires_at} = payload.token;

      // this.localStorageService.set('auth_token', token);
      //
      // this.localStorageService.set('token_type', token_type);
      //
      // this.localStorageService.set('expires_at', expires_at);

      this.localStorageService.set('token', {token, token_type, expires_at});

      this.localStorageService.set('user', payload.user);

      this.localStorageService.set('location_id', payload.location_id);

      this.localStorageService.set('inventory_id', payload.inventory_id);

      this.localStorageService.set('domain_name', payload.domain_name);

      this.localStorageService.set('isLoggedin', 'true');

      this.localStorageService.remove('tenant_token');

      return {
        status: true,
        msg: 'Đăng nhập thành công',
        type: 'success'
      };

    } catch (e) {
      return {
        status: false,
        msg: 'Đăng nhập thất bại',
        type: 'error'
      };
    }

  }


}
