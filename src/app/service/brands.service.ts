import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class BrandsService {
  private apiUrl = environment.apiTennatv1 + "brands";
  private readonly domain_name: String;

  constructor(private http: HttpClient) {
    this.domain_name = environment.domain_name;
  }
  getData() {
    return this.http.post(`${this.apiUrl}`, this.handleData());
  }

  createBrand(data: any) {
    return this.http.post(`${this.apiUrl}/store`, this.handleData(data));
  }

  getBrand(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/show`, this.handleData({ id: id }));
  }

  updateBrand(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, this.handleData(data));
  }

  deleteBrand(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete`, this.handleData({ id: id }));
  }

  handleData(data: any = {}) {
    return {
      domain_name: this.domain_name,
      ...data,
    };
  }
}
