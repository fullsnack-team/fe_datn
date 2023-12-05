import {Component, OnInit, ViewChild, ElementRef, Inject, Renderer2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';
import {LocalStorageService} from "../../../service/localStorage/localStorage.service";
import {LocationsService} from "../../../service/locations/locations.service";
import {Locations} from "../../../interface/locations/locations";
import {SettingService} from "../../../service/setting/setting.service";
import {AuthService} from "../../../service/auth/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public user: any;
  public locations: Locations[] = [];
  public activeLocation: Locations | undefined;
  public isSuperAdmin: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    private localStorageService: LocalStorageService,
    private locationService: LocationsService,
    private settingService: SettingService,
    private authService: AuthService,
  ) {
    this.isSuperAdmin = this.authService.role === 'super-admin';
  }

  ngOnInit(): void {
    this.user = this.localStorageService.get('user');
    this.activeLocation = this.localStorageService.get('location');
    if (this.isSuperAdmin) {
      this.locationService.GetData().subscribe(
        (response: any) => {
          if (response.status) {
            this.locations = response.payload;
          }
        }
      )
    }
  }

  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout(e: Event) {
    e.preventDefault();

    this.authService.logout();

    if (!this.localStorageService.get('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    }
  }

  setActiveLocation(location: Locations) {
    const {
      inventory,
      ...activeLocation
    } = location;
    this.localStorageService.set('location', activeLocation);
    this.localStorageService.set('inventory', inventory);
    this.activeLocation = location;
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

}
