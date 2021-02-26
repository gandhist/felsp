import { LOGIN, SET_FORM_LOGIN } from "../../../redux/type";
const local = localStorage.getItem('auth')
// console.log(local)
// initial state
const initialAuth = {
    check : local ? local.token : false,
    data : {
        username: null,
        token: null,
        role: null,
    }
}

// reducer login 
const AuthReducer = (state = initialAuth, action) => {
    // logic
    if(action.type === LOGIN){
        return {
            check: action.check,
            data: {
                ...state.data, ...action.data
            }
        }
    }

    // return state
    return state;
}

const initialFormLogin = {
    username : '',
    password : '',
}

// reducer login 
const LoginReducer = (state = initialFormLogin, action) => {
    // logic
    if(action.type === SET_FORM_LOGIN){
        return {
            ...state,
            [action.inputType]: action.inputValue
        }
    }
    // return state
    return state;
}

export {AuthReducer, LoginReducer}