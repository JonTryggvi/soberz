import { NgRedux } from '@angular-redux/store';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DataService } from '../../../data.service';
import { UsersActions } from '../../../users.actions';
import { UserprofileComponent } from '../userprofile.component';
import { Subscription } from 'rxjs/Subscription';
import { IAppState } from '../../../store/store';


@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.scss']
})
export class UsertableComponent implements OnInit, OnDestroy  {
  subscription: Subscription;
  userCount: number = this.usersData.profileUsers.length;
  dataSource;
  userObj;
  loggedInUserId;
  displayedColumns = this.usersData.profileUser.role === 'Admin' ? ["online", "firstname", "role", "addsponsor", "deleteuser", "setadmin"] : ["online", "firstname", "role", "addsponsor"];

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

 
  constructor(private usersData: UserprofileComponent, private dataService: DataService, private usersActions: UsersActions, private ngRedux: NgRedux<IAppState>) {
    
  }
  

  ngOnInit() {
    this.loggedInUserId = this.dataService.thisUser.id;
    this.subscription = this.ngRedux.select(state => state.users).subscribe(users => {
      this.dataSource = new MatTableDataSource(users.soberUsers);
    })
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.sort);
    
  }
  applyFilter(filterValue: any) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  // updateDataSource() {
  //   this.dataSource = new MatTableDataSource(this.usersData.profileUsers);
  // }
  setUserRole(e, userId) {
    // console.log(e);
    let inputSendValue = e.checked ? 1 : 2;
    this.usersActions.updateUserByField(inputSendValue, 'user_role', userId);
  }
  
}
export interface User {
  online: string;
  firstname: string;
  role: string;
}
