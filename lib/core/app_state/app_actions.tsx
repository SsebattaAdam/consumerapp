import axios from "axios";
import { LOGIN, LOGOUT, GET_USER_BOOKS, ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES } from "./types"; 
import { Dispatch } from "redux";
 
export const loginAction = () =>{
    return {
        type: LOGIN,
        payload: true
    }
 }


   export const logOut = () =>{
    return {
        type: LOGOUT,
        payload: false
    }
 }

    export const changeUsername = ( userName : string) =>{
    return {
        type: "CHNAGE_USERNAME",
        payload: userName
    }
 }


export const getUserData = () => {
  return async (dispatch:Dispatch) => {
    try {
      const response = await axios.get('https://649ea51c245f077f3e9cb5bc.mockapi.io/books');
      dispatch({
        type: GET_USER_BOOKS,
        payload: response.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const addToFavorites = (book: any) => {
  return {
    type: ADD_TO_FAVORITES,
    payload: book
  };
};

export const removeFromFavorites = (book: any) => {
  return {
    type: REMOVE_FROM_FAVORITES,
    payload: book
  };
};
