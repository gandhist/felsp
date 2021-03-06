import { combineReducers } from "redux";
import { AuthReducer, LoginReducer } from "../layouts/Login/redux";
import { RegisterReducer } from '../layouts/Register/redux';
import { ForgotPasswordReducer } from '../layouts/ForgotPassword/redux';
import { ResetPasswordReducer } from '../layouts/PasswordReset/redux';
import { DataPesertaReducer } from "../views/DataPeserta/redux";


const reducer = combineReducers({AuthReducer, LoginReducer, RegisterReducer, ForgotPasswordReducer, ResetPasswordReducer, DataPesertaReducer});

export default reducer;