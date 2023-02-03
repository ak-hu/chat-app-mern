import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styled from "styled-components";
import Login from '../components/Authorization/Login';
import Register from '../components/Authorization/Register';

function Authorization(props) {
  const navigate = useNavigate();
  const [isLoginActive, setIsLoginActive] = useState('yes');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/");
  }, [navigate]);

  return (
    <>
      <Container>
        {isLoginActive === 'yes'
          ? <Login isActive={setIsLoginActive} />
          : <Register isLoginActive={setIsLoginActive} />
        }
      </Container>
      <ToastContainer />
    </>
  );
}
const Container = styled.div`
  position: relative;
  min-width: 430px;
  width: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 0 20px;

  .form-container{
    display: flex;
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
  
            &[type="file" i]{
              color: #747474;
              padding-top: 4%;
              border-bottom-color: #ccc;
  
              &::-webkit-file-upload-button{
                display:none;
              }
              &:focus{
                border-bottom-color: #009688;
              }
  
              & ~ svg{
                color: #999;
              }
            }
  
            &:focus{
              border-bottom-color: #009688;

              & ~ svg{
                color: #009688;
              }
            }
            &:not(:placeholder-shown){
              &:not([type="file" i]){
                border-bottom-color: #009688;
  
                & ~ svg{
                  color: #009688;
                }
              }
            }
          }
          .active{
            border-bottom-color: #009688 !important;
            & ~ svg{
              color: #009688 !important;
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

  
        .text{
          color: #333;
          font-size: 14px;
  
          .login-link{
            border: none;
            background-color: transparent;
            color: #009688;
            cursor: pointer;
            font-size: 14px;
            
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
export default Authorization;