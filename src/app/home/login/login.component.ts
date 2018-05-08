import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersActions } from '../../users.actions';
import { AuthService } from '../../auth.service';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store/store';
// import { UsersActions } from '../../users.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoggedin: boolean;
 
  getErrorMessage() {
    return this.loginForm.controls.user.hasError('required') ? 'You must enter a value' :
      this.loginForm.controls.user.hasError('email') ? 'Not a valid email' :
        '';
  }
  getPasswordErrorMessage() {
    return this.loginForm.controls.password.hasError('required') ? 'You must enter a value' : '';
  }
  constructor(private fb: FormBuilder, private router: Router, private usersActions: UsersActions, private authService: AuthService, private ngRedux: NgRedux<IAppState>) { }

  onSubmit(loginForm) {
    //  e.preventDefault();
    
    if (loginForm.valid) {
      // console.log(loginForm);
      this.usersActions.logIn(loginForm.value);

    }
  }

 
  ngOnInit() {
    this.ngRedux.select(state => state.users).subscribe(res => {
      // console.log('res', res);
      
      if (res.token || res.validToken === 'ok') {
        const id = Number(res.userId);
        this.authService.setLocalStorage(id, res.token, res.validToken);
        this.router.navigate(['/portal/user-profile/'+res.userId]);
      }

      // if (this.authService.isTokenValid === 'ok' ) {
      //   this.router.navigate(['/portal']);
      // }
   
    });
   
    
    this.loginForm = this.fb.group({
      user: ['jontryggvi@jontryggvi.is', [Validators.required, Validators.email]],
      password: ['123#$%', Validators.required]
    })
    // console.log(this.loginForm);

    
  }

}
