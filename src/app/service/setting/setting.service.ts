import {Injectable} from '@angular/core';
import {LocalStorageService} from "../localStorage/localStorage.service";

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private _tenant: any | null;
  private _location: any | null;
  private _inventory: any | null;

  constructor(
    private localStorageService: LocalStorageService,
  ) {
    this.updateValues();
  }

  updateValues() {
    this._tenant = this.localStorageService.get('tenant') ?? {name: 'tenant1'};
    this._location = this.localStorageService.get('location') ?? {id: 1};
    this._inventory = this.localStorageService.get('inventory') ?? {id: 1};
  }

  get tenant() {
    return this._tenant;
  }

  get location() {
    return this._location;
  }

  get inventory() {
    return this._inventory;
  }
}
