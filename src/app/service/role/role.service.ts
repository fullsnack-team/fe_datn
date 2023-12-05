import {Injectable} from '@angular/core';
import {Role} from "../../interface/role/role";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HandleDataService} from "../baseHandle/handle-data.service";
import {CRUDServiceService} from "../baseHandle/crudservice.service";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class RoleService extends CRUDServiceService<Role> {

  constructor(
    http: HttpClient,
    dataService: HandleDataService,
    private authService: AuthService,
  ) {
    super(http, dataService);
    this.apiUrl = this.dataService.getUrl('roles');
  }

  getRoles() {
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', this.authService.getToken() ?? '')
    }
    // const headers = new H
    return this.http.post(this.apiUrl, this.dataService.handleData(), header);
  }
}
