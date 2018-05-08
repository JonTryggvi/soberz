import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AuthService } from './auth.service';
import { User } from './classes/user';
import { DataService } from './data.service';
import { UsersState } from './store/store';

@Injectable()
export class UsersService {
  
  constructor(private authService: AuthService, private http: HttpClient, private dataService: DataService) { }
  // isLoggedIn = this.authService.isLoggedIn;
  getGender(): Observable<any>  {
    return this.http.get(this.dataService.serverPath + '/api/get-genders').map(res => res);
  }
  
  saveUser(formObject: User) { 
    return this.http.post(this.dataService.serverPath + '/api/save-user', formObject, { responseType: 'text' });
  }

  usCheckToken(token, userId: number) {
    if (token != '') {
      const httpOptions = {
        headers: new HttpHeaders({
          'x-access-token': token
        })
      };

      return this.http.get(this.dataService.serverPath + '/api?userId='+ userId, httpOptions);
    } else {
      return this.http.get(this.dataService.serverPath + '/api', { responseType: 'json' });
    }
    
  } 

  getAllUsersApi(token) {
    // console.log(token);
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': token
      })
    };
    return this.http.get(this.dataService.serverPath + '/api/get-users', httpOptions);
  }

  
  
  static getInitialUsersState(): UsersState {
    return {
      userId: undefined,
      userRole: undefined,
      token: '',
      validToken: '',
      soberUsers: [],
      userTodelete: undefined
    };
  }
  
}