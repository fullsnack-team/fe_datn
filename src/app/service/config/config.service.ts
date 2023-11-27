import {Injectable} from '@angular/core';
import {LocalStorageService} from "../localStorage/localStorage.service";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _domain_name: string;
  private _location_id: number;
  private _inventory_id: number;

  constructor(
    private localStorageService: LocalStorageService,
  ) {
    this.updateValues();
  }

  updateValues() {
    this._domain_name = this.localStorageService.get('domain_name') ?? 'tenant1';
    this._location_id = Number(this.localStorageService.get('location_id') ?? '1');
    this._inventory_id = Number(this.localStorageService.get('inventory_id') ?? '1');
  }

  get domain_name() {
    return this._domain_name;
  }

  get location_id() {
    return this._location_id;
  }

  get inventory_id() {
    return this._inventory_id;
  }
}
