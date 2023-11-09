import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleDataService } from '../baseHandle/handle-data.service';
import { CRUDServiceService } from '../baseHandle/crudservice.service';
import { StorageImport } from 'src/app/interface/storage/storage-import';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageImportService extends CRUDServiceService<any> {
  private readonly domain_name: String;
  constructor(http: HttpClient, dataService: HandleDataService) {
    super(http, dataService);
    this.apiUrl = this.dataService.getUrl('storage/import');
    this.domain_name = environment.domain_name;
  }

  getAll() {
    return this.http.post(`${this.apiUrl}`, this.handleData());
  }
  getOne(id: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${id}`,
      this.dataService.handleData(id)
    );
  }
  updateData(id: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/update/${id}`,
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