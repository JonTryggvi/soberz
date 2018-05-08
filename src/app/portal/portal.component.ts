import { Component, OnInit } from '@angular/core';
import { UsersActions } from '../users.actions';
import { AuthService } from '../auth.service';
import { MatSidenavModule } from '@angular/material';
@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {
  userId;
  constructor(private usersActions: UsersActions, private authService: AuthService) { }
  logOut() {
    this.usersActions.logOut();
    this.authService.setLocalStorage(null, null, null);
    location.replace('/');
  }
  ngOnInit(): void {
    this.usersActions.getAllUsers(this.authService.isToken);
    this.userId = this.authService.isUserIdValid;
  }
}
