import { Injectable } from '@angular/core';
import {CRUDServiceService} from "../baseHandle/crudservice.service";
import {Categories} from "../../interface/categories/categories";
import { Config } from 'src/app/interface/config/config';
import {HttpClient} from "@angular/common/http";
import {HandleDataService} from "../baseHandle/handle-data.service";

@Injectable({
  providedIn: 'root'
})
export class ConfigService extends CRUDServiceService<Config> {

  constructor(
    http: HttpClient,
    dataService: HandleDataService
  ) {

    super(http, dataService);
    this.apiUrl = this.dataService.getUrl('config');
  }

  getConfig() {
    return this.http.post(`${this.apiUrl}/show`, this.dataService.handleData());
  }
}
