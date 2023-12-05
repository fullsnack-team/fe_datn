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
export class AuthService {
  apiUrl: string;
  publicUrl: string;

  constructor(
    private http: HttpClient,
    private dataService: HandleDataService,
    private localStorageService: LocalStorageService
  ) {
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
        expired_at: string
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
      const {token, token_type, expired_at} = payload.token;

      this.localStorageService.set('token', {token, token_type, expired_at});

      this.localStorageService.set('user', payload.user);

      this.localStorageService.set('location', payload.location);

      this.localStorageService.set('inventory', payload.inventory);

      this.localStorageService.set('tenant', payload.tenant);

      this.localStorageService.set('menus', payload.menus);

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

  logout() {
    this.localStorageService.remove('isLoggedin');

    this.localStorageService.remove('auth_token');

    this.localStorageService.remove('token_type');

    this.localStorageService.remove('token');

    this.localStorageService.remove('expired_at');

    this.localStorageService.remove('user');

    this.localStorageService.remove('location');

    this.localStorageService.remove('inventory');

    this.localStorageService.remove('tenant');

    this.localStorageService.remove('menus');
  }

  get role(): string {
    return this.localStorageService.get('user').roles[0]?.name;
  }

  get user(): User {
    return this.localStorageService.get('user');
  }


}
