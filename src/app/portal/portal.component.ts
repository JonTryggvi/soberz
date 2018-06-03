import { NgRedux } from '@angular-redux/store';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { IAppState } from '../store/store';
import { UsersActions } from '../users.actions';
@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {
  userId;
  subscription;
  timeStamp: number;
  ngOnDestroy(): void { //remember to use this on all subscriptions
    this.subscription.unsubscribe();
  }
  constructor(private usersActions: UsersActions, private authService: AuthService, private ngRedux: NgRedux<IAppState>) { 
   
  }
  logOut() {
    this.usersActions.logOut(this.userId);
    this.authService.setLocalStorage(undefined, undefined, undefined);
    location.replace('/');
  }
  
  ngOnInit() {
    
    this.subscription = this.ngRedux.select(state => state.users).subscribe(users => {
      // console.log(users.validToken);
      this.timeStamp = Math.round((new Date()).getTime() / 1000);
      // console.log(users.tokenExp !< 1);
      if (users.validToken === 'Failed to authenticate token.' || users.tokenExp !< 0 && users.tokenExp < this.timeStamp) {
        this.logOut();
      }
    }); 
    
    // this.usersActions.getAllUsers(this.authService.isToken);
    this.userId = this.authService.isUserIdValid;
  
    // console.log(this.userId);
    
  }
}
