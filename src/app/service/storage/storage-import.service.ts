import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { StorageImport } from 'src/app/interface/storage/storage-import';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {ConfigService} from "../config/config.service";

@Injectable({
  providedIn: 'root',
})
export class StorageImportService extends CRUDServiceService<any> {
  private readonly domain_name: String;
  constructor(http: HttpClient, dataService: HandleDataService, private configService: ConfigService,) {
    super(http, dataService);
    this.apiUrl = this.dataService.getUrl('storage');
    this.domain_name = this.configService.domain_name;
  }

  getAll() {
    return this.http.post(`${this.apiUrl}` + '/import', this.handleData());
  }

  getOne(id: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/import/${id}`,
      this.dataService.handleData(id)
    );
  }

  createData(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/import/create`,
      this.dataService.handleData(data)
    );
  }

  cancel(id: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/import/cancel/${id}`,
      this.dataService.handleData()
    );
  }

  handleData(data: any = {}) {
    return {
      domain_name: this.domain_name,
      ...data,
    };
  }
}
