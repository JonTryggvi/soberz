import { NgRedux } from '@angular-redux/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { IAppState } from '../../store/store';
import { UsersActions } from '../../users.actions';
import { ValidateForms } from '../../classes/valdateForms';
import { UsersService } from '../../users.service';
import { ISubscription, Subscription } from "rxjs/Subscription";
import "rxjs/add/operator/takeWhile";
import { MatSnackBar } from '@angular/material';
// import { UsersActions } from '../../users.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  mobPass;
  value;
  valuePass;
  checkNumber;
  loginForm: FormGroup;
  // loginFormSms: FormGroup;
  isLoggedin: boolean;
  apiSubscribe: Subscription;
  reduxSubscribe: Subscription;
  private alive: boolean = true;
  loginSuccess: boolean = undefined;
  getErrorMessage() {
    return this.loginForm.controls.user.hasError('required') ? 'You must enter a value' :
      this.loginForm.controls.user.hasError('email') ? 'Not a valid email' : '';
  }
  getPasswordErrorMessage() {
    return this.loginForm.controls.password.hasError('required') ? 'You must enter a value' : '';
  }

 
  constructor(private fb: FormBuilder, private router: Router, private usersActions: UsersActions, private authService: AuthService, private ngRedux: NgRedux<IAppState>, private usersService: UsersService, public snackBar: MatSnackBar) {
  
  }
  
  // getMobileErrorMessage() {
  //   // console.log(this.loginFormSms.controls.mobilenumber);
  
  //   return this.loginFormSms.controls.mobilenumber.hasError('required') ? 'You must enter a valid number' : '';
  // }


  onSubmit(loginForm) {
    //  e.preventDefault();
    
    if (loginForm.valid) {
      // console.log(loginForm);
      this.usersActions.logIn(loginForm.value);
    }
  }

 
  ngOnInit() {
  
    this.reduxSubscribe = this.ngRedux.select(state => state.users).subscribe(res => {
      if (res.token || res.validToken === 'ok' && res.activated === 1) {
        console.log('res', res);
        const id = Number(res.userId);
        this.authService.setLocalStorage(id, res.token, res.validToken);
        this.router.navigate(['/portal/user-profile/'+res.userId]);
      }
      this.loginSuccess = res.loggInSuccess;
      if (res.loggInSuccess == false) {
        this.snackBar.openFromComponent(AlertComponent, {
          duration: 10000,
        });
      }
    });
   
    
    this.loginForm = this.fb.group({
      user: [''],
      password: ['', Validators.required]
    })

    // this.loginFormSms = this.fb.group({
    //   mobilenumber: ['', Validators.compose([
    //     Validators.required,
    //     ValidateForms.getMobileValidator()
    //   ])]
    // })
    // console.log(this.loginForm);
    // console.log(this.loginFormSms);
  }
  ngOnDestroy(): void {
    // this.apiSubscribe.unsubscribe();
    this.alive = false;
    this.reduxSubscribe.unsubscribe();
  }
}
@Component({
  selector: 'snack-bar-component-example-snack',
  templateUrl: 'alert.html',
  styles: [`.example-pizza-party { color: hotpink; font-family: sans-serif; text-align: center; }`],
})
export class AlertComponent { }

