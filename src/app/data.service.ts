import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { IAppState } from './store/store';

@Injectable()
export class DataService {
  //  Call to web servise to get data.
  // add dummy data until we can do that
  subscription;
  serverPath = 'http://localhost:1983';
  
  

  constructor(private ngRedux: NgRedux<IAppState>) {
    this.subscription = this.ngRedux.select(state => state.users).subscribe(users => {
      // console.log(users);
  
    });
  }



  static randomNumberId(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
