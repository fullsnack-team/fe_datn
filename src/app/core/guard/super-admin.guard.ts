import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "../../service/auth/auth.service";
import {LocalStorageService} from "../../service/localStorage/localStorage.service";

@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {

  role: string = '';

  constructor(private router: Router, private authService: AuthService, private localStorageService: LocalStorageService) {
    this.role = this.authService.role;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const boolean = this.role == 'super-admin';
    if (!boolean) {
      history.back();
    }
    return boolean;
  }

}
