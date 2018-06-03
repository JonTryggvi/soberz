import { NgRedux } from '@angular-redux/store';
import { Component, Inject, OnInit, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { DataService } from '../../../data.service';
import { IAppState } from '../../../store/store';
import { User } from '../../userprofile/usertable/usertable.component';
import { UsersActions } from '../../../users.actions';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {
  @Input() data: User | any;
  @Input() btnText;
  userData;
  userObj;
  constructor(private ngRedux: NgRedux<IAppState>, public dialog: MatDialog, private dataService: DataService) { 
 
  }

  openDialog(data): void {
    console.log('x');
    
    let dialogRef = this.dialog.open(ModalOverlay, {
      width: '350px',
      data: data
    });
  }

  ngOnInit() {
  
  }
 
}
@Component({
  selector: 'modal-overlay',
  templateUrl: 'modal-overlay.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalOverlay {

  constructor(
    public dialogRef: MatDialogRef<ModalOverlay>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usersActions: UsersActions,
    private authService: AuthService,
    
    
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteThisUser(userId) {
    // redux action to delete user
    this.usersActions.updateUserByField(0, 'activated', userId);
    // this.usersActions.getAllUsers(this.authService.isToken);
   
    this.dialogRef.close();
  }

}