import { combineReducers } from "redux";
import { AuthReducer, LoginReducer } from "../layouts/Login/redux";
import { RegisterReducer } from '../layouts/Register/redux';
import { ForgotPasswordReducer } from '../layouts/ForgotPassword/redux';
import { ResetPasswordReducer } from '../layouts/PasswordReset/redux';
import { DataPesertaReducer } from "../views/DataPeserta/redux";
import { StatusPesertaReducer } from "../views/Pembinaan/redux";


const reducer = combineReducers({AuthReducer, LoginReducer, RegisterReducer, ForgotPasswordReducer, ResetPasswordReducer, DataPesertaReducer, StatusPesertaReducer});

export default reducer;