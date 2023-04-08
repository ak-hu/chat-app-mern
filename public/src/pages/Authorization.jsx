import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from '../components/Authorization/Login';
import Register from '../components/Authorization/Register';

function Authorization() {
  const navigate = useNavigate();
  const [isLoginActive, setIsLoginActive] = useState('yes');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/");
  }, [navigate]);

  return (
    <>
      <div className='auth'>
        {isLoginActive === 'yes'
          ? <Login isActive={setIsLoginActive} />
          : <Register isLoginActive={setIsLoginActive} />
        }
      </div>
      <ToastContainer />
    </>
  );
}

export default Authorization;