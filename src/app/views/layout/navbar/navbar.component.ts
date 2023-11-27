import {Component, OnInit, ViewChild, ElementRef, Inject, Renderer2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';
import {LocalStorageService} from "../../../service/localStorage/localStorage.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public user: any;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    this.user = this.localStorageService.get('user');
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

    this.localStorageService.remove('isLoggedin');

    this.localStorageService.remove('auth_token');

    this.localStorageService.remove('token_type');

    this.localStorageService.remove('token');

    this.localStorageService.remove('expires_at');

    this.localStorageService.remove('user');

    this.localStorageService.remove('location_id');

    this.localStorageService.remove('inventory_id');

    this.localStorageService.remove('domain_name');

    if (!this.localStorageService.get('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    }
  }

}
