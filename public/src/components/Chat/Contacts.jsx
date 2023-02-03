import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { fetchChatsRoute } from "../../utils/APIRoutes";
import { getSender, getSenderProfilePic } from "../../config/ChatLogics";
import GroupChatCreate from "../Group/GroupChatCreate";

function Contacts({ fetchAgain, selectedChat, setModalActive, modalActive }) {
  const { setSelectedChat, chats, user, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState(undefined);
  const [loading, setLoading] = useState(false)

  //styles for error notification
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const getLoggedUser = async () => {
      setLoggedUser(await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)));
      fetchChats();
    }
    getLoggedUser();
  }, [fetchAgain]);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${fetchChatsRoute}`, config);
      setChats(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load the chats", toastOptions);
    }
  };

  return (
    <>
      <Container >
        <div>
          <div>
            {chats !== undefined && chats.length !== 0
              ? (
                <>
                  <div className="contacts">
                    {chats.map((chat) => (
                      <div
                        onClick={() => setSelectedChat(chat)}
                        key={chat._id}
                        className={`contact ${selectedChat === chat ? ("selected") : ("")}`}
                      >
                        <div className="avatar" >
                          <img src={process.env.REACT_APP_PROFILE_PICS_PATHS +
                            (chat.isGroupChat
                              ? chat.groupPic
                              : getSenderProfilePic(user, chat.users))
                          }
                            alt={chat.isGroupChat
                              ? chat.chatName
                              : getSender(user, chat.users)} />
                        </div>
                        <div className="grid-wrapper">
                          <h4 className="chat-name">
                            {chat.isGroupChat
                              ? chat.chatName
                              : getSender(user, chat.users)}
                          </h4>
                          {chat.latestMessage && (
                            <span className="time">
                              {chat.latestMessage.createdAt
                                .split('.')[0]
                                .split('T')[1]
                                .split(':', 2)
                                .join(':')}
                            </span>
                          )}
                          {chat.latestMessage && (
                            <div className="lattest-message">
                              <span>{chat.latestMessage.sender.username} : </span>
                              {chat.latestMessage.content.length > 50
                                ? chat.latestMessage.content.substring(0, 51) + "..."
                                : chat.latestMessage.content}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`add-group-chat`} onClick={() => { setModalActive('active') }}>
                    <button>+</button>
                  </div>
                </>
              )
              : (
                <div className="chat-loading">
                  <b>
                    Your chat list is empty.
                  </b>
                </div>
              )}

          </div>
        </div>
      </Container>
      {modalActive === 'active'
        ? <GroupChatCreate modalActive={modalActive} setModalActive={setModalActive} />
        : <></>
      }
      <ToastContainer />
    </>
  )
}

const Container = styled.div`
  .add-group-chat button{
    position: absolute;
    top: 37rem;
    left: 20rem;
    color: #fff;
    background-color: #009688;
    height: 3rem;
    width: 3rem;
    border-radius: 100%;
    font-size: 2rem;
    border: none;
    cursor: pointer;
  }
  .contacts {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .contact {
      display: grid;
      grid-template-columns: 20% 80%;
      align-items: stretch;
      width: 100%;
      padding: 15px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      cursor: pointer;
      transition: 0.5s ease-in-out;

      &:last-child{
        border-bottom: none;
      }
      &:hover{
        background: #f5f5f5;
      }
      .avatar {
        img {
          border-radius: 100%;
          height: 3rem;
          width: 3rem;
          max-inline-size: 100%;
        }
      }
      

      .grid-wrapper{
        display: grid;

        .chat-name {
          color: #111;
          grid-column-start: 1;
          grid-column-end: 2;
          grid-row-start: 1;
          grid-row-end: 1;
          
        }
        .time{
          grid-column-start: 3;
          grid-column-end: 3;
          grid-row-start: 1;
          grid-row-end: 1;

          text-align: right;
          font-size: 0.75em;
          color: #aaa;
          
        }
        .lattest-message{
          grid-row-start: 2;
          grid-row-end: 2;
          grid-column-start: 1;
          grid-column-end: 3;
          color: #aaa;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          font-size: 0.9em;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-top: 0.8rem;
          span{
            color: #838383;
          }
        }
      }
    }
    .selected {
      background-color: #ebebeb;
    }
  }

  .chat-loading{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30rem;
  }
  `;

export default Contacts;