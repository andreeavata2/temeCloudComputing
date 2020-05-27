import { ADD_USER, AUTH_USER } from '../actionTypes/userTypes';
import { UserState, UserTypes } from '../actions/user/add.d';

const INITIAL_STATE: UserState = {
  data: [],
  isLoggedIn: false
};

function userReducer(state = INITIAL_STATE, action: UserTypes): UserState {
  switch (action.type) {
    case ADD_USER: {
      return {
        ...state,
        data: [action.payload, ...state.data]
      };
    }
    case AUTH_USER: {
      return {
        ...state,
        isLoggedIn: action.payload
      };
    }
    default:
      return state;
  }
}

export default userReducer;
