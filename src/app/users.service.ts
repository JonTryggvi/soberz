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
  httpOptions(token) {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': token
      })
    };
    return httpOptions;
   };
  sendSponsorshipRequest(payload) {
    console.log(payload);
    
    return this.http.post(this.dataService.serverPath + this.dataService.serverPort + '/api/post-sponsor-request', payload, { responseType: 'json' });
  
  }

  updateUserByField(inpVal, inpName, userId) {
    const updateData = { value: inpVal, name: inpName, userId: userId };
    // console.log(updateData);
    return this.http.put(this.dataService.serverPath + this.dataService.serverPort + '/api/update-user-field', updateData, { responseType: 'json' });
  }

  // isLoggedIn = this.authService.isLoggedIn;
  getGender(): Observable<any>  {
    return this.http.get(this.dataService.serverPath + this.dataService.serverPort + '/api/get-genders').map(res => res);
  }
  
  saveUser(formObject: User) { 
    return this.http.post(this.dataService.serverPath + this.dataService.serverPort +'/api/save-user', formObject, { responseType: 'text' });
  }

  deleteFile(filePath, token): Observable<any> {
    const endpoint = `${this.dataService.serverPath+this.dataService.serverPort }/api/delete-file`;
    const formData = { filePath, token };
    // console.log(formData);
    return this.http.post(endpoint, formData, { responseType: 'json' }).map(res => res);
  }

  usCheckToken(token, userId: number) {

    if (token !== '') {
      // Using the '?' opperator in the url because I am just sending to hte api/ path not a dedicaded express rout expectiong a :id
      return this.http.get(this.dataService.serverPath + this.dataService.serverPort + '/api?userId=' + userId, this.httpOptions(token));
    } else {
      return this.http.get(this.dataService.serverPath + this.dataService.serverPort + '/api', { responseType: 'json' });
    }
    
  } 

  getAllUsersApi(token) {
    // console.log(token);
    
    return this.http.get(this.dataService.serverPath + this.dataService.serverPort + '/api/get-users', this.httpOptions(token));
  }
  

  getCucky(): Observable<any> {
    return this.http.get('https://api.chucknorris.io/jokes/random').map(res => res);
  }

  getValidMobile(mobileNumber): Observable<any>{
    const key = 'b31e196c08855083140b14e761452e1b';
    
    let url = `http://apilayer.net/api/validate?access_key=${key}&number=${mobileNumber}&country_code=DK`;
    return this.http.get(url).map(res =>res)
  }

  getPendingSponsReq(id, token) {
    if (token === '') {
      return undefined;
    }
    let getUrl = this.dataService.serverPath + this.dataService.serverPort + '/api/get-sponsor-requests/' + id;
    return this.http.get(getUrl, this.httpOptions(token));
  }
  
  static getInitialUsersState(): UsersState {
    return {
      userId: undefined,
      userRole: undefined,
      token: '',
      validToken: '',
      tokenExp: 0,
      activated: 0,
      soberUsers: [],
      loggInSuccess: undefined,
      online: '0',
      pendingSponceReq: []
    };
  }
  
}
