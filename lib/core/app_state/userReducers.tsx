import { GET_USER_BOOKS, LOGIN, LOGOUT, ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES } from "./types";
import { AnyAction } from "redux";

interface UserAction extends AnyAction {
    payload?: any;
}

const initialState ={
isSignedIn: false,
username : "Adam",
userBooks : [],
favorites: []
}

export default (state = initialState, action: UserAction) =>{
    const {type, payload} = action;

    switch(type){
        case LOGIN:
            return {...state, isSignedIn : payload}
        case LOGOUT:
            return {...state, isSignedIn : payload}
        case GET_USER_BOOKS:
              return {...state, userBooks : payload}
        case ADD_TO_FAVORITES:
            return {...state, favorites: [...state.favorites, payload]}
        case REMOVE_FROM_FAVORITES:
            return {...state, favorites: state.favorites.filter((book: any) => book.id !== payload.id)}


    }

    return state;
}