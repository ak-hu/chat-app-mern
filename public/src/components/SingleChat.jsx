import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";

import { ChatState } from "../context/ChatProvider";
import { recieveMessageRoute, sendMessageRoute } from "../utils/APIRoutes";
import { isGroupRecieved, isAnotherSender, isLastMessage } from "../config/ChatLogics";

import ChatInput from "./ChatInput";


function SingleChat({ fetchAgain, socket, setFetchAgain, selectedChat }) {
    const [messages, setMessages] = useState([]);
    const [socketConnected, setSocketConnected] = useState(false);

    const { user } = ChatState();

    //styles for error notification
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };


    const sendMessage = async (msg) => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
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
            socket.current.emit('contacts', data.chat);
        } catch (error) {
            toast.error("Failed to send the Message", toastOptions);
        }
    };


    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChat) return;

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.get(
                    `${recieveMessageRoute}/${selectedChat._id}`,
                    config
                );
                setMessages(data);
                socket.current.emit("join chat", selectedChat._id);
            } catch (error) {
                toast.error("Failed to Load the Messages", toastOptions);
            }
        };
        fetchMessages();
    }, [selectedChat]);


    useEffect(() => {
        socket.current.on("message recieved", (newMessageRecieved) => {
            setMessages([...messages, newMessageRecieved]);
        });
    });


    useEffect(() => {
        if (socket.current) {
            socket.current.on("connected", () => setSocketConnected(true));
        } else {
            console.log("socket doesn't connected")
        }
    }, []);

    return (
        <>
            <div className="messages-container">
                <div className="chat-messages">
                    {messages.map((message, i) => {
                        return (
                            <div key={message._id}
                                className={`message
                                    ${isGroupRecieved(message, selectedChat, user._id) ? "recieved-group" : ""} 
                                    ${isAnotherSender(message, user._id)
                                        ? (isLastMessage(messages, message, i)
                                            ? "recieved margin-10"
                                            : "recieved")
                                        : ("sended")}`}>

                                <div className={`${isGroupRecieved(message, selectedChat, user._id) ? 'sender-pic' : ''}`}>
                                    {isGroupRecieved(message, selectedChat, user._id) && isLastMessage(messages, message, i)
                                        ? (<img src={process.env.REACT_APP_PROFILE_PICS_PATHS + message.sender.profilePic}
                                            alt={message.sender.username} />)
                                        : (<></>)
                                    }
                                </div>
                                <div className="content">
                                    {isGroupRecieved(message, selectedChat, user._id) && isLastMessage(messages, message, i, user._id)
                                        ? (<div className="sender-username">
                                            <span>{message.sender.username}</span>
                                        </div>)
                                        : (<div></div>)
                                    }
                                    {isAnotherSender(message, user._id)
                                        ? (<p className={`${isLastMessage(messages, message, i) ? 'triangle' : ''}`}>
                                            {message.content}
                                        </p>)
                                        : (<>

                                            <p className={`${isLastMessage(messages, message, i) ? 'triangle' : ''}`}>
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
            </div>
            <ToastContainer />
        </>
    );
};

export default SingleChat;