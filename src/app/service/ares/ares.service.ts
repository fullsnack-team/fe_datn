import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AresService {
  private apiUrlArse : string = environment.apiPublicv1 +'areas';
  constructor(private http: HttpClient) { }
  getProvinces(): Observable<any> {
    return this.http.get(`${this.apiUrlArse}/provinces`);
  }

  getDistricts(provinceId: number): Observable<any> {
    return this.http.get(`${this.apiUrlArse}/districts/${provinceId}`);
  }

  getWards(districtId: number): Observable<any> {
    return this.http.get(`${this.apiUrlArse}/communes/${districtId}`);
  }
}
