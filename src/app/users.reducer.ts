import { tassign } from 'tassign';
import { UsersState } from './store/store';
import { UsersActions } from './users.actions';
import { UsersService } from './users.service';

const INITIAL_STATE: UsersState = UsersService.getInitialUsersState();

export function usersReducer(state: UsersState = INITIAL_STATE, action: any) {
  switch (action.type) {

    case UsersActions.GET_PENDING_SPONS_REQ:
      return state;
    case UsersActions.GET_PENDING_SPONS_REQ_SUCCESS:
      // work with state if epic is successfull 
      let thePenders = action.payload.map((pender, i) => {
        pender.date = Number(Math.round(pender.date));
        pender.type = 'sponsor_request';
        return pender;
      })
      let newStatePendSp = [...state.pendingSponceReq];
       
      let concatState = newStatePendSp.concat(thePenders);

      return tassign(state, { pendingSponceReq: concatState });
    
    case UsersActions.GET_PENDING_SPONS_REQ_ERROR:
      console.log(action.payload)  
      // work with state if epic is unsuccessfull  
      return state;  

    case UsersActions.SEND_SPONSORSHIP_REQUEST: 
      return state;
    case UsersActions.SEND_SPONSORSHIP_REQUEST_SUCCESS:
      // console.log(action.payload);
        
      return state;
    case UsersActions.SEND_SPONSORSHIP_REQUEST_ERROR:
      console.log(action.payload);  
      return state;  
    case UsersActions.UPDATE_USER_BY_FIELD:
      return state;
    case UsersActions.UPDATE_USER_BY_FIELD_SUCCESS:
        // remember to update state on db callback
      // console.log(state);
      let upDateUserState = [...state.soberUsers ]
      const jUserFromServer = action.payload.updatedData
      let userToUPdateState = upDateUserState.filter(x => {
        let changeNameFromServer = jUserFromServer.name;
        let changValueFromServer = jUserFromServer.value;
        switch (jUserFromServer.name) {
          case 'user_role':
            changeNameFromServer = 'role';
            changValueFromServer = jUserFromServer.value == 1 ? 'Admin' : 'User';
            break;
          default:
            // changeNameFromServer = jUserFromServer.name;
            // changValueFromServer = jUserFromServer.value;
            break;
        }
         
        return x.id === jUserFromServer.userId ? x[changeNameFromServer] = changValueFromServer : x.firstname
      });

      return tassign(state, { soberUsers: userToUPdateState }); 
    
    case UsersActions.UPDATE_USER_BY_FIELD_ERROR:
      return state;  
  
    case UsersActions.SAVE_USER:
    
    /************************************testing*************************************/  
      // console.log('reducer ', action.payload);
      // let newUserTestState = [ ...state.soberUsers, action.payload];
      // console.log('reducerPushed: ', newUserTestState);
      // return tassign(state, { soberUsers: newUserTestState });
    /************************************testing*************************************/  
    
      return state;
    case UsersActions.SAVE_USER_SUCCESS:
      // remember to update state with new user
      let newUserState = [...state.soberUsers, action.payload];
      return tassign(state, { soberUsers: newUserState });
    
    case UsersActions.SAVE_USER_ERROR:
      return state;  
    case UsersActions.SET_TYPE:
      // console.log(action.payload);
      return state;
    case UsersActions.LOG_IN: 
      return state;
    case UsersActions.LOG_IN_SUCCESS:
      let jPayload = action.payload;
      let loginState = { ...state }
      loginState.userId = Number(jPayload.response.id)
      loginState.userRole = jPayload.response.role_name;
      loginState.token = jPayload.token;
      loginState.validToken = 'ok';
      loginState.activated = jPayload.response.activated;
      loginState.loggInSuccess = true;
      loginState.tokenExp = jPayload.tokenExpires;
      return tassign(state, loginState);  
    case UsersActions.LOG_IN_FAILED:
      let newLogginFailed = { ...state };
      newLogginFailed.loggInSuccess = false;
      return tassign(state, newLogginFailed);
    
    case UsersActions.CHECK_TOKEN:
      return state;  
    case UsersActions.CHECK_TOKEN_VALID:
      // console.log(action.payload);
      let validState = { ...state };
      validState.validToken = action.payload.message;
      // console.log(action.payload.v.exp);
      validState.tokenExp = action.payload.v.exp;
      validState.userId = Number(action.payload.userId);
      validState.token = action.payload.token;
      return tassign(state, validState);
    case UsersActions.CHECK_TOKEN_INVALID:
      let invalidState = { ...state };
      invalidState.validToken = action.payload.error.message;
      console.log(action.payload);
      return tassign(state, invalidState);  
    
    case UsersActions.LOG_OUT:
      let logOutState = INITIAL_STATE;
      return tassign(state, logOutState);
    case UsersActions.LOG_OUT_SUCCESS:
      console.log(state);
      let newSignedOutState = [...state.soberUsers];
      let signedOutuser = newSignedOutState.filter(x => x.id == action.payload.id)[0];
      // signedOutuser.online = '0';
      // signedOutuser.socketId = '';
      return tassign(state, {soberUsers: newSignedOutState});
    case UsersActions.LOG_OUT_ERROR:
      return state;  
    case UsersActions.GET_ALL_USERS: 
      return state;
    case UsersActions.GET_ALL_USERS_SUCCESS:
      // console.log(action.payload);
      let ajUsers = action.payload.map((s, i) => {
        s.sponsors = JSON.parse(s.sponsors);
        s.sponsees = JSON.parse(s.sponsees);
        s.userImg = JSON.parse(s.userImg);
        s.pending_spons_req = JSON.parse(s.pending_spons_req);
        return s;
      });
      // console.log(action.payload);
      return tassign(state, { soberUsers: ajUsers });
    
    case UsersActions.GET_ALL_USERS_ERROR:
      console.log(action.payload);
     
      return state;
    
    case UsersActions.ACTIVE_USER:
      // console.log(action.payload);
      let aActiveUserState = [...state.soberUsers];
      let activeUser = aActiveUserState.filter(x => x.id === action.payload.activeUserId)[0];
      activeUser.socketId = action.payload.socketId;
      activeUser.online = '1';
      // console.log(aActiveUserState); 
      return tassign(state, { soberUsers: aActiveUserState});
    case UsersActions.INACTIVE_USER:
      let aInactiveState = [...state.soberUsers];
      
      let inactiveUser = aInactiveState.filter(x => x.socketId && x.socketId === action.payload)[0];
      inactiveUser.socketId = '';
      inactiveUser.online = '0';
      return tassign(state, { soberUsers: aInactiveState });
      // return state;
      
    default:
      return state;
  }
}