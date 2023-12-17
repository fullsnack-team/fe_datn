import { Injectable } from '@angular/core';
import {CRUDServiceService} from "../baseHandle/crudservice.service";
import {Categories} from "../../interface/categories/categories";
import { Config } from 'src/app/interface/config/config';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HandleDataService} from "../baseHandle/handle-data.service";
import { AuthService } from '../auth/auth.service';
import { LocalStorageService } from '../localStorage/localStorage.service';


@Injectable({
  providedIn: 'root'
})
export class ConfigService extends CRUDServiceService<Config> {
  protected override authSerivce: AuthService;
  protected override localStorageservice: LocalStorageService;

  constructor(
    http: HttpClient,
    dataService: HandleDataService
  ) {

    super(http, dataService);
    this.apiUrl = this.dataService.getUrl('config');
    this.localStorageservice = new LocalStorageService();
    this.authSerivce = new AuthService(this.http, this.dataService, this.localStorageservice);
    this.token = this.authSerivce.getToken();
    this.header = {
      headers: new HttpHeaders()
        .set('Authorization', `${this.token}`)
    }
  }

  getConfig() {
    return this.http.post(`${this.apiUrl}/show`, this.dataService.handleData(), this.header);
  }
}
