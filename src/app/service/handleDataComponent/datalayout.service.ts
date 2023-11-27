import { Injectable } from '@angular/core';
import { Subject,BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DatalayoutService {
  private event = new Subject<{name : string,data ?: any}>();
  private data  = new BehaviorSubject<any>(null);
  eventCurrent = this.event.asObservable();
  currentData = this.data.asObservable();

  constructor() { }

  triggerEvent(name : string , data : any = []) {
    this.event.next({ name, data });
  }

  changeData(data : any ){
    this.data.next(data);
  }


}
