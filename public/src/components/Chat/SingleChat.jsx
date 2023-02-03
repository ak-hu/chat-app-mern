import { useEffect, useState } from "react";
import styled from "styled-components";
import ChatInput from "../Group/ChatInput";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { recieveMessageRoute, sendMessageRoute } from "../../utils/APIRoutes";
import { isGroupRecieved, isAnotherSender, isLastMessage } from "../../config/ChatLogics";
import animationData from "../../assets/typing.json";

var selectedChatCompare;

function SingleChat({ fetchAgain, socket, setFetchAgain, selectedChat }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const { user } = ChatState();

    //styles for error notification
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `${recieveMessageRoute}/${selectedChat._id}`,
                config
            );
            setMessages(data);
            setLoading(false);
            socket.current.emit("join chat", selectedChat._id);
        } catch (error) {
            toast.error("Failed to Load the Messages", toastOptions);
        }
    };

    const sendMessage = async (msg) => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setNewMessage("");

            const { data } = await axios.post(
                `${sendMessageRoute}`,
                {
                    sender: user._id,
                    content: msg,
                    chatId: selectedChat,
                },
                config
            );
            socket.current.emit("new message", data);
            setMessages([...messages, data]);
        } catch (error) {
            toast.error("Failed to send the Message", toastOptions);
        }
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("connected", () => setSocketConnected(true));
            socket.current.on("typing", () => setIsTyping(true));
            socket.current.on("stop typing", () => setIsTyping(false));
        } else {
            console.log("socket doesn't connected")
        }
    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    let counter_sended = 0;
    return (
        <>
            <Container>
                <div className="chat-messages">
                    {messages.map((message, i) => {
                        return (
                            <div key={message._id}
                                className={`message
                                    ${isGroupRecieved(message, selectedChat, user._id) ? "recieved-group" : ""} 
                                    ${isAnotherSender(message, user._id)
                                        ? (isLastMessage(messages, message, i, user._id)
                                            ? "recieved"
                                            : "recieved margin-10")
                                        : ("sended")}`}>

                                <div className={`${isGroupRecieved(message, selectedChat, user._id) ? 'sender-pic' : ''}`}>
                                    {isLastMessage(messages, message, i, user._id)
                                        ? (<img src={process.env.REACT_APP_PROFILE_PICS_PATHS + message.sender.profilePic}
                                            alt={message.sender.username} />)
                                        : (<></>)
                                    }
                                </div>
                                <div className="content">
                                    {isLastMessage(messages, message, i, user._id)
                                        ? (<div className="sender-username">
                                            <a>{message.sender.username}</a>
                                        </div>)
                                        : (<div></div>)
                                    }
                                    {isAnotherSender(message, user._id)
                                        ? (<p className={`${isLastMessage(messages, message, i, user._id) ? 'triangle' : ''}`}>
                                            {message.content}
                                        </p>)
                                        : (<>
                                            <span id={counter_sended++}></span>
                                            <p className={`${counter_sended === 1 ? 'triangle' : ''}`}>
                                                {message.content}
                                            </p>
                                        </>)
                                    }
                                    <span className="time">
                                        {message.createdAt.split('.')[0]
                                            .split('T')[1]
                                            .split(':', 2)
                                            .join(':')}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <ChatInput handleSendMsg={sendMessage} />
            </Container>
            <ToastContainer />
        </>
    );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 90% 10%;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 85% 15%;
  }
  p{
    color: #000;
  }

  .chat-messages {
    position: relative;
    display: flex;
    padding: 1rem;
    gap: 0.5rem;
    flex-direction: column;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .margin-10{
        margin-top: -10px;
    }
    .message {
      position: relative;
      display: flex;
      align-items: center;
      transition: all 1s ease;
      .content {
        max-width: 60%;
        overflow-wrap: break-word;
        padding: 0.8rem;
        font-size: 0.9rem;
        border-radius: 0.7rem;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
      .sender-pic{
        width: 1.5rem;
        height: 1.5rem;

        img{
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 100%;
        }
      }
    }
    .sended {
        justify-content: flex-end;
        .content{
            background: #dcf8c8;
            margin-top: 5px;
            
            .triangle::before {
                content: "";
                position: absolute;
                top: 8%;
                right: -1.1%;
                width: 20px;
                height: 20px;
                background: linear-gradient(
                    135deg,
                    #dcf8c6 0%,
                    #dcf8c6 50%,
                    transparent 50%,
                    transparent
                );
            
            }
        }
    }
    .recieved{
        justify-content: flex-start;
        align-items: flex-start;
        gap: 0.5rem;

        & + &{
            gap: 0.2rem;
        }
        .content {
            background: #fff;
            .triangle::before{
                content: "";
                position: absolute;
                top: 0;
                left: 0.65%;
                width: 20px;
                height: 20px;
                background: linear-gradient(
                    225deg,
                    #fff 0%,
                    #fff 50%,
                    transparent 50%,
                    transparent
                );
            }
        }

    }
    .recieved-group {
        justify-content: flex-start;
        gap: 1.2rem;
        align-items: flex-start;
      .content {
        margin-top: 0.4rem;
        background: #fff;
        
        p{
            margin-bottom: 5px;
        }
            .triangle::before{
                content: "";
                position: absolute;
                top: 0.4rem;
                left: 2.1rem;
                width: 20px;
                height: 20px;
                background: linear-gradient(
                    225deg,
                    #fff 0%,
                    #fff 50%,
                    transparent 50%,
                    transparent
                );
            }
            .sender-username{
                margin-bottom: 5px;
                font-weight: 550;

                a{
                    color: #009688;
                }
            }
        }
    }
    .time{
        width: 30px;
        display: block;
        text-align: left;
        font-size: 0.7rem;
        opacity: 0.5;
      }
  }
`;


export default SingleChat;