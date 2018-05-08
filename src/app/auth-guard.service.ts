import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuardService implements CanActivate {

 
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    let url: string = state.url;
    // console.log(state.url);
    
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    // console.log('isLoggedIn ' + this.authService.isTokenValid);
    if (this.authService.isTokenValid === 'ok') {
      // this.router.navigate(['/portal']);
      return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/home/login']);
    return false;
  }


}
