import { combineReducers, createStore, Store, AnyAction} from "redux"
import userReducer from "./userReducers"
import storage from "@react-native-async-storage/async-storage"
import { persistStore, persistReducer } from 'redux-persist'


const persistConfig = {
    key:"root" ,//this to store all the user data in the application, the logged user details
    storage
}

const rootReducer = combineReducers({
    userData: persistReducer(persistConfig, userReducer)
})

export const  store =  createStore(rootReducer)
export const  persistor = persistStore(store)
export type RootState = ReturnType<typeof rootReducer>
//the next thing is to connect this app state into the main app