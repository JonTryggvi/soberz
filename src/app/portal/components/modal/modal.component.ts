import { NgRedux } from '@angular-redux/store';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { DataService } from '../../../data.service';
import { IAppState } from '../../../store/store';
import { UsertableComponent } from '../../userprofile/usertable/usertable.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {
  animal: string;
  name: string;
  usertoDelete;
  constructor(private ngRedux: NgRedux<IAppState>, public dialog: MatDialog, private usertableComponent: UsertableComponent, private dataService: DataService) { 
    this.ngRedux.select(state => state.users.userTodelete).subscribe(x => {
      console.log(x);
      if (x) {
        this.openDialog(x);
      }

    });
    
  }
  
  
  openDialog(obj): void {
    let dialogRef = this.dialog.open(ModalOverlay, {
      width: '250px',
      data: obj
    });

  }

  ngOnInit() {
    // we acomplish this with redux
 
 
  }
 

}
@Component({
  selector: 'modal-overlay',
  templateUrl: 'modal-overlay.html',
})
export class ModalOverlay {

  constructor(
    public dialogRef: MatDialogRef<ModalOverlay>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteThisUser(userId) {
    // redux action to delete user
  }

}