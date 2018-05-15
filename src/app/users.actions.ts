import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { User } from './classes/user';
import { IAppState } from './store/store';


@Injectable()
export class UsersActions {
  
  constructor(
    private ngRedux: NgRedux<IAppState>
  ) { }
  
  static SET_TYPE: String = 'SET_TYPE';
  static LOG_IN: String = 'LOG_IN';
  static LOG_IN_SUCCESS: String = 'LOG_IN_SUCCESS';
  static LOG_IN_FAILED: String = 'LOG_IN_FAILED';
  static CHECK_TOKEN: String = 'CHECK_TOKEN';
  static CHECK_TOKEN_VALID: String = 'CHECK_TOKEN_VALID';
  static CHECK_TOKEN_INVALID: String = 'CHECK_TOKEN_INVALID';
  static LOG_OUT: String = 'LOG_OUT';
  static GET_ALL_USERS: String = 'GET_ALL_USERS';
  static GET_ALL_USERS_SUCCESS: String = 'GET_ALL_USERS_SUCCESS';
  static GET_ALL_USERS_ERROR: String = 'GET_ALL_USERS_ERROR';
  static SAVE_USER: String = 'SAVE_USER';
  static SAVE_USER_SUCCESS: String = 'SAVE_USER_SUCCESS';
  static SAVE_USER_ERROR: String = 'SAVE_USER_ERROR';
  static GET_USER_TO_DELETE: String = 'GET_USER_TO_DELETE';
  static UPDATE_USER_BY_FIELD: String = 'UPDATE_USER_BY_FIELD';
  static UPDATE_USER_BY_FIELD_SUCCESS: String = 'UPDATE_USER_BY_FIELD_SUCCESS';
  static UPDATE_USER_BY_FIELD_ERROR: String = 'UPDATE_USER_BY_FIELD_SUCCESS';

  updateUserByField(inpVal, inpName, userId) {
  
    this.ngRedux.dispatch({
      type: UsersActions.UPDATE_USER_BY_FIELD,
      payload: {inpVal, inpName, userId}
    })
  }

  saveUser(formObject: User) {
    this.ngRedux.dispatch({
      type: UsersActions.SAVE_USER,
      payload: formObject
    });
  }

  getAllUsers(token: String) {
    this.ngRedux.dispatch({
      type: UsersActions.GET_ALL_USERS,
      payload: token
    })
  }
  
  setType(signin: boolean): void {
    this.ngRedux.dispatch({
      type: UsersActions.SET_TYPE,
      payload: signin
    });
  }

  logIn(loginForm: any): void {
    this.ngRedux.dispatch({
      type: UsersActions.LOG_IN,
      payload: loginForm
    })
  }

  logOut(): void {
    this.ngRedux.dispatch({
      type: UsersActions.LOG_OUT
    })
  }

  checkToken(token: String, userId: number): void {
    this.ngRedux.dispatch({
      type: UsersActions.CHECK_TOKEN,
      payload: [token, userId]
    })
  }

}
