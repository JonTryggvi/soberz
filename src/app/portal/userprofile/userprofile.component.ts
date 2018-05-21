import { NgRedux } from '@angular-redux/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../auth.service';
import { User } from '../../classes/user';
import { DataService } from '../../data.service';
import { FileUploadService } from '../../file-upload.service';
import { IAppState } from '../../store/store';
import { UsersActions } from '../../users.actions';
import { UsersService } from '../../users.service';
import { ChatService } from '../../chat.service';
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})


export class UserprofileComponent implements OnInit, OnDestroy {
  tabHeader: String;
  subscription: Subscription
  public profileUser: User;
  public profileUsers: User[];
  userImg;
  updateImg;
  firstNameEditMode: boolean;
  lastNameEditMode: boolean;
  usernameEditMode: boolean;
  emailEditMode: boolean;
  telEditMode: boolean;
  sponsorEditMode: boolean;
  theSponsor: boolean;
  aboutEditMode: boolean;
  imgEditMode: boolean;
  fileToUpload: File;
  loggedInUserId: any[] = [];
  loggedInUsers;
  jChuckNorris: any;
  serverPath: String;
  profileImg: String;
  localImg: String;
  ngOnDestroy(): void { //remember to use this on all subscriptions
    // this.subscription.unsubscribe();
  }

  constructor(private authService: AuthService, private usersActions: UsersActions, private ngRedux: NgRedux<IAppState>, private route: ActivatedRoute, private dataService: DataService, private fileUploadService: FileUploadService, private usersService: UsersService, private chatService: ChatService) { }
  paramId = Number(this.route.snapshot.paramMap.get('id'));
  
  ngOnInit(): void {
    this.serverPath = this.dataService.serverPath;
    this.usersService.getCucky().subscribe(data => {
      // console.log(data);
      this.jChuckNorris = data;
    });

    
    
    this.subscription = this.ngRedux.select(state => state.users).subscribe(users => {
      // console.log(users.soberUsers);
      // console.log(this.authService.isToken);
     
      if (users && users.soberUsers.length > 0) {
        this.profileUsers = users.soberUsers;
        // console.log(this.profileUsers);
        let aUsers = users.soberUsers.filter(x => {
          // console.log(typeof this.paramId);
          return Number(x.id) === this.paramId;
        });
   
        this.profileUser = aUsers[0];
        // console.log(this.profileUser.userImg.imgPath);
        
        this.profileImg = this.profileUser.userImg.imgPath;
        this.tabHeader = 'Here you can edit your profile ' + this.profileUser.username;
        // this.setUserAvatar();
        // console.log(this.profileUser['userImg'].imgId);
        this.theSponsor = this.profileUser.sponsor === 1 || this.profileUser.sponsor === 'true' || this.profileUser.sponsor === true ? true : false;
        // console.log(this.theSponsor);

      }
    });
    this.chatService.getOnlineUsers().subscribe((activeUser) => { 

      activeUser.user = this.profileUsers.filter(x => x.id === activeUser.activeUserId)[0];
      this.loggedInUserId.push(activeUser);
      // console.log(this.loggedInUserId);
    });

    this.chatService.userDisconnected().subscribe((socketId) => {
      // console.log(socketId);
      this.loggedInUserId.splice(this.loggedInUserId.findIndex(e => e.socketId === socketId), 1);
      // console.log(this.loggedInUserId);
    }); 
  }

  editUser(bool, inputName) {
    switch (inputName) {
      case 'firstname':
        this.firstNameEditMode = bool;
        break;
      case 'lastname':
        this.lastNameEditMode = bool;
        break;
      case 'username':
        this.usernameEditMode = bool;
        break;
      case 'email':
        this.emailEditMode = bool;
        break;
      case 'mobile':
        this.telEditMode = bool;
        break;
      case 'sponsor':
        this.sponsorEditMode = bool;
        break;
      case 'about':
        this.aboutEditMode = bool;
        break;
      case 'imgUrl':
        this.imgEditMode = bool;
        break; 
      default:
        break;
    }
  }
  submit(inpValue, inpName) {
    console.log(inpValue);
    
    this.usersActions.updateUserByField(inpValue, inpName, this.paramId);
    this.firstNameEditMode = false;
    this.editUser(false, inpName);    
    // this.deleteFile();
  }

  deleteFile() {
    this.usersService.deleteFile(this.profileImg, this.authService.isToken).subscribe(delfile => delfile);
 
  }

  handleFileInput(files, inpName) {
    this.fileToUpload = files.target.files.item(0);
   
    this.fileUploadService.postFile(this.fileToUpload, this.profileImg).subscribe(data => {
      let jUserImg = `{ "imgPath":  "${data.imgPath}", "imgId": "${data.imgId}" }`;
      this.submit(jUserImg, inpName);
      
      if (files.target.files && files.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          console.dir(event.target);
          this.localImg = event.target.result;
        }
        reader.readAsDataURL(files.target.files[0]);
      }
    }, error => {
      console.log(error);
    });
  }


  checkSponsor(response) {
    // console.log(response);
    this.theSponsor = response;
  }

  setUserAvatar() {
    return this.dataService.serverPath + this.profileUser.userImg.imgPath;
  }
 
  //  console.log(users.soberUsers);
}





