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

  ngOnDestroy(): void { //remember to use this on all subscriptions
    this.subscription.unsubscribe();
  }
  constructor(private usersActions: UsersActions, private authService: AuthService, private ngRedux: NgRedux<IAppState>) { 
   
  }
  logOut() {
    location.replace('/');
    this.authService.setLocalStorage(null, undefined, undefined);
    this.usersActions.logOut();
    
   
  }
  ngOnInit(): void {
    this.subscription = this.ngRedux.select(state => state.users).subscribe(users => {
      console.log(users.validToken);
      if (users.validToken === 'Failed to authenticate token.') {
        this.logOut();
        // console.log('x');
        return false;
      }
    });
    this.usersActions.getAllUsers(this.authService.isToken);
    this.userId = this.authService.isUserIdValid;
  }
}
