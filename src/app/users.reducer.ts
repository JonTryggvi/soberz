import { tassign } from 'tassign';
import { UsersState } from './store/store';
import { UsersActions } from './users.actions';
import { UsersService } from './users.service';

const INITIAL_STATE: UsersState = UsersService.getInitialUsersState();

export function usersReducer(state: UsersState = INITIAL_STATE, action: any) {
  switch (action.type) {
    case UsersActions.GET_USER_TO_DELETE:
      let userToDeleteState = { ...state };
      userToDeleteState.userTodelete = action.payload;
      return tassign(state, userToDeleteState);  
    case UsersActions.SAVE_USER:
      console.log(action.payload);
      return state;
    case UsersActions.SAVE_USER_SUCCESS:
        // remember to update state with new user
      return state;
    
    case UsersActions.SAVE_USER_ERROR:
      return state;  
    case UsersActions.SET_TYPE:
      // console.log(action.payload);
      return state;
    case UsersActions.LOG_IN: 
      return state;
    case UsersActions.LOG_IN_SUCCESS:
      let jPayload = action.payload;
      // console.log(jPayload);
      // console.log(jPayload.response);
      let loginState = { ...state }
      loginState.userId = Number(jPayload.response.id)
      loginState.userRole = jPayload.response.role_name;
      loginState.token = jPayload.token;
      loginState.validToken = 'ok'
      
      
      return tassign(state, loginState);  
    case UsersActions.LOG_IN_FAILED:
      // console.log(action.payload);
      return state;
    
    case UsersActions.CHECK_TOKEN:
      return state;  
    case UsersActions.CHECK_TOKEN_VALID:
      // console.log(action.payload);
      let validState = { ...state };
      validState.validToken = action.payload.message;
      // console.log(validState);
      validState.userId = Number(action.payload.userId);
      validState.token = action.payload.token;
      return tassign(state, validState);
      case UsersActions.CHECK_TOKEN_INVALID:
      // console.log(action.payload);
      return state;  
    
    case UsersActions.LOG_OUT:
      let logOutState = {};

      return tassign(state, logOutState);
    case UsersActions.GET_ALL_USERS: 
      return state;
    case UsersActions.GET_ALL_USERS_SUCCESS:
      // console.log(action.payload);
      
      let ajUsers = action.payload.map((s, i) => {
        s.sponsors = JSON.parse(s.sponsors);
        s.sponsees = JSON.parse(s.sponsees);
        s.userImg = JSON.parse(s.userImg);
        return s;
      });
      // console.log(action.payload);
      return tassign(state, { soberUsers: ajUsers });
    case UsersActions.GET_ALL_USERS_ERROR:
      console.log(action.payload);
      return state;
    
    default:
      return state;
  }
}