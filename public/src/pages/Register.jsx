import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { RxPerson, RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { FiMail, FiLock } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

function Register() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  //styles for error notification
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  //creating useState hook and setting empty values into it
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });

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

  //setting an image value
  const imageUpload = (event) => {
    setValues({ ...values, profilePic: event.target.files[0] });
  };

  //validation for incoming data
  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    //if passwords doesn't match
    if (password !== confirmPassword) {
      //throwing an error
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } //if username is shorter than 3 characters
    else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } //if password is shorter than 6 characters
    else if (password.length < 6) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } //if email field is empty
    else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }
    return true;
  };

  //the function which will call 
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, email, password, profilePic } = values;

      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (profilePic) {
        formData.append("profilePic", profilePic, profilePic.name);
      };

      const { data } = await axios.post(registerRoute, formData);

      //throwing the error
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      //setting the user into localstorage
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <div className="register">
          <form className="form signup" onSubmit={(event) => handleSubmit(event)}>
            <span className="title">Registration</span>
            <div className="input-field">
              <input
                type="text"
                placeholder="Enter your name"
                name="username"
                onChange={(e) => handleChange(e)}
              />
              <RxPerson />
            </div>
            <div className="input-field">
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                onChange={(e) => handleChange(e)}
              />
              <FiMail />
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
              onClick={()=>{setShow(false)}}
              />
              <RxEyeClosed 
              className={`${!show ? "password-icon" : "none"}`}
              onClick={()=>{setShow(true)}}
              />
            </div>
            <div className="input-field">
              <input
                type={`${showConfirm ? "text" : "password"}`}
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={(e) => handleChange(e)}
              />
              <FiLock />
              <RxEyeOpen 
              className={`${showConfirm ? "password-icon" : "none"}`}
              onClick={()=>{setShowConfirm(false)}}
              />
              <RxEyeClosed 
              className={`${showConfirm ? "none" : "password-icon"}`}
              onClick={()=>{setShowConfirm(true)}}
              />
            </div>
            <div className="input-field ">
            
            <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={(e) => imageUpload(e)}
              />
              <MdOutlineAddAPhoto />
              
            </div>
            <div>
              <button type="submit" className="input-field button">Create User</button>
            </div>
            <div className="login-signup">
              <span className="text">
                Already have an account ? <Link to="/login" className="text login-link">Login Now</Link>
              </span>
            </div>
          </form>
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

//declaring FormContainer as a div and setting styles
const FormContainer = styled.div`
  position: relative;
  min-width: 430px;
  width: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 0 20px;

  .register{
    display: flex;
    align-items: center;
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

          &[type="file" i]{
            color: #747474;
            padding-top: 4%;
            border-bottom-color: #ccc;

            &::-webkit-file-upload-button{
              display:none;
            }
            &:focus{
              color: #009688;
              border-bottom-color: #009688;
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

export default Register;
