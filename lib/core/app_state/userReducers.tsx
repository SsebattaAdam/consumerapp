import { GET_USER_BOOKS, LOGIN, LOGOUT, ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES } from "./types";
import { AnyAction } from "redux";

interface UserAction extends AnyAction {
    payload?: any;
}

const initialState ={
isSignedIn: false,
username : "Adam",
userBooks : [],
favorites: [], // Array of { book, userId } objects
currentUserId: null as string | null
}

export default (state = initialState, action: UserAction) =>{
    const {type, payload} = action;

    switch(type){
        case LOGIN:
            return {...state, isSignedIn : payload}
        case LOGOUT:
            return {...state, isSignedIn: payload, currentUserId: null, favorites: []}
        case GET_USER_BOOKS:
              return {...state, userBooks : payload}
        case ADD_TO_FAVORITES:
            // payload should be { book, userId }
            if (!payload || !payload.book || !payload.book.id || !payload.userId) {
                console.warn('ADD_TO_FAVORITES: Invalid payload', payload);
                return state;
            }
            const favoriteExists = state.favorites.some(
                (fav: any) => fav && fav.book && fav.book.id === payload.book.id && fav.userId === payload.userId
            );
            if (favoriteExists) {
                return state; // Don't add duplicate
            }
            return {...state, favorites: [...state.favorites, payload]}
        case REMOVE_FROM_FAVORITES:
            // payload should be { book, userId }
            if (!payload || !payload.book || !payload.book.id || !payload.userId) {
                console.warn('REMOVE_FROM_FAVORITES: Invalid payload', payload);
                return state;
            }
            return {
                ...state, 
                favorites: state.favorites.filter(
                    (fav: any) => {
                        if (!fav || !fav.book || !fav.book.id) return true; // Keep invalid favorites for now
                        return !(fav.book.id === payload.book.id && fav.userId === payload.userId);
                    }
                )
            }
        case "SET_CURRENT_USER_ID":
            return {...state, currentUserId: payload}


    }

    return state;
}