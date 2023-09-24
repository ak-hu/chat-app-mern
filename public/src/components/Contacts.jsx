import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import { fetchChatsRoute } from "../utils/APIRoutes";
import { toastOptions } from "../utils/constants";
import { getSender, getSenderProfilePic } from "../config/ChatLogics";
import GroupChatCreate from "./Group/CreateGroupChat";

function Contacts({ fetchAgain, selectedChat, socket }) {
  const { setSelectedChat, chats, user, setChats } = ChatState();
  const [loading, setLoading] = useState(false);
  const [modalActive, setModalActive] = useState('not');

  const fetchChats = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${fetchChatsRoute}`, config);
      setChats(data);
      setLoading(false);
    } catch (error) {
      setLoading(true);
      toast.error("Failed to load the chats", toastOptions);
    }
  };
  useEffect(() => {
    fetchChats(); // eslint-disable-next-line
  }, [fetchAgain]);


  const newChat = (data) => {
    if (chats !== undefined && chats.length !== 0 && data !== undefined) {
      return chats.map((chat) => {
        var temp = Object.assign({}, chat);
        if (temp._id === data._id) temp.latestMessage = data.latestMessage;
        return temp;
      });
    };
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("contacts", (data) => {
        setChats(newChat(data));
      });
    }
  });

  return (
    <>
      <div className="contacts-container" >
        <div>
          <div>
            {chats && chats.length !== 0
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
                                : getSenderProfilePic(user, chat.users))}
                              alt={chat.isGroupChat
                                ? chat.chatName
                                : getSender(user, chat.users)}
                            />
                          </div>
                          <div className="grid-wrapper">
                            <h4 className="chat-name">
                              {chat.isGroupChat ? chat.chatName : getSender(user, chat.users)}
                            </h4>
                            {chat.latestMessage && (
                              <span className="time">
                                {chat.latestMessage.createdAt.split('.')[0].split('T')[1].split(':', 2).join(':')}
                              </span>
                            )}
                            {chat.latestMessage && (
                              <div className="lattest-message">
                                <span className="sender">{chat.latestMessage.sender.username} : </span>
                                {chat.latestMessage.content.length !== 0
                                  ? (
                                    <span className="content">
                                      {chat.latestMessage.content.length > 20
                                        ? chat.latestMessage.content.substring(0, 21) + "..."
                                        : chat.latestMessage.content}
                                    </span>
                                  )
                                  : (<span className="file">Photo</span>)
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className='add-group-chat' onClick={() => { setModalActive('active') }}>
                    <button className="icon-button">+</button>
                    <span className="tooltiptext">New group chat</span>
                  </div>
                </>
              )
              : (loading
                ? <div className="spinner-container chat-loading">
                  <div className="loading-spinner">
                  </div>
                </div>
                : <div className="chat-loading">
                  <b>Your chat list is empty</b>
                </div>
              )}
          </div>
        </div>
      </div>
      {modalActive === 'active' &&
        <GroupChatCreate setModalActive={setModalActive} />
      }
      <ToastContainer />
    </>
  )
}

export default Contacts;