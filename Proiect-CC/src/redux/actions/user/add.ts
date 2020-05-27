import { ADD_USER, AUTH_USER } from '../../actionTypes/userTypes';

export const addUser = (data: any) => ({
  payload: data,
  type: ADD_USER
});

export const authUser = (data: any) => ({
  payload: data,
  type: AUTH_USER
});
