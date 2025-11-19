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

export const addToFavorites = (book: any, userId: string) => {
  if (!book || !book.id) {
    console.error('addToFavorites: Invalid book', book);
    return {
      type: ADD_TO_FAVORITES,
      payload: null // Will be rejected by reducer
    };
  }
  if (!userId) {
    console.error('addToFavorites: Invalid userId', userId);
    return {
      type: ADD_TO_FAVORITES,
      payload: null // Will be rejected by reducer
    };
  }
  return {
    type: ADD_TO_FAVORITES,
    payload: { book, userId }
  };
};

export const removeFromFavorites = (book: any, userId: string) => {
  if (!book || !book.id) {
    console.error('removeFromFavorites: Invalid book', book);
    return {
      type: REMOVE_FROM_FAVORITES,
      payload: null // Will be rejected by reducer
    };
  }
  if (!userId) {
    console.error('removeFromFavorites: Invalid userId', userId);
    return {
      type: REMOVE_FROM_FAVORITES,
      payload: null // Will be rejected by reducer
    };
  }
  return {
    type: REMOVE_FROM_FAVORITES,
    payload: { book, userId }
  };
};

export const setCurrentUserId = (userId: string | null) => {
  return {
    type: "SET_CURRENT_USER_ID",
    payload: userId
  };
};
