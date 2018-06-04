import { Component, Injectable, OnInit } from '@angular/core';
import { UsersActions } from './users.actions';
import { AuthService } from './auth.service';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from './store/store';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  title = 'app';
  tokenIsValid;
  
  constructor( private router: Router,private usersActions: UsersActions, private authService: AuthService, private ngRedux: NgRedux<IAppState>) {

  }
  
  ngOnInit() {
    if (this.authService.isToken !== 'undefined') {
      // console.log(this.authService.isUserIdValid);
      this.usersActions.checkToken(this.authService.isToken, this.authService.isUserIdValid);
    }
    this.ngRedux.select(state => state.users).subscribe(res => {
      // console.log('res', res);
      if (res.validToken === 'ok') {
        // this.authService.setLocalStorage(this.authService.isUserIdValid, res.token, res.validToken)
        this.router.navigate(['portal/user-profile/' + this.authService.isUserIdValid]);
      }
    });
  }
}
