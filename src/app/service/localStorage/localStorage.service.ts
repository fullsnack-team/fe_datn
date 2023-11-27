import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HandleDataService} from '../baseHandle/handle-data.service';
import {CRUDServiceService} from '../baseHandle/crudservice.service';
import {Warranties} from 'src/app/interface/warranties/warranties';
import {User} from "../../interface/user/user";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {
  }

  get(key: string): any {
    return JSON.parse(<string>localStorage.getItem(key)) ?? null;
  }

  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

}
