import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HandleDataService} from './handle-data.service';
import {AuthService} from "../auth/auth.service";
import {LocalStorageService} from "../localStorage/localStorage.service";

@Injectable({
  providedIn: 'root',
})
export abstract class CRUDServiceService<T> {
  protected apiUrl: string;
  protected publicUrl: string;
  protected authSerivce: AuthService;
  protected localStorageservice: LocalStorageService;
  protected token: string | null;
  protected header: HttpHeaders | any;

  constructor(
    protected http: HttpClient,
    protected dataService: HandleDataService
  ) {
    this.localStorageservice = new LocalStorageService();
    this.authSerivce = new AuthService(this.http, this.dataService, this.localStorageservice);
    this.token = this.authSerivce.getToken();
    this.header = {
      headers: new HttpHeaders()
        .set('Authorization', `${this.token}`)
    }
  }

  // Update the methods to use getApiUrl()
  GetData(): Observable<any> {
    return this.http.post<T[]>(`${this.apiUrl}`, this.dataService.handleData(), this.header);
  }
  GetDataPanigate(page: any) {
    if(page > 1){
      return this.http.post<T[]>(`${this.apiUrl}?page=${page}`, this.dataService.handleData());
    }else{
      return this.http.post<T[]>(`${this.apiUrl}?page=1`, this.dataService.handleData());
    }
  }

  create(data: T, location_id: any = null): Observable<T> {

    // console.log(this.dataService.handleData(data));
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `${this.token}`)
    }
    return this.http.post<T>(`${this.apiUrl}/store`, this.dataService.handleData(data, location_id), header);
  }

  createFormData(data: any) {
    return this.http.post<T>(`${this.apiUrl}/store`, data, this.header);
  }

  GetOneRecord(id: string): Observable<any> {
    return this.http.post<T>(
      `${this.apiUrl}/show`,
      this.dataService.handleData(id),
      this.header
    );
  }

  update(data: any): Observable<any> {
    return this.http.post<T>(
      `${this.apiUrl}/update`,
      this.dataService.handleData(data),
      this.header
    );
  }

  updateFormData(data: any):
    Observable<any> {
    return this.http.post<T>(
      `${this.apiUrl}/update`,
      data, this.header
    );
  }

  delete(id: number): Observable<{}> {
    return this.http.post(
      `${this.apiUrl}/delete`,
      this.dataService.handleData(id),
      this.header
    );
  }
}
