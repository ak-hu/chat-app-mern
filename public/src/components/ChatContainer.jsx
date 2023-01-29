import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";
import { IoIosArrowBack } from "react-icons/io";

export default function ChatContainer({ reset, socket, fetchAgain, setFetchAgain }) {
  const { setSelectedChat, selectedChat, user } = ChatState();

  return (
    <Container >
      <div className="chat-header">
        <button onClick={() => { setSelectedChat(undefined) }}>
          <IoIosArrowBack />
        </button>
        {selectedChat && (
          <div className="user-details">
            <div className="avatar">
              <img src={process.env.REACT_APP_PROFILE_PICS_PATHS + 
              (user._id === selectedChat.users[0]._id ? (
                selectedChat.users[1].profilePic
                ):(
                selectedChat.users[0].profilePic
              ))} 
              alt={(user._id === selectedChat.users[0]._id ? (
                selectedChat.users[1].username
                ):(
                selectedChat.users[0].username
              ))} />
            </div>
            <div className="username">
              <h3>{(user._id === selectedChat.users[0]._id ? (
                selectedChat.users[1].username
                ):(
                selectedChat.users[0].username
              ))}</h3>
            </div>
          </div>
        )}
      </div>
      <SingleChat fetchAgain={fetchAgain} socket={socket} setFetchAgain={setFetchAgain} selectedChat={selectedChat} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 90%;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    background: #ededed;
    display: grid;
    grid-template-columns: 5% 95%;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem 0;

    button{
      font-size: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        border: none;
    }
    
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          border-radius: 100%;
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: #000;
        }
      }
    }
  }
`;
