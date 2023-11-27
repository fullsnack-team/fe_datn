import { Component, OnInit } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
@Component({
  selector: 'app-navbar-sell',
  templateUrl: './navbar-sell.component.html',
  styleUrls: ['./navbar-sell.component.scss']
})
export class NavbarSellComponent implements OnInit {

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
