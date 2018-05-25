import { routerReducer } from '@angular-redux/router';
import { combineReducers } from 'redux';
import { User } from '../classes/user';
import { usersReducer } from './../users.reducer';

export class UsersState {
  userId: number;
  userRole: String;
  token: String;
  activated: number;
  validToken: String;
  soberUsers: User[];
  loggInSuccess: boolean;
  online: String;
}
export class IAppState {
  users?: UsersState;
}
export const rootReducer = combineReducers<IAppState>({
  users: usersReducer,
  // when you add more redusers you add them here...
  router: routerReducer
});  
