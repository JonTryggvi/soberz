import { Component, OnInit, ChangeDetectorRef, HostListener, ElementRef,  ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material';
import { UsersActions } from '../../users.actions';
import { AuthService } from '../../auth.service';
import { ChatService } from '../../chat.service';



@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  public text: String;
  userId;
  opened;
  constructor(private eRef: ElementRef, private usersActions: UsersActions, private authService: AuthService, private chatServive: ChatService) { }
  
  logOut() {
    this.usersActions.logOut();
    this.authService.setLocalStorage(null, undefined, undefined);
    location.replace('/');
  }

  ngOnInit() {
    this.userId = this.authService.isUserIdValid;

    // console.log(this.userId);
    
  }

}
