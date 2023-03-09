import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import { fetchChatsRoute } from "../utils/APIRoutes";
import { getSender, getSenderProfilePic } from "../config/ChatLogics";
import GroupChatCreate from "./Group/GroupChatCreate";

function Contacts({ fetchAgain, selectedChat, socket }) {
  const { setSelectedChat, chats, user, setChats } = ChatState();
  const [modalActive, setModalActive] = useState('not');
  const [ct, setCt] = useState();
  const [cht, setCht] = useState();

  //styles for error notification
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };


  useEffect(() => {
    fetchChats();
    // if (chats !== undefined && chats.length !== 0) {
    //   console.log(chats[0].latestMessage);
    // }
  }, [fetchAgain]);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${fetchChatsRoute}`, config);
      setCht(data);
    } catch (error) {
      toast.error("Failed to load the chats", toastOptions);
    }
  };

  const newChat = async () => {
    if (cht !== undefined && cht.length !== 0 && ct !== undefined) {
      cht.map((chat) => {
        var temp = Object.assign({}, chat);
        if (temp._id === ct._id) {
          temp.latestMessage.content = ct.latestMessage.content;
          temp.latestMessage.createdAt = ct.latestMessage.createdAt;
          temp.latestMessage.updatedAt = ct.latestMessage.updatedAt;
        }
        return temp;
      })
      return cht;
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on('contacts', (data) => {
        setCt(data);
        
      });
      newChat();
      setChats(cht);
      // if (chats !== undefined && chats.length !== 0) {
      //   console.log(chats[0].latestMessage);
      // }
    } else {
      console.log("socket doesn't connected")
    }
  });

  // console.log(chats)


  return (
    <>
      <div className="contacts-container" >
        <div>
          <div>
            {chats !== undefined && chats.length !== 0
              ? (
                <>
                  <div className="contacts">
                    {chats.map((chat) => {
                      return (
                        <div
                          onClick={() => setSelectedChat(chat)}
                          key={chat._id}
                          className={`contact ${selectedChat === chat ? "selected" : ""}`}
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
                      )
                    }
                    )}
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
      </div>
      {modalActive === 'active'
        ? <GroupChatCreate setModalActive={setModalActive} />
        : <></>
      }
      <ToastContainer />
    </>
  )
}

export default Contacts;