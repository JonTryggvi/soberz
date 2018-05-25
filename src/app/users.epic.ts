import { Injectable } from "@angular/core";
import { ActionsObservable } from "redux-observable";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { AuthService } from "./auth.service";
import { UsersActions } from "./users.actions";
import { UsersService } from "./users.service";


@Injectable()
export class UsersEpic { 
  constructor(private userServise: UsersService, private authServise: AuthService) { }

  sendSponsorRequest = (acton$: ActionsObservable<any>) => {
    return acton$.ofType(UsersActions.SEND_SPONSORSHIP_REQUEST)
      .mergeMap(({ payload }) => {
        return this.userServise.sendSponsorshipRequest(payload)
          .map((result) => ({
            type: UsersActions.SEND_SPONSORSHIP_REQUEST_SUCCESS,
            payload: result
          }))
          .catch(error => Observable.of({
            type: UsersActions.SEND_SPONSORSHIP_REQUEST_ERROR,
            payload: error
          }));
      });
  }

  updateUserByFieldName = (action$: ActionsObservable<any>) => { 
    return action$.ofType(UsersActions.UPDATE_USER_BY_FIELD)
      .mergeMap(({ payload }) => {
        return this.userServise.updateUserByField(payload.inpVal, payload.inpName, payload.userId)
          .map((result) => ({
            type: UsersActions.UPDATE_USER_BY_FIELD_SUCCESS,
            payload: result
          }))
          .catch(error => Observable.of({
            type: UsersActions.UPDATE_USER_BY_FIELD_ERROR,
            payload: error
          }));
      });
  }

  

  saveUser = (action$: ActionsObservable<any>) => {
    return action$.ofType(UsersActions.SAVE_USER)
      .mergeMap(({payload}) => {
        // console.log(payload);
        
        return this.userServise.saveUser(payload)
          .map((result) => ({
            type: UsersActions.SAVE_USER_SUCCESS,
            payload: result
          }))
          .catch(error => Observable.of({
            type: UsersActions.GET_ALL_USERS_ERROR,
            payload: error
          }));
      });
  }

  getAllUsers = (action$: ActionsObservable<any>) => {
    return action$.ofType(UsersActions.GET_ALL_USERS)
      .mergeMap(({ payload }) => {
        return this.userServise.getAllUsersApi(payload)
          .map((result: any[]) => ({
            type: UsersActions.GET_ALL_USERS_SUCCESS,
            payload: result
          }))
          .catch(error => Observable.of({
            type: UsersActions.GET_ALL_USERS_ERROR,
            payload: error
          }));
      });
  }

  validateUser = (action$: ActionsObservable<any>) => {
    return action$.ofType(UsersActions.LOG_IN)
      .mergeMap(({ payload }) => {
        return this.authServise.authServiselogIn(payload)
          .map((result) => ({
            type: UsersActions.LOG_IN_SUCCESS,
            payload: result
          }))
          .catch(error => Observable.of({
            type: UsersActions.LOG_IN_FAILED,
            payload: error
          }));
      });
  }

  checkForToken = (action$: ActionsObservable<any>) => {
    return action$.ofType(UsersActions.CHECK_TOKEN)
      .mergeMap(({ payload }) => {
        // console.log(payload);
        
        return this.userServise.usCheckToken(payload[0], payload[1] )
        .map((result) => ({
            type: UsersActions.CHECK_TOKEN_VALID,
            payload: result
          }))
          .catch(error => Observable.of({
            type: UsersActions.CHECK_TOKEN_INVALID,
            payload: error
          }));
      });
  }

  logoutUser = (action$: ActionsObservable<any>) => {
    return action$.ofType(UsersActions.LOG_OUT)
      .mergeMap(({ payload }) => {
        console.log(payload);
        
        return this.authServise.logoutUser(payload)
          .map((result) => ({
            type: UsersActions.LOG_OUT_SUCCESS,
            payload: result
          }))
          .catch(error => Observable.of({
            type: UsersActions.LOG_OUT_ERROR,
            payload: error
          }));
      });
  }

}