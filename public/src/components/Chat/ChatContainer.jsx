import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { RxExit, RxPencil2 } from "react-icons/rx";
import { GoKebabVertical } from "react-icons/go";
import styled from "styled-components";

import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderProfilePic } from "../../config/ChatLogics";

import UpdateGroupChat from "../Group/UpdateGroupChat";
import LeaveChat from "../Group/LeaveChat";
import SingleChat from "./SingleChat";

export default function ChatContainer({ socket, fetchAgain, setFetchAgain }) {
  const { setSelectedChat, selectedChat, user } = ChatState();
  const [showToggle, setShowToggle] = useState(false);
  const [modalUpdateActive, setModalUpdateActive] = useState('not');
  const [modalSubmitActive, setModalSubmitActive] = useState('not');

  return (
    <Container >
      <div className="chat-header">
        <button className="chat-header__button" onClick={() => { setSelectedChat(undefined) }}>
          <IoIosArrowBack />
        </button>
        {selectedChat && (
          <div className="user-details">
            <div className="avatar">
              <img src={process.env.REACT_APP_PROFILE_PICS_PATHS +
                (selectedChat.isGroupChat
                  ? selectedChat.groupPic
                  : getSenderProfilePic(user, selectedChat.users))
              }
                alt={selectedChat.isGroupChat
                  ? selectedChat.chatName
                  : getSender(user, selectedChat.users)} />
            </div>
            <div className="username">
              <h3>{selectedChat.isGroupChat
                ? selectedChat.chatName
                : getSender(user, selectedChat.users)}</h3>
            </div>
          </div>
        )}
        <div className="chat-menu">
          <button className="chat-header__button" onClick={() => { setShowToggle(!showToggle) }}>
            <GoKebabVertical />
          </button>
        </div>

        {selectedChat.isGroupChat ? (
          <div className={`${showToggle ? 'chat-menu-toggle ' : 'none'}`}>
            <button className="list-item" onClick={() => { { setModalUpdateActive("active") } { setShowToggle(!showToggle) } }}>
              <RxPencil2 />
              <span>Update</span>
            </button>
            <button className="list-item" onClick={() => { { setModalSubmitActive("active") } { setShowToggle(!showToggle) } }}>
              <RxExit />
              <span>Leave Group</span>
            </button>
          </div>
        ) : (
          <div className={`${showToggle ? 'chat-menu-toggle ' : 'none'}`}>
            <div className="list-item">
              <button>delete chat</button>
            </div>
          </div>
        )}
      </div>
      <SingleChat fetchAgain={fetchAgain} socket={socket} setFetchAgain={setFetchAgain} selectedChat={selectedChat} />

      {modalUpdateActive === "active"
        ? <UpdateGroupChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} setModalActive={setModalUpdateActive} />
        : <></>
      }
      {modalSubmitActive === "active"
        ? <LeaveChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} setModalActive={setModalSubmitActive} />
        : <></>
      }
    </Container >
  );
}

const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: 10% 90%;
  overflow: hidden;
  transition: all 0.5s ease;

  .chat-header {
    background: #ededed;
    display: grid;
    grid-template-columns: 5% 88% 7%;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem 0;

    &__button{
      font-size: 1.5rem;
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

        img {
          border-radius: 100%;
          height: 3rem;
          width: 3rem;
        }
      .username {
        h3 {
          color: #000;
        }
      }
    }
    .chat-menu{
      &__button{
        cursor: pointer;
      }
    }
    .chat-menu-toggle{
      position: absolute;
      top: 9%;
      left: 82%;
      background: #fff;
      min-width: 150px;
      min-height: 20px;
      z-index: 2;
      padding: 10px 0;
      border-radius: 5px;
      cursor: pointer;

      .list-item{
        padding: 10px;
        transition: all 0.3s ease;
        border: none;
        background-color: transparent;
        width: 100%;
        display: flex;
        align-items: center;

        &:hover{
          background-color: #f5f5f5;
        }
        &:first-child{
          svg{
            font-size: 1.05rem;
          }
        }

        svg{
          margin-right: 1rem;
          font-size: 1rem;
          color: #51585c;
        }
        span{
          color: #51585c;
          font-size: 14px;
        }
      }
    }
  }
`;
