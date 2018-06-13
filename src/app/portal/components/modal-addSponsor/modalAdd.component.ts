import { NgRedux } from '@angular-redux/store';
import { Component, Inject, OnInit, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { DataService } from '../../../data.service';
import { IAppState } from '../../../store/store';
import { User } from '../../userprofile/usertable/usertable.component';
import { UsersActions } from '../../../users.actions';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'add-sponsor-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalAddComponent implements OnInit {
  @Input() data: User | any;
  @Input() btnText: String;
  

  constructor(private ngRedux: NgRedux<IAppState>, public dialog: MatDialog, private dataService: DataService) { 
 
  }

  openDialog(data): void {
    
    let dialogRef = this.dialog.open(ModalAddOverlay, {
      width: '350px',
      data: data
    });
  }

  ngOnInit() {
  //  console.log(this.btnText);
  }
 
}
@Component({
  selector: 'modal-overlay',
  templateUrl: 'modal-overlay.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalAddOverlay {
  loggedInUserId;
  constructor(
    public dialogRef: MatDialogRef<ModalAddOverlay>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usersActions: UsersActions,
    private authService: AuthService,
    private dataService: DataService
    
  ) { 
    this.loggedInUserId = this.dataService.thisUser.id;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ask(userIdToAsk, userAsking) {
 
    this.usersActions.sendSponsor(userIdToAsk, userAsking, this.authService.isToken);
    this.dialogRef.close();
  }

}