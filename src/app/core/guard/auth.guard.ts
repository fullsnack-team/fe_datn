import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Router} from '@angular/router';
import {AuthService} from "../../service/auth/auth.service";
import {LocalStorageService} from "../../service/localStorage/localStorage.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService, private localStorageService: LocalStorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this.localStorageService.get('token') || this.localStorageService.get('tenant_token');

    if (token) {
      const expiresAt = token.expired_at;

      const now = new Date();

      const expiresAtDate = new Date(expiresAt);

      if (expiresAtDate < now) {
        this.router.navigate(['/auth/login']);
        return false;
      } else {
        return true;
      }
      // logged in so return true
      // this.router.navigate(['/dashboard'], { queryParams: { returnUrl: state.url } });
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login']);
    return false;
  }
}
