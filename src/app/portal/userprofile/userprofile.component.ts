import { NgRedux } from '@angular-redux/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../auth.service';
import { User } from '../../classes/user';
import { DataService } from '../../data.service';
import { IAppState } from '../../store/store';
import { UsersActions } from '../../users.actions';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})


export class UserprofileComponent implements OnInit, OnDestroy {
  subscription: Subscription
  public profileUser: User;
  public profileUsers: User[];
  displayedColumns = ['name', 'sponsors', 'sponsees'];

  userImg;

  setUserAvatar() {
    return this.dataService.serverPath + this.userImg;
  }


  // public sponsors: Sponsor[] use to show list
  // public sponsees: Sponsee[]

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(private authService: AuthService, private usersActions: UsersActions, private ngRedux: NgRedux<IAppState>, private route: ActivatedRoute, private dataService: DataService) { }
  paramId = Number(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void {
    this.subscription = this.ngRedux.select(state => state.users).subscribe(users => {
      // this.sponsors = users.soberUsers.filter(x => x.sponsor === 'true');
      // this.sponsees = users.soberUsers.filter(x => x.sponsor === 'false');
      if (users && users.soberUsers.length > 0 ) {
        this.profileUsers = users.soberUsers;
        
      
        // console.log(this.profileUsers);
  
        let aUsers = users.soberUsers.filter(x => {
          // console.log(typeof this.paramId);
          this.userImg = x['userImg'].imgPath;
          return Number(x.id) === this.paramId;
        });
        this.profileUser = aUsers[0];
        // console.log(this.profileUser);
        
      }
     
    });
  }
  //  console.log(users.soberUsers);
}





