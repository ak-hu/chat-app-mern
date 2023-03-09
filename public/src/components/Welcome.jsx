import { useState, useEffect } from "react";
import Robot from "../assets/robot.gif";

function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const getUserName = async () => {
      setUserName(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        ).username
      );
    }; getUserName();
  }, []);
  return (
    <div className="welcome">
      <img src={Robot} alt="Robot waves his palm" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Select a chat to start messaging.</h3>
    </div>
  );
}

export default Welcome;
