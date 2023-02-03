import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import styled from "styled-components";
import { ChatState } from "../context/ChatProvider";
import { removeGroupChatRoute } from "../utils/APIRoutes";

function SubmitModal({ fetchAgain, setFetchAgain, setModalActive }) {
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
            <Container>
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
            </Container>
            <ToastContainer />
        </>


    );
}
const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    width: 100vw;
    height: 100vh;
    z-index: 4;

    .modal-container{
        position: fixed;
        left: 30%;
        top: 20%;
        width: 500px;
        min-height: 220px;
        
        padding: 1.8rem 0 0.2rem 0;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 20px 20px rgba(0, 0, 0, 0.1);

        .width-100{
            width: inherit;
            display: grid;
            gap: 2rem;
            grid-template-rows: 70% 30%;
            justify-content: center;
            align-items: center;
        }

        .text{
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
        }

        .buttons{
            width: 450px;
            display: flex;
            gap: 1rem;

            .button{
                margin: 0;
                padding: 0.5rem 0;
                width: 50%;
            }

            .secondary{
                background-color: #999;
            }
        }


    }
`;

export default SubmitModal;