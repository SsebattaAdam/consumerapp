import { GET_USER_BOOKS, LOGIN, LOGOUT, ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES, ADD_TRANSACTION, UPDATE_TRANSACTION_STATUS } from "./types";
import { AnyAction } from "redux";

interface UserAction extends AnyAction {
    payload?: any;
}

export interface Transaction {
    uuid: string;
    reference: string;
    bookId: number;
    bookTitle: string;
    amount: number;
    currency: string;
    phoneNumber: string;
    status: 'processing' | 'successful' | 'failed' | 'cancelled' | 'pending';
    createdAt: string;
    updatedAt?: string;
    userId: string;
}

const initialState ={
isSignedIn: false,
username : "Adam",
userBooks : [],
favorites: [], // Array of { book, userId } objects
currentUserId: null as string | null,
transactions: [] as Transaction[] // Array of user transactions
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
        case ADD_TRANSACTION:
            // payload should be a Transaction object
            if (!payload || !payload.uuid || !payload.bookId) {
                console.warn('ADD_TRANSACTION: Invalid payload', payload);
                return state;
            }
            // Check if transaction already exists
            const transactionExists = state.transactions.some(
                (tx: Transaction) => tx.uuid === payload.uuid
            );
            if (transactionExists) {
                return state; // Don't add duplicate
            }
            return {...state, transactions: [...state.transactions, payload]}
        case UPDATE_TRANSACTION_STATUS:
            // payload should be { uuid, status, updatedAt? }
            if (!payload || !payload.uuid || !payload.status) {
                console.warn('UPDATE_TRANSACTION_STATUS: Invalid payload', payload);
                return state;
            }
            return {
                ...state,
                transactions: state.transactions.map((tx: Transaction) =>
                    tx.uuid === payload.uuid
                        ? { ...tx, status: payload.status, updatedAt: payload.updatedAt || new Date().toISOString() }
                        : tx
                )
            }


    }

    return state;
}