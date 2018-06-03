import { NgRedux } from '@angular-redux/store';
import { Component, Inject, OnInit, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { DataService } from '../../../data.service';
import { IAppState } from '../../../store/store';
import { User } from '../../userprofile/usertable/usertable.component';
import { UsersActions } from '../../../users.actions';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent implements OnInit {

  @Input() data: User | any;
  @Input() btnText;
  userData;
  userObj;
  serverPath: String;
  constructor(private ngRedux: NgRedux<IAppState>, public dialog: MatDialog, private dataService: DataService) {
    
    
  }

  openDialog(data): void {
    let dialogRef = this.dialog.open(ModalUserOverlay, {
      width: '550px',
      data: data
    });
  }

  ngOnInit() {

  }

}
@Component({
  selector: 'modal-overlay',
  templateUrl: 'modal-overlay-user.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserOverlay {
  serverPath: String;
  loggedInUserId: number;
  currentlySponsors: number;
  constructor(
    public dialogRef: MatDialogRef<ModalUserOverlay>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usersActions: UsersActions,
    private authService: AuthService,
    private dataService: DataService

  ) { 
    this.serverPath = this.dataService.serverPath + this.dataService.serverPort;
    this.currentlySponsors = this.data.sponsees.length;
    // console.log(this.currentlySponsors);
    
    // console.log(this.serverPath);

  }

  onNoClick(): void {
    this.loggedInUserId = this.dataService.thisUser.id;
    this.dialogRef.close();
  }

  chatWithUser(userId) {

    // redux action to start a chat session with this user
    // redirect to a new route or a new overlay/tab chat window
    // issue a push or notifycation to user 
    this.dialogRef.close();
  }

}