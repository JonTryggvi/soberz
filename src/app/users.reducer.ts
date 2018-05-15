import { tassign } from 'tassign';
import { UsersState } from './store/store';
import { UsersActions } from './users.actions';
import { UsersService } from './users.service';

const INITIAL_STATE: UsersState = UsersService.getInitialUsersState();

export function usersReducer(state: UsersState = INITIAL_STATE, action: any) {
  switch (action.type) {
    case UsersActions.UPDATE_USER_BY_FIELD:
      return state;
    case UsersActions.UPDATE_USER_BY_FIELD_SUCCESS:
        // remember to update state on db callback
      // console.log(state);
      let upDateUserState = [...state.soberUsers ]
      const jUserFromServer = action.payload.updatedData
      let userToUPdateState = upDateUserState.filter(x => x.id === jUserFromServer.userId ? x[jUserFromServer.name] = jUserFromServer.value : x.firstname);
      
      
      console.log(userToUPdateState);
      
      return tassign(state, { soberUsers: upDateUserState});  
    case UsersActions.UPDATE_USER_BY_FIELD_ERROR:
      return state;  
  
    case UsersActions.SAVE_USER:
      console.log(action.payload);
      return state;
    case UsersActions.SAVE_USER_SUCCESS:
      // remember to update state with new user
      let newUserState = { ...state };
      newUserState.soberUsers.push(action.payload);
      // return state;
      console.log(newUserState);
      
       return tassign(state, newUserState);
    
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
      // console.log(action.payload);
      
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
      console.log(action.payload);
      
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