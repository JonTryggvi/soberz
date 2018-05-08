import { routerReducer } from '@angular-redux/router';
import { combineReducers } from 'redux';
import { User } from '../classes/user';
import { usersReducer } from './../users.reducer';

export class UsersState {
  userId: number;
  userRole: String;
  token: String;
  validToken: String;
  soberUsers: User[];
  userTodelete: User;
}
export class IAppState {
  users?: UsersState;
}
export const rootReducer = combineReducers<IAppState>({
  users: usersReducer,
  // when you add more redusers you add them here...
  router: routerReducer
});  