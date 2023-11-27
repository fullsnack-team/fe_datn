import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HandleDataService} from './handle-data.service';

@Injectable({
  providedIn: 'root',
})
export abstract class CRUDServiceService<T> {
  protected apiUrl: string;
  protected publicUrl: string;

  constructor(
    protected http: HttpClient,
    protected dataService: HandleDataService
  ) {
  }

  // Update the methods to use getApiUrl()
  GetData() {
    return this.http.post<T[]>(`${this.apiUrl}`, this.dataService.handleData());
  }

  create(data: T, location_id: null|number = null) {
    const headers = new HttpHeaders();
    console.log(this.dataService.handleData(data));
    return this.http.post<T>(
      `${this.apiUrl}/store`,
      this.dataService.handleData(data, location_id),
      {headers}
    );
  }

  createFormData(data: any) {
    const headers = new HttpHeaders();
    return this.http.post<T>(`${this.apiUrl}/store`, data, {headers});
  }

  GetOneRecord(id: string): Observable<any> {
    return this.http.post<T>(
      `${this.apiUrl}/show`,
      this.dataService.handleData(id)
    );
  }

  update(data: any): Observable<any> {
    return this.http.post<T>(
      `${this.apiUrl}/update`,
      this.dataService.handleData(data)
    );
  }

  updateFormData(data: any): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.post<T>(
      `${this.apiUrl}/update`,
      data, {headers}
    );
  }

  delete(id: number): Observable<{}> {
    return this.http.post(
      `${this.apiUrl}/delete`,
      this.dataService.handleData(id)
    );
  }
}
