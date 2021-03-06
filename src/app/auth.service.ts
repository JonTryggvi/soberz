import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable()
export class AuthService {

 
  hasToken = '';
  // isLocalAdmSet = localStorage.admin;
  isAdmin; //= (typeof this.isLocalAdmSet !== 'undefined' && this.isLocalAdmSet !== null) ? JSON.parse(this.isLocalAdmSet) : false;
  isTokenSet = localStorage.token;
  isToken = (typeof this.isTokenSet !== 'undefined' && this.isTokenSet !== null) ? this.isTokenSet : '';

  isTokenValidSet = localStorage.tokenValid;
  isTokenValid = (typeof this.isTokenValidSet !== 'undefined' && this.isTokenValidSet !== null) ? this.isTokenValidSet : false;

  isUserIdSet = Number(localStorage.userId);
  isUserIdValid = (typeof this.isUserIdSet !== 'undefined' && this.isUserIdSet !== null) ? this.isUserIdSet : null;
  // store the URL so we can redirect after logging in
  redirectUrl: String;
 
  setLocalStorage(userId:number, token, validToken): void {
    // console.log(userId);
    
    localStorage.setItem('userId', JSON.stringify(userId));
    localStorage.setItem('token', token);
    localStorage.setItem('tokenValid', validToken);
    this.isTokenValid = validToken;
    this.isUserIdValid = Number(userId);
    this.isToken = token;
    // localStorage.setItem('loggedIn', JSON.stringify(this.isLoggedIn));
    
  }

  
  constructor(private http: HttpClient, private dataService: DataService) { }
  
  logout(id, token, validToken) {
    this.setLocalStorage(id, token, validToken);
  }
  logoutUser(id) {
    return this.http.post(this.dataService.serverPath + this.dataService.serverPort + '/api/logout-user', { id }, { responseType: 'json' })

  }

  authServiselogIn(loginForm) {
    // console.log(loginForm);
    return this.http.post(this.dataService.serverPath + this.dataService.serverPort + '/api/auth-user', loginForm, { responseType: 'json' });
  } 

}
