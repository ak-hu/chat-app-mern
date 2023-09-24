import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

import { RxPerson, RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import { FiLock } from "react-icons/fi";
import axios from "axios";
import { loginRoute } from "../../utils/APIRoutes";
import { toastOptions } from "../utils/constants";

function Login({ isActive }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const [show, setShow] = useState(false);

  //setting values of inputs
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  //checking if the entered data exists in the database
  const validateForm = () => {
    const { username, password } = values;
    //checking if usernames match
    if (username === "") {
      toast.error("Username or Password is incorrect", toastOptions);
      return false;
    } //checking if passwords match
    else if (password === "") {
      toast.error("Username or Password is incorrect", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { username, password } = values;
        const { data } = await axios.post(loginRoute, {
          username,
          password,
        }, config);
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
          localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(data)
          );
          navigate("/");
        }
      } catch (error) {
        toast.error(error.response.data.msg, toastOptions);
      };
    };
  }

  return (
    <>
      <div className="login-wrapper form-container">
        <form className="form login" action="" onSubmit={(event) => handleSubmit(event)}>
          <span className="title">Login</span>
          <div className="inputs">
            <div className="input-field">
              <input
                type="text"
                placeholder="Username"
                name="username"
                onChange={(e) => handleChange(e)}
                min="3"
              />
              <RxPerson />
            </div>
            <div className="input-field">
              <input
                type={`${show ? "text" : "password"}`}
                placeholder="Password"
                name="password"
                onChange={(e) => handleChange(e)}
              />
              <FiLock />
              <RxEyeOpen
                className={`${show ? "password-icon" : "none"}`}
                onClick={() => { setShow(false) }}
              />
              <RxEyeClosed
                className={`${!show ? "password-icon" : "none"}`}
                onClick={() => { setShow(true) }}
              />
            </div>
          </div>
          <div>
            <button type="submit" className="input-field button">Log In</button>
          </div>
          <div className="login-signup">
            <span className="text">
              Don't have an account ? <button onClick={() => isActive('no')} className="login-link">Create One</button>
            </span>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;
