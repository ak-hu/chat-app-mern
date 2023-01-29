import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { host, recieveMessageRoute, sendMessageRoute } from "../utils/APIRoutes";

import animationData from "../assets/typing.json";

var selectedChatCompare;


function SingleChat({ fetchAgain, socket, setFetchAgain, selectedChat }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);

    const { user } = ChatState();

    //styles for error notification
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
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

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <>
            <Container>
                <div className="chat-messages">
                    {messages.map((message, i) => {
                        return (
                            <div key={message._id} className="bg">
                                <div
                                    className={`message ${message.sender._id === user._id ? "sended" : "recieved"
                                        }`}>
                                    <div className="content ">
                                        <p>{message.content}</p>
                                        <p className="time">{message.createdAt.split('.')[0].split('T')[1].split(':', 2).join(':')}</p>
                                    </div>

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
    grid-template-rows: 15% 70% 15%;
  }
  p{
    color: #000;
  }
  .time{
    margin-top: 5px;
    text-align: right;
    font-size: 0.7rem;
  opacity: 0.5;
  }
  .chat-messages {
    position: relative;
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      position: relative;
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 0.8rem;
        font-size: 1.1rem;
        border-radius: 0.7rem;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
        .content{
            background: #dcf8c8;
            p::before {
                content: "";
                position: absolute;
                top: 0;
                right: -12px;
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
    .recieved {
      justify-content: flex-start;
      .content {
        background: #fff;
        p{
            background: #fff;
            &::before{
                content: "";
                position: absolute;
                top: 0;
                left: -12px;
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
    }
  }
`;


export default SingleChat;