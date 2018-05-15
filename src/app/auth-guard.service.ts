import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { UsersActions } from './users.actions';

@Injectable()
export class AuthGuardService implements CanActivate {

 
  constructor(private router: Router, private authService: AuthService, private usersActions: UsersActions) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    let url: string = state.url;
    // console.log(state.url);
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    console.log('isLoggedIn ' + this.authService.isTokenValid);
    if (this.authService.isTokenValid === 'ok') {
      // this.router.navigate(['/portal']);
      return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;
    // this.usersActions.logOut();
    // this.authService.setLocalStorage(null, undefined, undefined);
    // location.replace('/');
    // Navigate to the login page with extras
    this.router.navigate(['/home/login']);
    return false;
  }


}
