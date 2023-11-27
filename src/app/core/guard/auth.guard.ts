import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Router} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('isLoggedin') || localStorage.getItem('tenant_token')) {
      // logged in so return true
      // this.router.navigate(['/dashboard'], { queryParams: { returnUrl: state.url } });
      console.log('true');
      return true;
    }

    console.log('false');
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login']);
    return false;
  }
}
