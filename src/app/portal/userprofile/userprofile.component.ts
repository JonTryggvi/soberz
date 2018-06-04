import { NgRedux } from '@angular-redux/store';
import { Component, OnDestroy, OnInit, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../auth.service';
import { User } from '../../classes/user';
import { DataService } from '../../data.service';
import { FileUploadService } from '../../file-upload.service';
import { IAppState } from '../../store/store';
import { UsersActions } from '../../users.actions';
import { UsersService } from '../../users.service';
import { ChatService } from '../../chat.service';
import { EventEmitter } from 'events';
import { ChatComponent } from './chat/chat.component';
import { DomSanitizer } from '@angular/platform-browser';
import { sponseReqNotifications } from '../../classes/notifycations';
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})


export class UserprofileComponent implements OnInit, OnDestroy {

  tabHeader: String;
  subscription: Subscription;
  subscribeCuck: Subscription;
  public profileUser: User;
  public profileUsers: User[];
  userImg: String;
  sanitezedImg;
  updateImg: String;
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
  loggedInUserId: User[] = [];
  loggedInUsers;
  jChuckNorris: any;
  serverPath: String;
  profileImg: String;
  localImg: String;
  userValidtoken: String;
  imgPlaceholder: String = 'http://ulbcnj.org/wp-content/uploads/2015/05/placeholder.png';
  userSponsRequests: sponseReqNotifications[] | any[];
  usersAskingForSponse: User[] = [];
  notifiers: any[] = [];

  ngOnDestroy(): void { //remember to use this on all subscriptions
    this.subscription.unsubscribe();
    this.subscribeCuck.unsubscribe();
  }

  constructor(private sanitizer: DomSanitizer, private router: Router, private authService: AuthService, private usersActions: UsersActions, private ngRedux: NgRedux<IAppState>, private route: ActivatedRoute, private dataService: DataService, private fileUploadService: FileUploadService, private usersService: UsersService, private chatService: ChatService) {}


  paramId = Number(this.route.snapshot.paramMap.get('id'));
  logOut() {
    this.usersActions.logOut(this.dataService.state.id);
    this.authService.setLocalStorage(null, undefined, undefined);
    this.router.navigate(['/home/login']);
    return false;
  }

  renderBgrImg(user) {
    let urlToSanitize = this.serverPath + user.userImg.imgPath;
    // console.log(urlToSanitize);
    return this.sanitizer.bypassSecurityTrustUrl(urlToSanitize);
    // console.log(this.sanitezedImg);
  }

  testAsync(data, id, auth) {
    Promise.resolve(data.getAllUsers(auth)) // dispatch
    .then(function (response) {
      data.getPendingSponsor(id, auth); //dispatch
      return response;
    })
  }

  
  ngOnInit() {
    // this.clickShowUserEvent(this.usersActions, this.paramId, this.authService.isToken);
    this.usersActions.getAllUsers(this.authService.isToken);
    setTimeout(() => {
      // server is throwing headers already sent headers
      this.usersActions.getPendingSponsor(this.paramId, this.authService.isToken);
    }, 1000);

    this.serverPath = this.dataService.serverPath + this.dataService.serverPort;
    this.subscribeCuck = this.usersService.getCucky().subscribe(data => {
      this.jChuckNorris = data;
    });

    this.subscription = this.ngRedux.select(state => state.users).subscribe(users => {
      this.userValidtoken = users.validToken;
      if (users && users.soberUsers.length > 0) {
        this.userSponsRequests = users.pendingSponceReq;
        let aPending = [...users.pendingSponceReq];
        aPending = aPending.map((pender, i) => {
          pender.userObj = users.soberUsers.filter(askingUser => askingUser.id === pender.fromUserId)[0];
          return pender;
        })
        this.notifiers = this.notifiers.concat(aPending);

        console.log(this.notifiers);
        this.profileUsers = users.soberUsers;
        // console.log(this.profileUsers);
        let aUsers = users.soberUsers.filter(x => {
          // console.log(typeof this.paramId);
          return Number(x.id) === this.paramId;
        });
 
        
        this.profileUser = aUsers[0];
        
  
        this.loggedInUserId = this.profileUsers.filter(y => y.online == '1');
        // get db img location
        this.profileImg = this.profileUser.userImg.imgPath;
        // console.log(this.loggedInUserId);
        
        this.tabHeader = 'Here you can edit your profile ' + this.profileUser.username;
        // this.setUserAvatar();
        // console.log(this.profileUser['userImg'].imgId);
        this.theSponsor = this.profileUser.sponsor === 1 || this.profileUser.sponsor === 'true' || this.profileUser.sponsor === true ? true : false;
        
        
      }
    });
    

  
 

    // this.chatService.getOnlineUsers().subscribe((activeUser) => {
    //   console.log('a user entered the building');
    //   this.usersActions.activeUser(activeUser);
    //   // let aFiltered = this.profileUsers.filter(x => x.id === activeUser.activeUserId ? x.socketId = activeUser.socketId : x.socketId = '')[0];
    //   // console.log(activeUser);
    //   // this.loggedInUserId.push(aFiltered);
    //   // console.log(this.loggedInUserId);
    // });

    // this.chatService.userDisconnected().subscribe((socketId) => {
    //   console.log('a user left the building');
    //   this.usersActions.inactiveUser(socketId);
      
    //   // console.log(socketId);
    //   // this.loggedInUserId.splice(this.loggedInUserId.findIndex(e => e.socketId === socketId), 1);
    //   // console.log(this.loggedInUserId);
    // }); 

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
    // console.log(inpValue);
    this.usersActions.updateUserByField(inpValue, inpName, this.paramId);
    this.firstNameEditMode = false;
    this.editUser(false, inpName);    
    // this.deleteFile();
  }

  openFileBrowser(event: any, id: string) {
    event.preventDefault();
    let element: HTMLElement = document.getElementById(id) as HTMLElement;
    element.click();
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

 
  //  console.log(users.soberUsers);
}





