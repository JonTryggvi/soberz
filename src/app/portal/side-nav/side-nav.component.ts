import { Component, OnInit, ChangeDetectorRef, HostListener, ElementRef,  ViewChild } from '@angular/core';
import { MatSidenavModule, MatSidenav } from '@angular/material';
import { UsersActions } from '../../users.actions';
import { AuthService } from '../../auth.service';
import { ChatService } from '../../chat.service';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  public text: String;
  userId;
  opened;
  reason = '';

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }
  constructor(private router: Router, private eRef: ElementRef, private usersActions: UsersActions, private authService: AuthService, private chatServive: ChatService, private dataService: DataService) { }
  
  logOut() {
    this.authService.setLocalStorage(null, undefined, undefined);
    this.usersActions.logOut(this.dataService.thisUser.id);
    this.router.navigate(['/home/login']);
  }

  ngOnInit() {
    this.userId = this.authService.isUserIdValid;
  }
}
