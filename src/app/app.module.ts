import { NgReduxRouter, NgReduxRouterModule } from '@angular-redux/router';
import { DevToolsExtension, NgRedux, NgReduxModule } from '@angular-redux/store';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createLogger } from 'redux-logger';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { ChatService } from './chat.service';
import { DataService } from './data.service';
import { FileUploadService } from './file-upload.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent, AlertComponent } from './home/login/login.component';
import { SignupComponent } from './home/signup/signup.component';
import { MaterialModule } from './material.module';
import { NotfoundComponent } from './notfound/notfound.component';
import { ModalComponent, ModalOverlay } from './portal/components/modal/modal.component';
import { PortalComponent } from './portal/portal.component';
import { SideNavComponent } from './portal/side-nav/side-nav.component';
import { ChatComponent } from './portal/userprofile/chat/chat.component';
import { UserprofileComponent } from './portal/userprofile/userprofile.component';
import { UsertableComponent } from './portal/userprofile/usertable/usertable.component';
import { IAppState, rootReducer } from './store/store';
import { UsersActions } from './users.actions';
import { UsersEpic } from './users.epic';
import { UsersService } from './users.service';
import { MatSnackBar } from '@angular/material';
import { ModalAddComponent, ModalAddOverlay } from './portal/components/modal-addSponsor/modalAdd.component';
import { NewDemoComponent } from './home/new-demo/new-demo.component';
import { FilterUsersPipe } from './portal/userprofile/filter-users.pipe';
import { ModalUserComponent, ModalUserOverlay } from './portal/components/modal-user/modal-user.component';
@NgModule({
  declarations: [
    AppComponent,
    PortalComponent,
    LoginComponent,
    SignupComponent,
    UserprofileComponent,
    NotfoundComponent,
    HomeComponent,
    SideNavComponent,
    UsertableComponent,
    ModalComponent,
    ModalOverlay,
    ChatComponent,
    AlertComponent,
    ModalAddComponent,
    ModalAddOverlay,
    NewDemoComponent,
    FilterUsersPipe,
    ModalUserComponent,
    ModalUserOverlay
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgReduxModule,
    NgReduxRouterModule.forRoot(),
    HttpClientModule,
    FormsModule,
    MaterialModule
  ],
  entryComponents: [ModalOverlay, AlertComponent, ModalAddOverlay, ModalUserOverlay],
  providers: [AuthGuardService, AuthService, DataService, UsersActions, UsersService, UsersEpic, FileUploadService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private devTool: DevToolsExtension,
    private ngReduxRouter: NgReduxRouter,
    private usersEpic: UsersEpic
  ) {
    const rootEpic = combineEpics(
      this.usersEpic.validateUser,
      this.usersEpic.checkForToken,
      this.usersEpic.getAllUsers,
      this.usersEpic.saveUser,
      this.usersEpic.updateUserByFieldName,
      this.usersEpic.sendSponsorRequest,
      this.usersEpic.logoutUser
      // this.usersEpic.deleteUser,
      // this.usersEpic.createUser,
      // this.usersEpic.rateSitter
      // Each epic is referenced here.
    );
    const middleware = [
      createEpicMiddleware(rootEpic), createLogger({ level: 'info', collapsed: true })
    ];
    this.ngRedux.configureStore(rootReducer,
      {}, middleware, [devTool.isEnabled() ? devTool.enhancer() : f => f]);
  }

}
