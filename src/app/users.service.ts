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

  sendSponsorshipRequest(payload) {
    console.log(payload);
    
    return this.http.post(this.dataService.serverPath + '/api/post-sponsor-request', payload, { responseType: 'json' });
  }

  updateUserByField(inpVal, inpName, userId) {
    const updateData = { value: inpVal, name: inpName, userId: userId };
    // console.log(updateData);
    return this.http.put(this.dataService.serverPath + '/api/update-user-field', updateData, { responseType: 'json' });
  }

  // isLoggedIn = this.authService.isLoggedIn;
  getGender(): Observable<any>  {
    return this.http.get(this.dataService.serverPath + '/api/get-genders').map(res => res);
  }
  
  saveUser(formObject: User) { 
    return this.http.post(this.dataService.serverPath + '/api/save-user', formObject, { responseType: 'text' });
  }

  deleteFile(filePath, token): Observable<any> {
    const endpoint = `${this.dataService.serverPath}/api/delete-file`;
    const formData = { filePath, token };
    // console.log(formData);
    return this.http.post(endpoint, formData, { responseType: 'json' }).map(res => res);
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

  getCucky(): Observable<any> {
    return this.http.get('https://api.chucknorris.io/jokes/random').map(res => res);
  }

  getValidMobile(mobileNumber): Observable<any>{
    const key = 'b31e196c08855083140b14e761452e1b';
    
    let url = `http://apilayer.net/api/validate?access_key=${key}&number=${mobileNumber}&country_code=DK`;
    return this.http.get(url).map(res =>res)
  }
  
  static getInitialUsersState(): UsersState {
    return {
      userId: undefined,
      userRole: undefined,
      token: '',
      validToken: '',
      activated: 0,
      soberUsers: [],
      loggInSuccess: undefined
    };
  }
  
}


