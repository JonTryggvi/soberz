import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from './notfound/notfound.component';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './home/login/login.component';
import { SignupComponent } from './home/signup/signup.component';
import { PortalComponent } from './portal/portal.component';
import { UserprofileComponent } from './portal/userprofile/userprofile.component';
import { AuthGuardService } from './auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'signin',
        component: SignupComponent
      }
    ]
  },
  {
    path: 'portal',
    component: PortalComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'user-profile/:id',
        component: UserprofileComponent
      }
    ]
  },
  {
    path: '**',
    component: NotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], //{ enableTracing: true }
  exports: [RouterModule]
})
export class AppRoutingModule { }
