import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RxPerson, RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { FiMail, FiLock, FiUnlock } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../../utils/APIRoutes";
import { toastOptions } from "../utils/constants";

function Register({ isLoginActive }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isActive, setIsActive] = useState('not-active');

  //creating useState hook and setting empty values into it
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });


  //setting values of inputs
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  //setting an image value
  const imageUpload = (event) => {
    setValues({ ...values, profilePic: event.target.files[0] });
    setIsActive('active');
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
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
        "Password should be greater than 6 characters.",
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
      try {
        const { username, email, password, profilePic } = values;
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        if (profilePic) {
          formData.append("profilePic", profilePic, profilePic.name);
        };
        const { data } = await axios.post(registerRoute, formData);
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
          localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(data.user)
          );
          navigate("/");
        }
      } catch (error) {
        toast.error(error.response.data.msg, toastOptions);
      };
    }
  };

  return (
    <>
      <div className="resiter-wrapper form-container">
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
            <FiUnlock />
            <RxEyeOpen
              className={`${show ? "password-icon" : "none"}`}
              onClick={() => { setShow(false) }}
            />
            <RxEyeClosed
              className={`${!show ? "password-icon" : "none"}`}
              onClick={() => { setShow(true) }}
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
              onClick={() => { setShowConfirm(false) }}
            />
            <RxEyeClosed
              className={`${showConfirm ? "none" : "password-icon"}`}
              onClick={() => { setShowConfirm(true) }}
            />
          </div>
          <div className="input-field ">
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              className={`${isActive === 'active' ? 'active' : ''}`}
              onChange={(e) => imageUpload(e)}
            />
            <MdOutlineAddAPhoto />
          </div>
          <div>
            <button type="submit" className="input-field button">Create User</button>
          </div>
          <div className="login-signup">
            <span className="text">
              Already have an account ? <button onClick={() => isLoginActive('yes')} className="login-link">Login Now</button>
            </span>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Register;
