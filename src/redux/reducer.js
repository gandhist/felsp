import { combineReducers } from "redux";
import { AuthReducer, LoginReducer } from "../layouts/Login/redux";
import { RegisterReducer } from '../layouts/Register/redux';


const reducer = combineReducers({AuthReducer, LoginReducer, RegisterReducer});

export default reducer;