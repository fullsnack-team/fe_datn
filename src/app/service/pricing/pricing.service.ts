import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private pricingApiUrl: string = environment.apiPublicv1 + 'pricings';

  constructor(
    private http: HttpClient
  ) {
  }

  get list() {
    return this.http.get(this.pricingApiUrl);
  }
}
