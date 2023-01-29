import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { RxPerson, RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import { FiLock } from "react-icons/fi";
import axios from "axios";
import styled from "styled-components";
import { loginRoute } from "../utils/APIRoutes";

function Login() {
  const navigate = useNavigate();

  //creating useState hook and setting empty values into it
  const [values, setValues] = useState({ username: "", password: "" });
  const [show, setShow] = useState(false);

  //styles for error notification
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  //checking if user is already loged in
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

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

        console.log(JSON.stringify(data));

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
        toast.error("Error Occured!", toastOptions);
      };
    };
  }

  return (
    <>
      <FormContainer>
        <div className="login">

          <form className="form login" action="" onSubmit={(event) => handleSubmit(event)}>
            <span className="title">Login</span>
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
            <div>
              <button type="submit" className="input-field button">Log In</button>
            </div>
            <div className="login-signup">
              <span className="text">
                Don't have an account ? <Link to="/register">Create One.</Link>
              </span>
            </div>
          </form>
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
position: relative;
min-width: 430px;
width: 100%;
background: #fff;
border-radius: 10px;
box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
overflow: hidden;
margin: 0 20px;

.login{
  display: flex;
  flex-direction: column;
  width: 200%;
  transition: height 0.2s ease;

  .form {
    width: 50%;
    padding: 30px;
    background-color: #fff;
    transition: margin-left 0.18s ease;

    .title{
      position: relative;
      font-size: 27px;
      font-weight: 600;

      &::before{
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        height: 3px;
        width: 30px;
        background-color: #009688;
        border-radius: 25px;
      }
    }

    .input-field{
      position: relative;
      height: 50px;
      width: 100%;
      margin-top: 30px;

      input{
        position: absolute;
        height: 100%;
        width: 100%;
        padding: 0 35px;
        border: none;
        outline: none;
        font-size: 16px;
        border-bottom: 2px solid #ccc;
        border-top: 2px solid transparent;
        transition: all 0.2s ease;

        &:focus{
          border-bottom-color: #009688;
        }
        &:focus ~ svg{
          color: #009688;
        }
        &:not(:placeholder-shown){
          border-bottom-color: #009688;

          & ~ svg{
            color: #009688;
          }
        }
      }
      svg {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        color: #999;
        font-size: 23px;
        transition: all 0.2s ease;
      }

      .password-icon{
        left: 90%;
      }

      .none{
        display: none;
      }
    }
    .button{
      margin-top: 35px;
      width: 100%;
      border: none;
      color: #fff;
      font-size: 17px;
      font-weight: 500;
      letter-spacing: 1px;
      border-radius: 6px;
      background-color: #009688;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover{
        background-color: #265df2;
      }
    }

    .text{
      color: #333;
      font-size: 14px;

      a{
        color: #009688;
        text-decoration: none;

        &:hover{
          text-decoration: underline;
        }
      }
    }

    .login-signup{
      margin-top: 30px;
      text-align: center;
    }
  }
}
`;

export default Login;
