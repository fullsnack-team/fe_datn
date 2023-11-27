import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BusinessFieldService {
  private businessFieldApiUrl: string = environment.apiPublicv1 + 'business-field';

  constructor(
    private http: HttpClient
  ) {
  }

  getBusinessFields() {
    return this.http.get(this.businessFieldApiUrl);
  }
}
