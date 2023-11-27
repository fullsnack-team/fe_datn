import { Component, OnInit } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
@Component({
  selector: 'app-base-special',
  templateUrl: './base-special.component.html',
  styleUrls: ['./base-special.component.scss']
})
export class BaseSpecialComponent implements OnInit {

  isLoading: boolean;
  constructor(private router: Router) {
    router.events.forEach((event) => { 
      if (event instanceof RouteConfigLoadStart) {
        this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoading = false;
      }
    });
   }
 
  ngOnInit(): void {
  }

}
