// import * as types from './users.actions';
// import { usersReducer } from "./users.reducer";
// import { UsersService } from "./users.service";
// const deepFreeze = require('deep-freeze');

// describe('register reducer', () => { 
//   it('should return the initial state', () => {
//     expect(usersReducer(undefined, {})).toEqual(UsersService.getInitialUsersState());
//   });
//   it('should register a new user to the soberUsers array', () => { 
//     const initialState = UsersService.getInitialUsersState();
//     deepFreeze(initialState);
//     const afterState = UsersService.getInitialUsersState();
//     let gender = {
//        genderType: 'Male'
//     }
//     let user = {
//       id: 123,
//       firstname: 'Elvis',
//       lastname: 'Presley',
//       username: 'TheKing',
//       email: 'elvis@theking.com',
//       mobile: '1234567',
//       gender: gender,
//       sponsor: '',
//       imgUrl: '',
//       sponsees: [],
//       sponsors: [],
//       role: 'User',
//       about: 'about this user',
//       online: '1',
//       userImg: {},
//       activated: '1',
//       socketId: undefined
//     }
//     afterState.soberUsers.push(user);
//     console.log('afterstate: ', afterState.soberUsers);
    
//     const newState = usersReducer(initialState, {
//       type: types.UsersActions.SAVE_USER,
//       payload: user
//     });
//     console.log('newState: ', newState.soberUsers);
    
//     // expect(newState);
//     expect(newState.soberUsers).toEqual(afterState.soberUsers);
//   });
// });