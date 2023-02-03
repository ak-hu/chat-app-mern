import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { GrFormClose } from "react-icons/gr";
import { BsPencil } from "react-icons/bs";
import { AiOutlineUserAdd } from "react-icons/ai";

import axios from "axios";
import styled from "styled-components";

import { ChatState } from "../../context/ChatProvider";
import { groupChatRoute, allUsersRoute } from "../../utils/APIRoutes";

import UserListItem from '../UserListItem'
import UserBage from './UserBage';

function GroupChatCreate({ setModalActive }) {
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

    //styles for toast notification
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };


    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast.warning("User already added", toastOptions);
            return;
        } else {
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const getUsers = async () => {
                const { data } = await axios.get(`${allUsersRoute}?search=${query}`, config);
                setLoading(false);
                setSearchResult(data);
            };
            getUsers();
        } catch (error) {
            toast.error("Failed to load the Search Results", toastOptions);
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!groupChatName || !selectedUsers) {
            toast.warning("Please fill all the feilds", toastOptions);
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `${groupChatRoute}`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );
            setChats([data, ...chats]);
            console.log(data)
            toast.success("New Group Chat Created!", toastOptions);
        } catch (error) {
            toast.error(error.response.data.message, toastOptions);
        }
    };
    return (
        <>
            <Container >
                <div className="modal-container">
                    <div className='close-button-wrapper'>
                        <button className='close-button' onClick={() => { setModalActive('not') }}>
                            <GrFormClose />
                        </button>
                    </div>
                    <div className='modal-header'>
                        <h2>Create Group Chat</h2>
                    </div>
                    <form className='modal-content' onSubmit={(event) => handleSubmit(event)}>
                        <div className='modal-input'>
                            <input
                                type="text"
                                placeholder="Chat Name"
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <BsPencil />
                        </div>
                        <div className='modal-input'>
                            <input
                                type="text"
                                placeholder="Add Users eg: John, Jane"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <AiOutlineUserAdd />
                        </div>
                        <div className='selected-users-wrapper'>
                            {selectedUsers.map((u) => (
                                <UserBage
                                    key={u._id}
                                    user={u}
                                    admin={user}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </div>
                        {loading ? (
                            // <ChatLoading />
                            <div>Loading...</div>
                        ) : (
                            searchResult?.slice(0, 4)
                                .map((result) => (
                                    <UserListItem
                                        key={result._id}
                                        result={result}
                                        handleFunction={() => handleGroup(result)}
                                    />
                                ))
                        )}
                        <div className='button-submit'>
                            <button className='button' type="submit">
                                Create Chat
                            </button>
                        </div>
                    </form>
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
        min-height: 300px;
        display: grid;
        grid-template-rows: 10% 90%;
        justify-content: center;
        align-items: center;
        padding: 1.8rem 0 0.2rem 0;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 20px 20px rgba(0, 0, 0, 0.1);

        .modal-header{
            width: 450px;
            text-align: center;
        }
        .close-button-wrapper{
            position: absolute;
            top: 2%;
            left: 92%;

            .close-button{
                border: none;
                background: transparent;
                font-size: 1.7rem;
            }
        }

        .modal-content{
            align-items: flex-start;

            .modal-input{
                position: relative;
                margin-top: 2rem;
                height: 40px;
                width: 100%;

                & + .modal-input{
                    margin-top: 2rem;
                }

                input{
                    padding: 0 35px;
                    height: 90%;
                    width: 60%;
                    border: none;
                    outline: none;
                    font-size: 16px;
                    border-bottom: 2px solid #ccc;
                    border-top: 2px solid transparent;
                    transition: all 0.2s ease;
          
                    &:focus{
                        border-bottom-color: #009688;
        
                        & ~ svg{
                            color: #009688;
                        }
                    }
                }
                svg {
                    position: absolute;
                    top: 35%;
                    left: 0;
                    transform: translateY(-50%);
                    color: #999;
                    font-size: 1.5rem;
                    transition: all 0.2s ease;
                }
            }
        }

        .button-submit{
            text-align: center;
        }
        .button{
            margin: 0;
            padding: 0.5rem 0;
            width: 50%;
        }
    }
    .selected-users-wrapper{
        display: flex;
        gap: 0.8rem;
        margin: 1rem 0;
    }
    .user-badge{
        background-color: #e5ddd5;
        padding: 5px 10px;
        border-radius: 5px;
        display: flex;
        gap: 0.5rem;

        button{
            border: none;
            background: transparent;
            text-align: center;
            font-size: 1rem;
            width: 1rem;
            height: 1rem;
        }
    }
`;

export default GroupChatCreate;