import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";


function Welcome(props) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const getUserName = async() => {
      setUserName(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        ).username
      );
    }; getUserName();
  }, []);
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Select a chat to start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  flex-direction: column;
  background-color: #ededed;
  img {
    height: 20rem;
  }
  span {
    color: #009688;
  }
`;

export default Welcome;
