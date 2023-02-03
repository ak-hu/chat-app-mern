import { useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { BsPencil } from "react-icons/bs";
import { AiOutlineUserAdd } from "react-icons/ai";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";
import styled from "styled-components";

import { ChatState } from "../../context/ChatProvider";
import {
    allUsersRoute,
    updateGroupPicChatRoute,
    renameGroupChatRoute,
    addGroupChatRoute,
    removeGroupChatRoute
} from "../../utils/APIRoutes";
import UserListItem from "../UserListItem";
import UserBage from "./UserBage";

const UpdateGroupChat = ({ fetchAgain, setFetchAgain, setModalActive }) => {
    const [groupChatName, setGroupChatName] = useState();
    const [newGroupPic, setGroupPic] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const [isActive, setIsActive] = useState('not-active');

    const { selectedChat, setSelectedChat, user } = ChatState();

    //styles for toast notification
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const getImage = (event) => {
        setGroupPic({ ...newGroupPic, groupPic: event.target.files[0] })
    }

    const imageUpload = async () => {
        setIsActive('active');
        console.log(newGroupPic)

        try {
            console.log(newGroupPic)
            const groupPic = newGroupPic.groupPic;
            const formData = new FormData();
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            formData.append("chatId", selectedChat._id);
            if (groupPic) {
                formData.append("groupPic", groupPic, groupPic.name);
            };
            const { data } = await axios.put(
                `${updateGroupPicChatRoute}`, formData,
                config
            );

            setSelectedChat(data);
            console.log(data);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast.error(error.response.data.message, toastOptions);
        }
        setGroupPic("");
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

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${renameGroupChatRoute}`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast.error(error.response.data.message, toastOptions);
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast.error("User Already in group!", toastOptions);
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast.error("Only admins can add new users", toastOptions);
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `${addGroupChatRoute}`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast.error(error.response.data.message, toastOptions);
            setLoading(false);
        }
        setGroupChatName("");
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast.error("Only admins can remove users from group chat", toastOptions);
            return;
        }

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
        } catch (error) {
            toast.error(error.response.data.message, toastOptions);
            setLoading(false);
        }
        setGroupChatName("");
    };

    return (
        <>
            <Container>
                <div className="modal-container">
                    <div className='close-button-wrapper'>
                        <button className='close-button' onClick={() => { setModalActive('not') }}>
                            <GrFormClose />
                        </button>
                    </div>
                    <div className='modal-header'>
                        <div className="avatar">
                            <img src={process.env.REACT_APP_PROFILE_PICS_PATHS + selectedChat.groupPic}
                                alt={selectedChat.chatName}
                            />
                        </div>
                        <h2>{selectedChat.chatName}</h2>
                    </div>
                    <div className='modal-content' >
                        <div className='selected-users-wrapper'>
                            {selectedChat.users.map((u) => (
                                <UserBage
                                    key={u._id}
                                    user={u}
                                    admin={selectedChat.groupAdmin}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </div>
                        <div className="inputs">
                            <div className='modal-input'>
                                <input
                                    placeholder="Enter new chat name"
                                    value={groupChatName}
                                    onChange={(e) => setGroupChatName(e.target.value)}
                                />
                                <BsPencil />
                                <button onClick={handleRename}>
                                    Update
                                </button>
                            </div>
                            <div className="modal-input">
                                <input
                                    type="file"
                                    name="groupPic"
                                    accept="image/*"
                                    className={`${isActive === 'active' ? 'active' : ''}`}
                                    onChange={(event) => getImage(event)}
                                />
                                <MdOutlineAddAPhoto />
                                <button onClick={imageUpload}>upload</button>
                            </div>
                            <div className='modal-input'>
                                <input
                                    placeholder="Add User to group"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <AiOutlineUserAdd />
                            </div>
                        </div>

                        <div className="width-100">
                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                searchResult?.map((result) => (
                                    <UserListItem
                                        key={result._id}
                                        result={result}
                                        handleFunction={() => handleAddUser(result)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </Container>
            <ToastContainer />
        </>
    );
};

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    width: 100vw;
    height: 100vh;
    z-index: 4;

    .width-100{
        width: 100%;
    }

    .modal-container{
        position: fixed;
        left: 32%;
        top: 10%;
        width: 500px;
        min-height: 350px;
        display: grid;
        grid-template-rows: 10% 90%;
        justify-content: center;
        align-items: flex-start;
        gap: 2rem;
        padding: 1.8rem 0 0.2rem 0;

        background: #fff;
        border-radius: 10px;
        box-shadow: 0 20px 20px rgba(0, 0, 0, 0.1);

        .modal-header{
            width: 450px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;

            .avatar {
                img {
                  border-radius: 100%;
                  height: 3rem;
                  width: 3rem;
                }
              }
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
            gap: 2rem;
            display: flex;
            flex-direction: column;
            .inputs{
                width: 100%;
            }

            .modal-input{
                position: relative;
                height: 40px;
                width: 100%;
                & + .modal-input{
                    margin-top: 2rem;
                }
                input{
                    padding: 0 35px;
                    height: 90%;
                    width: 70%;
                    border: none;
                    outline: none;
                    font-size: 16px;
                    border-bottom: 2px solid #ccc;
                    border-top: 2px solid transparent;
                    transition: all 0.2s ease;
          
                    &[type="file"]{
                        height: 90%;
                        color: #747474;
                        padding-top: 1.5%;
                        border-bottom-color: #ccc;
            
                        &::-webkit-file-upload-button{
                          display:none;
                        }
                        &:focus{
                          border-bottom-color: #009688;
                        }
            
                        & ~ svg{
                          color: #999;
                        }
                    }
                    &:focus{
                        border-bottom-color: #009688;
          
                        & ~ svg{
                          color: #009688;
                        }
                    }
                    &:not(:placeholder-shown){
                        &:not([type="file" i]){
                            border-bottom-color: #009688;
            
                            & ~ svg{
                                color: #009688;
                            }
                        }
                    }
                }
                .active{
                    border-bottom-color: #009688 !important;
                    & ~ svg{
                      color: #009688 !important;
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

            .button-submit{
                text-align: center;
                width: 100%
            }
            .button{
                margin: 0;
                padding: 0.5rem 0;
                width: 50%;
            }
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

export default UpdateGroupChat;