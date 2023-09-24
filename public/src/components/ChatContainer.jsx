import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { RxExit, RxPencil2 } from "react-icons/rx";
import { GoKebabVertical } from "react-icons/go";

import { ChatState } from "../context/ChatProvider";
import { getSender, getSenderProfilePic } from "../config/ChatLogics";

import UpdateGroupChat from "./Group/UpdateGroupChat";
import SubmitModal from "./Aux/SubmitModal";
import SingleChat from "./SingleChat";

import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { removeGroupChatRoute, deleteChatRoute } from "../utils/APIRoutes";
import { toastOptions } from "../utils/constants";

function ChatContainer({ socket, fetchAgain, setFetchAgain }) {
  const { setSelectedChat, selectedChat, user } = ChatState();
  const [showToggle, setShowToggle] = useState(false);
  const [modalUpdateActive, setModalUpdateActive] = useState('not');
  //submit modal
  const [modalSubmitActive, setModalSubmitActive] = useState('not');
  const [warnText, setWarnText] = useState("");
  const [submText, setSubmText] = useState("");

  const updateChat = () => {
    setModalUpdateActive("active");
    setShowToggle(!showToggle);
  };

  const leaveChat = () => {
    setModalSubmitActive("leave");
    setShowToggle(!showToggle);
    setWarnText("You cannot return this chat by yourself.");
    setSubmText(`Are you sure you want to leave ${selectedChat.chatName}?`);
  };

  const handleLeave = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(
        `${removeGroupChatRoute}`,
        {
          chatId: selectedChat._id, userId: user._id,
        }, 
        config
      );
      setFetchAgain(!fetchAgain);
      toast.success(`You succefuly leaved ${selectedChat.chatName}`, toastOptions);
      setSelectedChat();
      setModalSubmitActive("not");
    } catch (error) {
      toast.error("Something went wrong! Please, try again", toastOptions);
    }
  };

  const deleteChat = () => {
    setModalSubmitActive("delete");
    setShowToggle(!showToggle);
    setWarnText("You cannot restore this chat. All messages will be permanently deleted.");
    setSubmText(`Are you sure you want to delete chat with ${selectedChat.chatName}?`);
  };

  const handleDelete = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(
        `${deleteChatRoute}`,
        {
          chatId: selectedChat._id,
        },
        config
      );
      setFetchAgain(!fetchAgain);
      toast.success(`You succefuly deleted the chat`, toastOptions);
      setSelectedChat();
      setModalSubmitActive('not');
    } catch (error) {
      toast.error("Something went wrong! Please, try again", toastOptions);
    }
  };

  return (
    <div className="right-side" >
      <div className="chat-header">
        <button className="icon-button" onClick={() => { setSelectedChat(undefined) }}>
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
          <button className={`icon-button ${showToggle ? 'transform' : ''} `} onClick={() => { setShowToggle(!showToggle) }}>
            <GoKebabVertical />
          </button>
        </div>

        {selectedChat.isGroupChat ? (
          <div className={`${showToggle ? 'chat-menu-toggle ' : 'none'}`}>
            <button className="list-item" onClick={updateChat}>
              <RxPencil2 />
              <span>Update</span>
            </button>
            <button className="list-item" onClick={leaveChat}>
              <RxExit />
              <span>Leave Group</span>
            </button>
          </div>
        ) : (
          <div className={`${showToggle ? 'chat-menu-toggle ' : 'none'}`}>
            <button className="list-item" onClick={deleteChat}>
              <RxExit />
              <span>Delete Chat</span>
            </button>
          </div>
        )}
      </div>
      <SingleChat fetchAgain={fetchAgain} socket={socket} setFetchAgain={setFetchAgain} selectedChat={selectedChat} />

      {modalUpdateActive === "active"
        ? <UpdateGroupChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} setModalActive={setModalUpdateActive} />
        : <></>
      }
      {modalSubmitActive === "leave"
        ? <SubmitModal
          setModalActive={setModalSubmitActive}
          warnText={warnText}
          submText={submText}
          handleFunction={handleLeave}
        />
        : <></>
      }
      {modalSubmitActive === "delete"
        ? <SubmitModal
          setModalActive={setModalSubmitActive}
          warnText={warnText}
          submText={submText}
          handleFunction={handleDelete}
        />
        : <></>
      }
    </div >
  );
}

export default ChatContainer;