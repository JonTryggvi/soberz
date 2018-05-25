import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IAppState } from './store/store';

@Injectable()
export class DataService {

  subscription;
  // private dataSource = new BehaviorSubject<any>({});
  // currentData = this.dataSource.asObservable();
  thisUser;
  serverPort = ':1983';
  // serverPort = '';
  state;
  chatPort = ':1984';
  serverPath = 'http://localhost';
  // serverPath = 'http://soberz-env.impgapztd4.us-east-2.elasticbeanstalk.com';

  constructor(private ngRedux: NgRedux<IAppState>) {
    this.subscription = this.ngRedux.select(state => state.users).subscribe(users => {
      this.state = users;
      this.thisUser = users.soberUsers.filter(x => x.id === users.userId)[0];
    });
  }

  // changeData(data: any, i) {
  //   data.index = i;
  //   this.dataSource.next(data);
  // }
  static randomNumberId(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
