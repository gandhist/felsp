import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../assets/css/login.css";
import { setFormLogin  } from "./redux";




const Login = () => {
  

  const dispatch = useDispatch();
  
  const stateLogin = useSelector(state => state.LoginReducer);
  
  const handleLogin = () => {
    console.log(stateLogin)
  }

  // handle on form change
  const handleOnChange = (e) => {
    let inputType = e.target.name;
    let inputValue = e.target.value;
    dispatch(setFormLogin(inputType, inputValue));
  }


  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-light navbar-laravel" >
          <div className="container">
            <a className="navbar-brand" href="#">
              P3SM
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              {/* <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Register
                  </a>
                </li>
              </ul> */}
            </div>
          </div>
        </nav>
        <main className="login-form" >
          <div className="cotainer">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">Login</div>
                  <div className="card-body">
                    <form>
                      <div className="form-group row">
                        <label
                          htmlFor="email_address"
                          className="col-md-4 col-form-label text-md-right"
                        >
                          Username
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            id="email_address"
                            className="form-control"
                            name="username"
                            required
                            value={stateLogin.username}
                            onChange={e => handleOnChange(e)}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          htmlFor="password"
                          className="col-md-4 col-form-label text-md-right"
                        >
                          Password
                        </label>
                        <div className="col-md-6">
                          <input
                            type="password"
                            id="password"
                            className="form-control"
                            name="password"
                            required
                            value={stateLogin.password}
                            onChange={e => handleOnChange(e)}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-md-6 offset-md-4">
                          <div className="checkbox">
                            <label>
                              <input type="checkbox" name="remember" /> Remember
                              Me
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 offset-md-4">
                        <button type="button" className="btn btn-primary" onClick={handleLogin}>
                          Login
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    </div>
  );
};


export default Login;
