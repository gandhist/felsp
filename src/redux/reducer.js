import { combineReducers } from "redux";
import { AuthReducer, LoginReducer } from "../layouts/Login/redux";
import { RegisterReducer } from '../layouts/Register/redux';
import { ForgotPasswordReducer } from '../layouts/ForgotPassword/redux';
import { ResetPasswordReducer } from '../layouts/PasswordReset/redux';


const reducer = combineReducers({AuthReducer, LoginReducer, RegisterReducer, ForgotPasswordReducer, ResetPasswordReducer});

export default reducer;