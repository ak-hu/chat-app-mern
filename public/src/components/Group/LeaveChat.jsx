import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { removeGroupChatRoute } from "../../utils/APIRoutes";

function LeaveChat({ fetchAgain, setFetchAgain, setModalActive }) {
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [loading, setLoading] = useState(false);

    //styles for toast notification
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleRemove = async (user1) => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${removeGroupChatRoute}`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
            toast.success(`You succefuly leaved ${selectedChat.chatName}`, toastOptions);
        } catch (error) {
            toast.error(error.response.data.message, toastOptions);
            setLoading(false);
        }
    };

    return (
        <>
            <div className="leave-group">
                <div className='modal-container'>
                    <div className="width-100">
                        <div className="text">
                            <p> You cannot return this chat by yourself.</p>
                            <span>Are you sure you want to leave <b>{selectedChat.chatName}</b>?</span>
                        </div>
                        <div className='buttons'>
                            <button className='button secondary'
                                onClick={() => { handleRemove(user) }}>
                                Yes, I want to leave
                            </button>
                            <button className='button'
                                onClick={() => { setModalActive('not') }}>
                                No, I want to stay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>


    );
}

export default LeaveChat;