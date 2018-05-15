import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DataService } from '../../../data.service';
import { UsersActions } from '../../../users.actions';
import { UserprofileComponent } from '../userprofile.component';


@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.scss']
})
export class UsertableComponent implements OnInit  {

  userCount: number = this.usersData.profileUsers.length;
  dataSource;
  userObj;
  displayedColumns = ["id", "firstname", "role", "deleteuser"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

 
  constructor(private usersData: UserprofileComponent, private dataService: DataService, private usersActions: UsersActions) {
    
  }



  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.usersData.profileUsers);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataService.currentData.subscribe(data => this.userObj = data);
  }
  applyFilter(filterValue: any) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  
  userData(data, i) {
    console.log(i);
    
    this.dataService.changeData(data, i);
  }
 


}
export interface User {
  id: number;
  firstname: string;
  role: string;

}
