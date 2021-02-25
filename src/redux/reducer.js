import { combineReducers } from "redux";
import { AuthReducer, LoginReducer } from "../layouts/login/redux";

const reducer = combineReducers({AuthReducer, LoginReducer});

export default reducer;